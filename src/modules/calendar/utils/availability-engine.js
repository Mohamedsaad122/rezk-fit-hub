import { isOverlapping } from './conflict-detection';

/**
 * Generate lists of available scheduling slots for a specific resource.
 * @param {string} date - Target date (YYYY-MM-DD)
 * @param {string|number} resourceId - The ID of the coach/nutritionist/room/equipment
 * @param {string} resourceType - 'coach' | 'nutritionist' | 'room' | 'equipment'
 * @param {Array} existingEvents - List of scheduled events in the system
 * @param {Object} config - Custom schedules (working hours, breaks, holidays)
 * @returns {Array<Object>} - List of slots with { startTime, endTime, available }
 */
export const getAvailableSlots = (date, resourceId, resourceType, existingEvents = [], config = {}) => {
    let targetDate = date;
    let resId = resourceId;
    let resType = resourceType;
    let events = existingEvents;
    let cfg = config;

    if (date && typeof date === 'object' && !Array.isArray(date)) {
        targetDate = date.date;
        resId = date.coachId || date.resourceId || date.nutritionistId || date.roomId || date.equipmentId;
        resType = date.resourceType || (date.coachId ? 'coach' : date.nutritionistId ? 'nutritionist' : date.roomId ? 'room' : date.equipmentId ? 'equipment' : 'coach');
        events = date.events || date.existingEvents || [];
        cfg = date.config || date || {};
    }

    // Basic defaults
    const startHour = cfg.startHour ?? 8; // 08:00
    const endHour = cfg.endHour ?? 18;   // 18:00
    const breakStart = cfg.breakStart ?? '13:00';
    const breakEnd = cfg.breakEnd ?? '14:00';
    const slotDurationMinutes = cfg.slotDuration ?? 60;

    // Check if target date is in holidays
    const holidays = cfg.holidays || [];
    if (holidays.includes(targetDate)) {
        return [];
    }

    // Check weekend (e.g., Friday is weekend)
    const dayOfWeek = new Date(targetDate).getDay();
    const weekendDays = cfg.weekendDays ?? [5]; // Friday in Arab contexts
    if (weekendDays.includes(dayOfWeek)) {
        return [];
    }

    const eventsList = Array.isArray(events)
        ? events
        : (events && typeof events.getAll === 'function'
            ? events.getAll()
            : []);

    // Filter appointments for this specific resource on this date
    const relevantEvents = eventsList.filter(e => {
        if (e.date !== targetDate || e.status === 'Cancelled') return false;
        if (resType === 'coach') return String(e.coachId) === String(resId);
        if (resType === 'nutritionist') return String(e.nutritionistId) === String(resId);
        if (resType === 'room') return String(e.roomId) === String(resId);
        if (resType === 'equipment') return String(e.equipmentId) === String(resId);
        return false;
    });

    const slots = [];
    const minStartWork = startHour * 60;
    const minEndWork = endHour * 60;

    for (let min = minStartWork; min + slotDurationMinutes <= minEndWork; min += slotDurationMinutes) {
        const hStart = Math.floor(min / 60).toString().padStart(2, '0');
        const mStart = (min % 60).toString().padStart(2, '0');
        const startTimeStr = `${hStart}:${mStart}`;

        const nextMin = min + slotDurationMinutes;
        const hEnd = Math.floor(nextMin / 60).toString().padStart(2, '0');
        const mEnd = (nextMin % 60).toString().padStart(2, '0');
        const endTimeStr = `${hEnd}:${mEnd}`;

        // 1. Check if overlapping with break hours
        const isOnBreak = isOverlapping(startTimeStr, endTimeStr, breakStart, breakEnd);
        if (isOnBreak) {
            continue;
        }

        // 2. Check if overlapping with scheduled appointments
        let isBooked = false;
        for (const e of relevantEvents) {
            if (isOverlapping(startTimeStr, endTimeStr, e.startTime, e.endTime)) {
                isBooked = true;
                break;
            }
        }

        slots.push({
            startTime: startTimeStr,
            endTime: endTimeStr,
            available: !isBooked
        });
    }

    return slots.filter(s => s.available);
};
