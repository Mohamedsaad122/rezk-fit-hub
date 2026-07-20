import { API_ENDPOINTS } from '@/api/endpoints';
import api from '@/api/axios';
import AppConfig from '@/config/app.config';
import { mockDatabase } from '@/mocks/mockDatabase';
import { simulateApi } from '@/utils/mockApi.helper';
import { parseApiResponse } from '@/utils/parseApiResponse';
import { 
    CalendarEventResponseSchema, 
    CalendarEventListResponseSchema 
} from '../contracts/calendar.contract';

/**
 * Standardized Calendar and Events Scheduling Repository.
 * Transparently hooks raw network configurations or local memory database queries.
 */
export const CalendarRepository = {
    getAll: async (options = {}) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => {
                let list = mockDatabase.calendarEvents.getAll();

                // 1. Apply Filters
                if (options.search) {
                    const term = options.search.toLowerCase().trim();
                    list = list.filter(e => 
                        e.title.toLowerCase().includes(term) || 
                        e.description.toLowerCase().includes(term) ||
                        (e.notes && e.notes.toLowerCase().includes(term))
                    );
                }
                if (options.status) {
                    list = list.filter(e => e.status === options.status);
                }
                if (options.type) {
                    list = list.filter(e => e.type === options.type);
                }
                if (options.coachId) {
                    list = list.filter(e => String(e.coachId) === String(options.coachId));
                }
                if (options.clientId) {
                    list = list.filter(e => String(e.clientId) === String(options.clientId));
                }
                if (options.date) {
                    list = list.filter(e => e.date === options.date);
                }
                if (options.month) {
                    list = list.filter(e => e.date.startsWith(options.month));
                }
                if (options.startDate && options.endDate) {
                    list = list.filter(e => e.date >= options.startDate && e.date <= options.endDate);
                }

                // 2. Apply Sorting
                if (options.sortBy) {
                    if (options.sortBy === 'Newest') {
                        list = list.sort((a, b) => {
                            const dateA = a.createdAt || '';
                            const dateB = b.createdAt || '';
                            return dateB.localeCompare(dateA);
                        });
                    } else if (options.sortBy === 'Oldest') {
                        list = list.sort((a, b) => {
                            const dateA = a.createdAt || '';
                            const dateB = b.createdAt || '';
                            return dateA.localeCompare(dateB);
                        });
                    } else if (options.sortBy === 'Start Time') {
                        list = list.sort((a, b) => a.startTime.localeCompare(b.startTime));
                    } else if (options.sortBy === 'End Time') {
                        list = list.sort((a, b) => a.endTime.localeCompare(b.endTime));
                    } else if (options.sortBy === 'Status') {
                        list = list.sort((a, b) => a.status.localeCompare(b.status));
                    }
                }

                return list;
            });
        } else {
            const response = await api.get(API_ENDPOINTS.CALENDAR.BASE, { params: options });
            result = response.data;
        }
        return parseApiResponse(CalendarEventListResponseSchema, result, 'Calendar Event List');
    },

    getById: async (id) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.calendarEvents.getById(id));
        } else {
            const response = await api.get(API_ENDPOINTS.CALENDAR.DETAIL(id));
            result = response.data;
        }
        if (result === null) return null;
        return parseApiResponse(CalendarEventResponseSchema, result, 'Calendar Event Detail');
    },

    create: async (eventData) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.calendarEvents.create(eventData));
        } else {
            const response = await api.post(API_ENDPOINTS.CALENDAR.BASE, eventData);
            result = response.data;
        }
        return parseApiResponse(CalendarEventResponseSchema, result, 'Calendar Event Create');
    },

    update: async (id, eventData) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.calendarEvents.update(id, eventData));
        } else {
            const response = await api.put(API_ENDPOINTS.CALENDAR.DETAIL(id), eventData);
            result = response.data;
        }
        return parseApiResponse(CalendarEventResponseSchema, result, 'Calendar Event Update');
    },

    delete: async (id) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.calendarEvents.delete(id));
        } else {
            await api.delete(API_ENDPOINTS.CALENDAR.DETAIL(id));
            result = true;
        }
        return !!result;
    },

    getByDate: async (date) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.calendarEvents.getByDate(date));
        } else {
            const response = await api.get(API_ENDPOINTS.CALENDAR.BY_DATE(date));
            result = response.data;
        }
        return parseApiResponse(CalendarEventListResponseSchema, result, 'Calendar Events by Date');
    },

    getByMonth: async (month) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.calendarEvents.getByMonth(month));
        } else {
            const response = await api.get(API_ENDPOINTS.CALENDAR.BY_MONTH(month));
            result = response.data;
        }
        return parseApiResponse(CalendarEventListResponseSchema, result, 'Calendar Events by Month');
    },

    getByWeek: async (start, end) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.calendarEvents.getByWeek(start, end));
        } else {
            const response = await api.get(API_ENDPOINTS.CALENDAR.BY_WEEK(start, end));
            result = response.data;
        }
        return parseApiResponse(CalendarEventListResponseSchema, result, 'Calendar Events by Week');
    },

    lock: async (id, username) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.calendarEvents.lock(id, username));
        } else {
            const response = await api.post(`/api/calendar/${id}/lock`, { username });
            result = response.data;
        }
        return parseApiResponse(CalendarEventResponseSchema, result, 'Calendar Event Lock');
    },

    unlock: async (id) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.calendarEvents.unlock(id));
        } else {
            const response = await api.post(`/api/calendar/${id}/unlock`);
            result = response.data;
        }
        return parseApiResponse(CalendarEventResponseSchema, result, 'Calendar Event Unlock');
    },

    checkConflicts: async (eventData) => {
        if (AppConfig.enableMock) {
            return await simulateApi(() => mockDatabase.calendarEvents.checkConflicts(eventData));
        } else {
            const response = await api.post('/api/calendar/conflicts', eventData);
            return response.data;
        }
    },

    getAvailableSlots: async (date, resourceId, resourceType) => {
        if (AppConfig.enableMock) {
            return await simulateApi(() => mockDatabase.calendarEvents.getAvailableSlots(date, resourceId, resourceType));
        } else {
            const response = await api.get('/api/calendar/slots', { params: { date, resourceId, resourceType } });
            return response.data;
        }
    },

    getAnalytics: async () => {
        if (AppConfig.enableMock) {
            return await simulateApi(() => mockDatabase.calendarEvents.getAnalytics());
        } else {
            const response = await api.get('/api/calendar/analytics');
            return response.data;
        }
    }
};

export default CalendarRepository;
