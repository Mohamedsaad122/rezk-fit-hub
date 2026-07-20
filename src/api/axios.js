import axios from 'axios';
import AppConfig from '@/config/app.config';
import { useAuthStore } from '@/store/auth.store';
import { useNetworkStore } from '@/store/network.store';
import { API_ENDPOINTS } from '@/constants/api.constants';
import {
    ApiError,
    ValidationError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    ServerError,
    BadRequestError,
    ConflictError,
    RateLimitError,
    ServiceUnavailableError
} from './errors';
import { normalizeError } from './error-handler';

export {
    ApiError,
    ValidationError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    ServerError,
    BadRequestError,
    ConflictError,
    RateLimitError,
    ServiceUnavailableError,
    normalizeError
};

/**
 * Case Conversion Utilities.
 */
export const snakeToCamel = (str) => {
    return str.replace(/([-_][a-z])/gi, ($1) => {
        return $1.toUpperCase().replace('-', '').replace('_', '');
    });
};

export const camelToSnake = (str) => {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

export const keysToCamel = (obj) => {
    if (obj instanceof FormData) return obj;
    if (obj instanceof File || obj instanceof Blob) return obj;
    if (Array.isArray(obj)) {
        return obj.map(v => keysToCamel(v));
    } else if (obj !== null && obj.constructor === Object) {
        return Object.keys(obj).reduce((result, key) => {
            const camelKey = snakeToCamel(key);
            result[camelKey] = keysToCamel(obj[key]);
            return result;
        }, {});
    }
    // Automatically parse matching ISO date strings
    if (typeof obj === 'string') {
        const isoDateReg = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?$/;
        if (isoDateReg.test(obj)) {
            const parsed = new Date(obj);
            if (!isNaN(parsed.getTime())) {
                return parsed;
            }
        }
    }
    return obj;
};

export const keysToSnake = (obj) => {
    if (obj instanceof FormData) return obj;
    if (obj instanceof File || obj instanceof Blob) return obj;
    if (Array.isArray(obj)) {
        return obj.map(v => keysToSnake(v));
    } else if (obj !== null && typeof obj === 'object') {
        return Object.keys(obj).reduce((result, key) => {
            const snakeKey = camelToSnake(key);
            result[snakeKey] = keysToSnake(obj[key]);
            return result;
        }, {});
    }
    return obj;
};

/**
 * Centralized Axios instance configuration.
 */
const apiInstance = axios.create({
    baseURL: AppConfig.apiUrl,
    timeout: AppConfig.requestTimeout || 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Interceptor-free Axios instance to run token refresh calls safely
const refreshInstance = axios.create({
    baseURL: AppConfig.apiUrl,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Silent refresh state tracking variables
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Inline mock refresh resolver to make Mock Mode behave statefully
const simulateMockRefresh = (refreshToken) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                data: {
                    accessToken: `mock-jwt-accessToken-refreshed-${Math.random().toString(36).substr(2, 9)}`,
                    refreshToken: refreshToken
                }
            });
        }, 500);
    });
};

// Request Interceptor: Attach authentication token, case conversions, and version routing prefix
apiInstance.interceptors.request.use(
    (config) => {
        // Track requests count
        useNetworkStore.getState().incrementRequests();

        // 1. Versioning prefix resolver
        if (config.version) {
            const version = config.version;
            if (config.url && !config.url.startsWith('http')) {
                const rawUrl = config.url.startsWith('/') ? config.url.substring(1) : config.url;
                config.url = `/${version}/${rawUrl}`;
            }
        }

        // 2. Serialization: camelCase -> snake_case
        if (config.data) {
            config.data = keysToSnake(config.data);
        }
        if (config.params) {
            config.params = keysToSnake(config.params);
        }

        const token = useAuthStore.getState().accessToken;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        useNetworkStore.getState().decrementRequests();
        return Promise.reject(normalizeError(error));
    }
);

// Response Interceptor: Handle global 401 response status, case conversions, and error normalizations
apiInstance.interceptors.response.use(
    (response) => {
        useNetworkStore.getState().decrementRequests();

        // Deserialization: snake_case -> camelCase
        if (response.data) {
            response.data = keysToCamel(response.data);
        }
        return response;
    },
    async (error) => {
        useNetworkStore.getState().decrementRequests();

        // Check if maintenance mode was hit (503 Service Unavailable)
        if (error.response && error.response.status === 503) {
            useNetworkStore.getState().setMaintenance(true);
        }

        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = useAuthStore.getState().refreshToken;

            // If no refresh token exists, immediately wipe session and redirect
            if (!refreshToken) {
                useAuthStore.getState().clearSession();
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }
                return Promise.reject(normalizeError(error));
            }

            // Queue concurrent 401 calls while refresh operation executes
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                .then((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return apiInstance(originalRequest);
                })
                .catch((err) => {
                    return Promise.reject(err);
                });
            }

            isRefreshing = true;
            useNetworkStore.getState().incrementRequests();

            return new Promise((resolve, reject) => {
                const refreshCall = AppConfig.enableMock
                    ? simulateMockRefresh(refreshToken)
                    : refreshInstance.post(API_ENDPOINTS.AUTH.REFRESH, { refreshToken });

                refreshCall
                    .then((res) => {
                        useNetworkStore.getState().decrementRequests();
                        const { accessToken, refreshToken: newRefreshToken } = keysToCamel(res.data);
                        
                        // Update persisted Zustand session store
                        useAuthStore.getState().login({
                            user: useAuthStore.getState().user,
                            accessToken,
                            refreshToken: newRefreshToken || refreshToken
                        });

                        // Resolve queued pending requests
                        processQueue(null, accessToken);

                        // Retry original failed request
                        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                        resolve(apiInstance(originalRequest));
                    })
                    .catch((refreshError) => {
                        useNetworkStore.getState().decrementRequests();
                        processQueue(refreshError, null);
                        
                        // Wipe full session on refresh failure
                        useAuthStore.getState().clearSession();
                        if (typeof window !== 'undefined') {
                            window.location.href = '/login';
                        }
                        reject(normalizeError(refreshError));
                    })
                    .finally(() => {
                        isRefreshing = false;
                    });
            });
        }

        return Promise.reject(normalizeError(error));
    }
);

export default apiInstance;
