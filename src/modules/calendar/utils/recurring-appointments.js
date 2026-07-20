/**
 * Recurring Appointments Generator.
 * Creates multiple appointment occurrences based on frequency, intervals, counts, and end dates.
 */

// Helper to add days to a YYYY-MM-DD string
export const addDays = (dateStr, days) => {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
};

// Helper to add months to a YYYY-MM-DD string
export const addMonths = (dateStr, months) => {
    const d = new Date(dateStr);
    d.setMonth(d.getMonth() + months);
    return d.toISOString().split('T')[0];
};

/**
 * Generate instance dates of a recurring pattern.
 * @param {string} startDateStr - Start date YYYY-MM-DD
 * @param {Object} pattern - { frequency, interval, count, untilDate, skipHolidays }
 * @param {Array<string>} holidays - List of holidays (optional)
 * @returns {Array<string>} - List of date strings YYYY-MM-DD
 */
export const generateRecurringDates = (startDateStr, pattern, holidays = []) => {
    const dates = [];
    if (!pattern) return [startDateStr];

    const { frequency, interval = 1, count, untilDate, skipHolidays = true } = pattern;
    let currentDate = startDateStr;
    let iteration = 0;
    const maxIterations = count ? Number(count) : 50; // Safeguard

    while (true) {
        // Condition: limit by count if defined
        if (count && iteration >= Number(count)) {
            break;
        }
        // Condition: limit by safeguard max iterations
        if (!count && iteration >= maxIterations) {
            break;
        }
        // Condition: limit by untilDate
        if (untilDate && currentDate > untilDate) {
            break;
        }

        // Validate skip holidays
        let shouldAdd = true;
        if (skipHolidays) {
            const dayOfWeek = new Date(currentDate).getDay();
            const isWeekend = dayOfWeek === 5; // Friday
            const isHoliday = holidays.includes(currentDate);
            if (isWeekend || isHoliday) {
                shouldAdd = false;
            }
        }

        if (shouldAdd) {
            dates.push(currentDate);
            iteration++;
        }

        // Advance date
        if (frequency === 'daily') {
            currentDate = addDays(currentDate, interval);
        } else if (frequency === 'weekly') {
            currentDate = addDays(currentDate, interval * 7);
        } else if (frequency === 'monthly') {
            currentDate = addMonths(currentDate, interval);
        } else {
            break; // Unknown pattern
        }
    }

    return dates;
};

/**
 * Generate fully seeded appointment instances based on base details and pattern.
 * @param {Object} baseEvent - Base appointment values.
 * @param {Object} pattern - Recurring pattern details.
 * @param {number} startId - Starting ID for auto-increment.
 * @param {Array<string>} holidays - List of holidays.
 * @returns {Array<Object>} - List of appointment objects.
 */
export const generateRecurringInstances = (baseEvent, pattern, startId, holidays = []) => {
    if (!pattern || !baseEvent) {
        return [{ ...baseEvent, id: startId }];
    }

    const occurrenceDates = generateRecurringDates(baseEvent.date, pattern, holidays);
    
    return occurrenceDates.map((date, idx) => {
        return {
            ...baseEvent,
            id: startId + idx,
            date,
            isRecurring: true,
            recurringPattern: pattern,
            title: baseEvent.title + (occurrenceDates.length > 1 ? ` (${idx + 1}/${occurrenceDates.length})` : '')
        };
    });
};

export const generateOccurrences = generateRecurringDates;
