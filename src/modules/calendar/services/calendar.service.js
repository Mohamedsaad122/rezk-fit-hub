import { CalendarRepository } from '../repositories/calendar.repository';

/**
 * Service acting as business logic orchestrator for scheduling features.
 * Fully decoupled from UI parameters and styling variables.
 */
export const CalendarService = {
    getAllEvents: (options = {}) => {
        return CalendarRepository.getAll(options);
    },

    getEventById: (id) => {
        return CalendarRepository.getById(id);
    },

    createEvent: (eventData) => {
        return CalendarRepository.create(eventData);
    },

    updateEvent: (id, eventData) => {
        return CalendarRepository.update(id, eventData);
    },

    deleteEvent: (id) => {
        return CalendarRepository.delete(id);
    },

    getEventsByDate: (date) => {
        return CalendarRepository.getByDate(date);
    },

    getEventsByMonth: (month) => {
        return CalendarRepository.getByMonth(month);
    },

    getEventsByWeek: (start, end) => {
        return CalendarRepository.getByWeek(start, end);
    },

    lockEvent: (id, username) => {
        return CalendarRepository.lock(id, username);
    },

    unlockEvent: (id) => {
        return CalendarRepository.unlock(id);
    },

    checkConflicts: (eventData) => {
        return CalendarRepository.checkConflicts(eventData);
    },

    getAvailableSlots: (date, resourceId, resourceType) => {
        return CalendarRepository.getAvailableSlots(date, resourceId, resourceType);
    },

    getAnalytics: () => {
        return CalendarRepository.getAnalytics();
    }
};

export default CalendarService;
