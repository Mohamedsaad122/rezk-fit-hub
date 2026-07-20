import { API_ENDPOINTS } from '@/constants/api.constants';
import api from '@/api/axios';
import AppConfig from '@/config/app.config';
import { mockDatabase } from '@/mocks/mockDatabase';
import { simulateApi } from '@/utils/mockApi.helper';
import { parseApiResponse } from '@/utils/parseApiResponse';
import { 
    NotificationResponseSchema, 
    NotificationListResponseSchema,
    NotificationSettingsSchema
} from '@/contracts/notification.contract';
import { createPaginatedResponseSchema } from '@/contracts/pagination.contract';

/**
 * Standardized Notification Repository.
 * Handles fetching, mutating, marking read, archiving, and configuring settings.
 */
export const NotificationRepository = {
    getAll: async (options = {}) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => {
                const allNotifications = mockDatabase.notifications.getAll();
                let filtered = [...allNotifications];

                // Status filtering (Unread, Read, Archived)
                if (options.status && options.status !== 'All') {
                    filtered = filtered.filter(n => n.status.toLowerCase() === options.status.toLowerCase());
                }

                // Priority filtering (Low, Normal, High, Critical)
                if (options.priority && options.priority !== 'All') {
                    filtered = filtered.filter(n => n.priority.toLowerCase() === options.priority.toLowerCase());
                }

                // Search filtering
                if (options.search) {
                    const term = options.search.toLowerCase().trim();
                    filtered = filtered.filter(n => 
                        n.title.toLowerCase().includes(term) || 
                        n.description.toLowerCase().includes(term)
                    );
                }

                // Sorting
                if (options.sortBy) {
                    if (options.sortBy === 'Newest') {
                        filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
                    } else if (options.sortBy === 'Oldest') {
                        filtered.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
                    } else if (options.sortBy === 'Priority') {
                        const priorityWeight = { Critical: 4, High: 3, Normal: 2, Low: 1 };
                        filtered.sort((a, b) => (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0));
                    }
                } else {
                    // Default: newest first
                    filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
                }

                // Pagination
                const page = Number(options.page || 1);
                const limit = Number(options.limit || 10);
                const total = filtered.length;
                const totalPages = Math.ceil(total / limit);
                const start = (page - 1) * limit;
                const sliced = filtered.slice(start, start + limit);

                return {
                    data: sliced,
                    meta: { page, limit, total, totalPages }
                };
            });
        } else {
            const response = await api.get(API_ENDPOINTS.NOTIFICATIONS.BASE, { params: options });
            result = response.data;
        }

        if (result && result.data && result.meta) {
            const PaginatedSchema = createPaginatedResponseSchema(NotificationResponseSchema);
            return parseApiResponse(PaginatedSchema, result, 'Notification Paginated List');
        }
        return parseApiResponse(NotificationListResponseSchema, result, 'Notification List');
    },

    getById: async (id) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.notifications.getById(id));
        } else {
            const response = await api.get(API_ENDPOINTS.NOTIFICATIONS.DETAIL(id));
            result = response.data;
        }

        if (result === null) return null;
        return parseApiResponse(NotificationResponseSchema, result, 'Notification Details');
    },

    create: async (notificationData) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.notifications.create(notificationData));
        } else {
            const response = await api.post(API_ENDPOINTS.NOTIFICATIONS.BASE, notificationData);
            result = response.data;
        }

        return parseApiResponse(NotificationResponseSchema, result, 'Notification Create');
    },

    update: async (id, notificationData) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.notifications.update(id, notificationData));
        } else {
            const response = await api.put(API_ENDPOINTS.NOTIFICATIONS.DETAIL(id), notificationData);
            result = response.data;
        }

        return parseApiResponse(NotificationResponseSchema, result, 'Notification Update');
    },

    delete: async (id) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.notifications.delete(id));
        } else {
            const response = await api.delete(API_ENDPOINTS.NOTIFICATIONS.DETAIL(id));
            result = response.data;
        }

        return !!result;
    },

    markAllRead: async () => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.notifications.markAllAsRead());
        } else {
            const response = await api.post(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
            result = response.data;
        }

        return !!result;
    },

    getSettings: async () => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => {
                const settingsStr = localStorage.getItem('rezk_fit_notification_settings');
                if (settingsStr) {
                    try {
                        const parsed = JSON.parse(settingsStr);
                        if (parsed && parsed.state && parsed.state.settings) {
                            return parsed.state.settings;
                        }
                    } catch {
                        // ignore
                    }
                }
                return {
                    categories: {
                        appointment: true,
                        workout: true,
                        nutrition: true,
                        client: true,
                        assessment: true,
                        progress: true,
                        system: true
                    },
                    muteReminders: false,
                    reminderTiming: 15,
                    soundEnabled: true,
                    desktopNotifications: true
                };
            });
        } else {
            const response = await api.get(API_ENDPOINTS.NOTIFICATIONS.SETTINGS);
            result = response.data;
        }

        return parseApiResponse(NotificationSettingsSchema, result, 'Notification Settings');
    },

    updateSettings: async (settingsData) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => {
                const settingsStr = localStorage.getItem('rezk_fit_notification_settings');
                let currentState = { state: { settings: settingsData } };
                if (settingsStr) {
                    try {
                        const parsed = JSON.parse(settingsStr);
                        parsed.state.settings = {
                            ...parsed.state.settings,
                            ...settingsData,
                            categories: settingsData.categories
                                ? { ...parsed.state.settings.categories, ...settingsData.categories }
                                : parsed.state.settings.categories
                        };
                        currentState = parsed;
                    } catch {
                        // ignore
                    }
                }
                localStorage.setItem('rezk_fit_notification_settings', JSON.stringify(currentState));
                return currentState.state.settings;
            });
        } else {
            const response = await api.put(API_ENDPOINTS.NOTIFICATIONS.SETTINGS, settingsData);
            result = response.data;
        }

        return parseApiResponse(NotificationSettingsSchema, result, 'Notification Settings Update');
    }
};

export default NotificationRepository;
