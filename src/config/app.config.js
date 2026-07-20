/**
 * Application centralized configuration registry.
 * Resolves environmental variables and maps feature flags.
 */
export const AppConfig = {
    appName: import.meta.env.VITE_APP_NAME || 'Rezk Fit Hub',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    apiMode: import.meta.env.VITE_API_MODE || 'mock', // 'mock' | 'staging' | 'production'
    apiUrl: import.meta.env.VITE_API_MODE === 'production'
        ? (import.meta.env.VITE_API_PRODUCTION_URL || 'https://api.rezkfit.com/api')
        : import.meta.env.VITE_API_MODE === 'staging'
        ? (import.meta.env.VITE_API_STAGING_URL || 'https://staging-api.rezkfit.com/api')
        : (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:8000/api'),
    enableMock: (import.meta.env.VITE_API_MODE || 'mock') === 'mock',
    enableRealtime: import.meta.env.VITE_ENABLE_REALTIME !== 'false',
    realtimeMode: import.meta.env.VITE_REALTIME_MODE || 'mock', // 'mock' | 'socket' | 'disabled'
    realtimeUrl: import.meta.env.VITE_REALTIME_URL || 'http://localhost:8000',
    requestTimeout: parseInt(import.meta.env.VITE_REQUEST_TIMEOUT || '10000', 10),
    enableDevtools: import.meta.env.VITE_ENABLE_DEVTOOLS === 'true',
    logLevel: import.meta.env.VITE_LOG_LEVEL || 'info',
    failureRate: parseFloat(import.meta.env.VITE_MOCK_FAILURE_RATE || '0.0'),
    featureFlags: {
        enableVideoUpload: false,
        enableNotifications: false,
    }
};

export default AppConfig;
