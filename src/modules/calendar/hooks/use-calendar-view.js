import { useCalendarStore } from '@/store/calendar.store';
import { useUpdateCalendarEvent } from './use-calendar';
import { detectConflict } from '../utils/calendar-utils';
import { toastService } from '@/services/toast.service';

/**
 * Hook to retrieve persistent Zustand calendar settings.
 */
export const useCalendarView = () => {
    const store = useCalendarStore();
    return {
        currentView: store.currentView,
        selectedDate: store.selectedDate,
        collapsedPanels: store.collapsedPanels,
        setView: store.setView,
        setSelectedDate: store.setSelectedDate,
        togglePanels: store.togglePanels,
        setCollapsedPanels: store.setCollapsedPanels,
    };
};

/**
 * Hook to navigate through scheduling dates based on active view modes.
 */
export const useCalendarNavigation = () => {
    const { currentView, selectedDate, setSelectedDate } = useCalendarView();

    const navigate = (direction) => {
        const offset = direction === 'next' ? 1 : -1;
        const current = new Date(selectedDate);

        if (currentView === 'Month') {
            current.setMonth(current.getMonth() + offset);
        } else if (currentView === 'Week') {
            current.setDate(current.getDate() + (offset * 7));
        } else {
            // Day or Agenda view offset
            current.setDate(current.getDate() + offset);
        }

        setSelectedDate(current.toISOString().split('T')[0]);
    };

    const next = () => navigate('next');
    const prev = () => navigate('prev');
    const today = () => setSelectedDate('2026-07-13'); // Context anchor date

    return { next, prev, today };
};

/**
 * Hook managing scheduling updates with collision safety parameters.
 */
export const useCalendarDnD = (eventsOrRefetch = []) => {
    const { mutate: updateEvent } = useUpdateCalendarEvent();

    const moveEvent = (event, newDate, newStartTime, newEndTime) => {
        const updatedProps = {
            ...event,
            date: newDate,
            startTime: newStartTime,
            endTime: newEndTime
        };

        const eventsList = Array.isArray(eventsOrRefetch) ? eventsOrRefetch : [];
        const conflict = eventsList.some(item => detectConflict(updatedProps, item));
        if (conflict) {
            toastService.warning('تنبيه تعارض مواعيد', 'المدرب أو المتدرب لديه موعد آخر متعارض مع هذا التوقيت.');
            return false;
        }

        updateEvent({ id: event.id, eventData: updatedProps });
        return true;
    };

    const resizeEvent = (event, deltaMinutes, direction = 'bottom') => {
        const parseTime = (t) => {
            const [h, m] = t.split(':').map(Number);
            return h * 60 + m;
        };

        const formatTime = (mins) => {
            const h = String(Math.floor(mins / 60)).padStart(2, '0');
            const m = String(mins % 60).padStart(2, '0');
            return `${h}:${m}`;
        };

        const startMins = parseTime(event.startTime);
        const endMins = parseTime(event.endTime);

        let finalStart = startMins;
        let finalEnd = endMins;

        if (direction === 'top') {
            finalStart = Math.max(360, startMins + deltaMinutes); // min 06:00
        } else {
            finalEnd = Math.min(1320, endMins + deltaMinutes); // max 22:00
        }

        if (finalEnd <= finalStart) return false;

        const updatedProps = {
            ...event,
            startTime: formatTime(finalStart),
            endTime: formatTime(finalEnd)
        };

        const eventsList = Array.isArray(eventsOrRefetch) ? eventsOrRefetch : [];
        const conflict = eventsList.some(item => detectConflict(updatedProps, item));
        if (conflict) {
            toastService.warning('تنبيه تعارض مواعيد', 'المدرب أو المتدرب لديه موعد آخر متعارض مع هذا التوقيت.');
            return false;
        }

        updateEvent({ id: event.id, eventData: updatedProps });
        return true;
    };

    return { moveEvent, resizeEvent };
};
