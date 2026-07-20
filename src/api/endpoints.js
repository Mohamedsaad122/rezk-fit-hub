/**
 * Centralized API Endpoints Registry.
 * Grouped logically by application modules.
 */
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh',
        ME: '/auth/me',
    },
    CLIENTS: {
        BASE: '/trainees',
        DETAIL: (id) => `/trainees/${id}`,
        STATS: (id) => `/trainees/${id}/stats`,
    },
    EXERCISES: {
        BASE: '/exercises',
        DETAIL: (id) => `/exercises/${id}`,
        CATEGORY: (category) => `/exercises/category/${category}`,
    },
    NUTRITION: {
        BASE: '/nutrition-plans',
        DETAIL: (id) => `/nutrition-plans/${id}`,
    },
    DASHBOARD: {
        OVERVIEW: '/stats/overview',
        MONTHLY: '/stats/monthly',
        TOP_TRAINEES: '/stats/top-trainees',
        RECENT_ACTIVITIES: '/stats/recent-activities',
    },
    PROFILE: {
        BASE: '/profile',
    },
    CALENDAR: {
        BASE: '/calendar/events',
        DETAIL: (id) => `/calendar/events/${id}`,
        BY_DATE: (date) => `/calendar/events/date/${date}`,
        BY_MONTH: (month) => `/calendar/events/month/${month}`,
        BY_WEEK: (start, end) => `/calendar/events/week?start=${start}&end=${end}`,
    },
    NOTIFICATIONS: {
        BASE: '/notifications',
        DETAIL: (id) => `/notifications/${id}`,
        MARK_ALL_READ: '/notifications/mark-all-read',
        SETTINGS: '/notifications/settings',
    },
    TASKS: {
        BASE: '/tasks',
        DETAIL: (id) => `/tasks/${id}`,
        BULK: '/tasks/bulk',
        STATS: '/tasks/statistics',
    }
};

export default API_ENDPOINTS;
