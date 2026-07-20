import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CalendarService } from '../services/calendar.service';
import QUERY_KEYS from '@/constants/queryKeys';
import { toastService } from '@/services/toast.service';

/**
 * Hook to retrieve filtered/sorted calendar events.
 * @param {object} options - Filters and sorting flags.
 */
export const useCalendar = (options = {}) => {
    return useQuery({
        queryKey: QUERY_KEYS.calendar.filters(options),
        queryFn: () => CalendarService.getAllEvents(options),
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
        refetchOnReconnect: true
    });
};

/**
 * Hook to retrieve calendar events for a specific single day.
 */
export const useCalendarDay = (date) => {
    return useQuery({
        queryKey: QUERY_KEYS.calendar.day(date),
        queryFn: () => CalendarService.getEventsByDate(date),
        enabled: !!date,
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
        refetchOnReconnect: true
    });
};

/**
 * Hook to retrieve calendar events for a specific week surrounding a date.
 */
export const useCalendarWeek = (date) => {
    const calculateWeekRange = (dateStr) => {
        if (!dateStr) return { start: '', end: '' };
        const current = new Date(dateStr);
        const day = current.getDay(); // 0 is Sunday, 1 is Monday...
        const diffToSunday = current.getDate() - day;
        
        const sunday = new Date(current.setDate(diffToSunday));
        const saturday = new Date(current.setDate(diffToSunday + 6));
        
        const toYMD = (d) => {
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const dayStr = String(d.getDate()).padStart(2, '0');
            return `${year}-${month}-${dayStr}`;
        };
        
        return {
            start: toYMD(sunday),
            end: toYMD(saturday)
        };
    };

    const { start, end } = calculateWeekRange(date);

    return useQuery({
        queryKey: QUERY_KEYS.calendar.week(date),
        queryFn: () => CalendarService.getEventsByWeek(start, end),
        enabled: !!start && !!end,
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
        refetchOnReconnect: true
    });
};

/**
 * Hook to retrieve calendar events for a specific month.
 */
export const useCalendarMonth = (date) => {
    const month = date ? date.slice(0, 7) : '';

    return useQuery({
        queryKey: QUERY_KEYS.calendar.month(date),
        queryFn: () => CalendarService.getEventsByMonth(month),
        enabled: !!month,
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
        refetchOnReconnect: true
    });
};

/**
 * Hook to retrieve upcoming appointments (after today).
 */
export const useUpcomingAppointments = () => {
    return useQuery({
        queryKey: QUERY_KEYS.calendar.upcoming(),
        queryFn: async () => {
            const all = await CalendarService.getAllEvents();
            const todayStr = "2026-07-13";
            return all
                .filter(e => e.date > todayStr)
                .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime));
        },
        staleTime: 30 * 1000,
        gcTime: 2 * 60 * 1000,
        refetchOnReconnect: true
    });
};

/**
 * Hook to retrieve today's appointments.
 */
export const useTodayAppointments = () => {
    return useQuery({
        queryKey: QUERY_KEYS.calendar.today(),
        queryFn: async () => {
            const all = await CalendarService.getAllEvents();
            const todayStr = "2026-07-13";
            return all
                .filter(e => e.date === todayStr)
                .sort((a, b) => a.startTime.localeCompare(b.startTime));
        },
        staleTime: 30 * 1000,
        gcTime: 2 * 60 * 1000,
        refetchOnReconnect: true
    });
};

/**
 * Hook to retrieve details of a specific single appointment.
 */
export const useAppointment = (id) => {
    return useQuery({
        queryKey: QUERY_KEYS.calendar.detail(id),
        queryFn: () => CalendarService.getEventById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnReconnect: true
    });
};

/**
 * Mutation hook to create a new calendar event / appointment.
 */
export const useCreateCalendarEvent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (eventData) => CalendarService.createEvent(eventData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.calendar.all });
            queryClient.invalidateQueries({ queryKey: ['calendar', 'list'] });
            toastService.success('تم حجز الموعد بنجاح');
        },
        onError: (error) => {
            toastService.error('فشل حجز الموعد', error.message);
        }
    });
};

/**
 * Mutation hook to update an existing calendar event / appointment.
 * Implements optimistic updates and manual rollbacks.
 */
export const useUpdateCalendarEvent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, eventData }) => CalendarService.updateEvent(id, eventData),
        onMutate: async ({ id, eventData }) => {
            const detailKey = QUERY_KEYS.calendar.detail(id);
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.calendar.all });
            await queryClient.cancelQueries({ queryKey: detailKey });

            const previousEvent = queryClient.getQueryData(detailKey);
            
            if (previousEvent) {
                queryClient.setQueryData(detailKey, {
                    ...previousEvent,
                    ...eventData
                });
            }

            return { previousEvent, id };
        },
        onError: (error, _, context) => {
            if (context?.previousEvent) {
                queryClient.setQueryData(QUERY_KEYS.calendar.detail(context.id), context.previousEvent);
            }
            toastService.error('فشل تحديث الموعد', error.message);
        },
        onSuccess: (data, { id }) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.calendar.all });
            queryClient.invalidateQueries({ queryKey: ['calendar', 'list'] });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.calendar.detail(id) });
            toastService.success('تم تحديث الموعد بنجاح');
        }
    });
};

/**
 * Mutation hook to delete a calendar event / appointment.
 */
export const useDeleteCalendarEvent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => CalendarService.deleteEvent(id),
        onSuccess: (data, id) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.calendar.all });
            queryClient.invalidateQueries({ queryKey: ['calendar', 'list'] });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.calendar.detail(id) });
            toastService.success('تم إلغاء وحذف الموعد بنجاح');
        },
        onError: (error) => {
            toastService.error('فشل حذف الموعد', error.message);
        }
    });
};

/**
 * Mutation hook to acquire an optimistic edit lock on an appointment.
 */
export const useLockAppointment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, username }) => CalendarService.lockEvent(id, username),
        onSuccess: (data, { id }) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.calendar.detail(id) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.calendar.all });
        }
    });
};

/**
 * Mutation hook to manually release an optimistic edit lock on an appointment.
 */
export const useUnlockAppointment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => CalendarService.unlockEvent(id),
        onSuccess: (data, id) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.calendar.detail(id) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.calendar.all });
        }
    });
};

/**
 * Mutation hook to validate event data and detect overlapping resource conflicts.
 */
export const useCheckConflicts = () => {
    return useMutation({
        mutationFn: (eventData) => CalendarService.checkConflicts(eventData)
    });
};

/**
 * Query hook to retrieve available hourly scheduling slots for a specific resource.
 */
export const useAvailableSlots = (date, resourceId, resourceType) => {
    return useQuery({
        queryKey: ['calendar', 'slots', date, resourceId, resourceType],
        queryFn: () => CalendarService.getAvailableSlots(date, resourceId, resourceType),
        enabled: !!date && !!resourceId && !!resourceType,
        staleTime: 5000
    });
};

/**
 * Query hook to retrieve utilization metrics and calendar KPIs.
 */
export const useCalendarAnalytics = () => {
    return useQuery({
        queryKey: ['calendar', 'analytics'],
        queryFn: () => CalendarService.getAnalytics(),
        staleTime: 30 * 1000
    });
};
