/**
 * Centralized React Query Keys.
 * Standardizes cache keys for all dynamic modules in the application.
 */
export const QUERY_KEYS = {
    dashboard: {
        stats: ['dashboard', 'stats'],
        activities: ['dashboard', 'activities'],
        monthly: ['dashboard', 'monthly'],
        trainees: ['dashboard', 'trainees'],
    },
    clients: {
        all: ['clients'],
        lists: () => ['clients', 'list'],
        list: (filters) => ['clients', 'list', filters],
        details: () => ['clients', 'detail'],
        detail: (id) => ['clients', 'detail', id],
    },
    exercises: {
        all: ['exercises'],
        lists: () => ['exercises', 'list'],
        list: (filters) => ['exercises', 'list', filters],
        detail: (id) => ['exercises', 'detail', id],
        byCategory: (categoryId) => ['exercises', 'category', categoryId],
    },
    nutrition: {
        all: ['nutrition'],
        lists: () => ['nutrition', 'plans'],
        list: (filters) => ['nutrition', 'plans', filters],
        detail: (id) => ['nutrition', 'detail', id],
    },
    profile: {
        me: ['profile', 'me'],
    },
    auth: {
        session: ['auth', 'session'],
    },
    calendar: {
        all: ['calendar'],
        day: (date) => ['calendar', 'day', date],
        week: (date) => ['calendar', 'week', date],
        month: (date) => ['calendar', 'month', date],
        detail: (id) => ['calendar', 'detail', id],
        filters: (filters) => ['calendar', 'list', 'filters', filters],
        search: (term) => ['calendar', 'list', 'search', term],
        today: () => ['calendar', 'list', 'today'],
        upcoming: () => ['calendar', 'list', 'upcoming']
    },
    notifications: {
        all: ['notifications', 'all'],
        unread: ['notifications', 'unread'],
        archived: ['notifications', 'archived'],
        settings: ['notifications', 'settings'],
    },
    tasks: {
        all: ['tasks', 'all'],
        lists: () => ['tasks', 'list'],
        list: (filters) => ['tasks', 'list', filters],
        details: () => ['tasks', 'detail'],
        detail: (id) => ['tasks', 'detail', id],
        today: () => ['tasks', 'today'],
        overdue: () => ['tasks', 'overdue'],
        completed: () => ['tasks', 'completed'],
        statistics: () => ['tasks', 'statistics']
    },
    documents: {
        all: ['documents', 'all'],
        list: (filters) => ['documents', 'list', filters],
        detail: (id) => ['documents', 'detail', id],
        recent: () => ['documents', 'recent'],
        storage: () => ['documents', 'storage'],
    },
    media: {
        all: ['media', 'all'],
        list: (filters) => ['media', 'list', filters],
        detail: (id) => ['media', 'detail', id],
    },
    adminUsers: {
        all: ['adminUsers', 'all'],
        list: (filters) => ['adminUsers', 'list', filters],
        detail: (id) => ['adminUsers', 'detail', id]
    },
    branches: {
        all: ['branches', 'all'],
        list: (filters) => ['branches', 'list', filters],
        detail: (id) => ['branches', 'detail', id]
    },
    auditLogs: {
        all: ['auditLogs', 'all'],
        list: (filters) => ['auditLogs', 'list', filters]
    }
};

export default QUERY_KEYS;
