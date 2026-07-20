/**
 * Calendar math and calculations utilities.
 */

const formatYMD = (y, m, d) => {
    const mm = String(m).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${y}-${mm}-${dd}`;
};

/**
 * Generates a 35 or 42 element matrix of YYYY-MM-DD date strings for monthly view calendars.
 */
export const generateMonthMatrix = (dateStr) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth(); // 0-indexed
    
    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevTotalDays = new Date(year, month, 0).getDate();
    
    const matrix = [];
    
    // Trailing days from previous month
    for (let i = firstDayIndex - 1; i >= 0; i--) {
        const d = prevTotalDays - i;
        const prevMonth = month === 0 ? 11 : month - 1;
        const prevYear = month === 0 ? year - 1 : year;
        matrix.push(formatYMD(prevYear, prevMonth + 1, d));
    }
    
    // Active month days
    for (let i = 1; i <= totalDays; i++) {
        matrix.push(formatYMD(year, month + 1, i));
    }
    
    // Leading days from next month
    const totalCells = matrix.length > 35 ? 42 : 35;
    const nextDays = totalCells - matrix.length;
    for (let i = 1; i <= nextDays; i++) {
        const nextMonth = month === 11 ? 0 : month + 1;
        const nextYear = month === 11 ? year + 1 : year;
        matrix.push(formatYMD(nextYear, nextMonth + 1, i));
    }
    
    return matrix;
};

/**
 * Generates a 7-day array of YYYY-MM-DD date strings for the week containing reference date.
 */
export const generateWeekDays = (dateStr) => {
    const current = new Date(dateStr);
    const day = current.getDay();
    const diffToSunday = current.getDate() - day;
    
    const days = [];
    for (let i = 0; i < 7; i++) {
        const nextDate = new Date(new Date(dateStr).setDate(diffToSunday + i));
        days.push(formatYMD(nextDate.getFullYear(), nextDate.getMonth() + 1, nextDate.getDate()));
    }
    return days;
};

/**
 * Hourly slot tags between starting 06:00 and ending 22:00 work boundaries.
 */
export const generateTimeSlots = () => [
    "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", 
    "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", 
    "20:00", "21:00", "22:00"
];

/**
 * Checks for session scheduling conflicts.
 * Overlap check triggers if coachId or clientId matches, and duration overlaps.
 */
export const detectConflict = (eventA, eventB) => {
    if (String(eventA.id) === String(eventB.id)) return false;
    if (eventA.date !== eventB.date) return false;
    
    const samePerson = 
        (eventA.coachId && eventB.coachId && String(eventA.coachId) === String(eventB.coachId)) ||
        (eventA.clientId && eventB.clientId && String(eventA.clientId) === String(eventB.clientId));
        
    if (!samePerson) return false;
    
    const parse = (t) => {
        const [h, m] = t.split(':').map(Number);
        return h * 60 + m;
    };
    
    const startA = parse(eventA.startTime);
    const endA = parse(eventA.endTime);
    const startB = parse(eventB.startTime);
    const endB = parse(eventB.endTime);
    
    return Math.max(startA, startB) < Math.min(endA, endB);
};
