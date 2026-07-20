/**
 * Conflict Detection Engine.
 * Verifies scheduling overlaps for coaches, clients, rooms, equipment, and branch capacity limits.
 */

// Helper to convert HH:MM to absolute minutes from midnight
export const parseTime = (timeStr) => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
};

// Check if two time intervals overlap on the same day
export const isOverlapping = (startA, endA, startB, endB) => {
    const aStart = parseTime(startA);
    const aEnd = parseTime(endA);
    const bStart = parseTime(startB);
    const bEnd = parseTime(endB);
    
    // Correct local mapping
    const minStartA = aStart;
    const minEndA = aEnd;
    const minStartB = bStart;
    const minEndB = bEnd;

    return minStartA < minEndB && minStartB < minEndA;
};

/**
 * Detect scheduling conflicts against existing appointments.
 * @param {Object} eventData - Appointment details being created/edited.
 * @param {Array} existingEvents - List of existing scheduled appointments.
 * @param {Object} branchConfig - Configuration for branch limits (optional).
 * @returns {Array<string>} - Arabic warning messages.
 */
export const detectConflicts = (eventData, existingEvents = [], branchConfig = {}) => {
    const warnings = [];
    if (!eventData || !eventData.date || !eventData.startTime || !eventData.endTime) {
        return warnings;
    }

    const {
        id,
        date,
        startTime,
        endTime,
        coachId,
        clientId,
        roomId,
        equipmentId,
        branchId,
        nutritionistId
    } = eventData;

    // Support repository objects with .getAll() or fallback to empty array
    const eventsList = Array.isArray(existingEvents)
        ? existingEvents
        : (existingEvents && typeof existingEvents.getAll === 'function'
            ? existingEvents.getAll()
            : []);

    // Filter events on the same date and exclude the current event if editing
    const dailyEvents = eventsList.filter(e => e.date === date && String(e.id) !== String(id) && e.status !== 'Cancelled');

    let branchConcurrentCount = 0;
    const defaultBranchConfig = { 1: 5, 2: 3 };
    const config = branchConfig ? { ...defaultBranchConfig, ...branchConfig } : defaultBranchConfig;
    const branchLimit = config[branchId] || 15; // default capacity of 15

    for (const e of dailyEvents) {
        // If times overlap, evaluate conflicts
        if (isOverlapping(startTime, endTime, e.startTime, e.endTime)) {
            // 1. Coach overlap
            if (coachId && String(e.coachId) === String(coachId)) {
                warnings.push(`المدرب لديه موعد آخر متداخل في هذا الوقت ("${e.title}").`);
            }

            // 2. Client overlap
            if (clientId && String(e.clientId) === String(clientId)) {
                warnings.push(`المتدرب لديه موعد آخر متداخل في هذا الوقت ("${e.title}").`);
            }

            // 3. Room overlap
            if (roomId && e.roomId && String(e.roomId) === String(roomId)) {
                warnings.push(`الغرفة/القاعة (${roomId}) محجوزة بالفعل لجلسة أخرى متداخلة ("${e.title}").`);
            }

            // 4. Equipment overlap
            if (equipmentId && e.equipmentId && String(e.equipmentId) === String(equipmentId)) {
                warnings.push(`الجهاز/المعدة (${equipmentId}) محجوزة بالفعل لجلسة أخرى متداخلة ("${e.title}").`);
            }

            // 5. Nutritionist overlap
            if (nutritionistId && e.nutritionistId && String(e.nutritionistId) === String(nutritionistId)) {
                warnings.push(`أخصائي التغذية لديه موعد آخر متداخل في هذا الوقت ("${e.title}").`);
            }

            // Count concurrent branch appointments for branch limit validation
            if (branchId && String(e.branchId) === String(branchId)) {
                branchConcurrentCount++;
            }
        }
    }

    // 6. Branch capacity check
    if (branchId && branchConcurrentCount >= branchLimit) {
        warnings.push(`تم تجاوز الطاقة الاستيعابية لفرعك المجدول في هذا التوقيت (الحد الأقصى: ${branchLimit} جلسة متزامنة).`);
    }

    return warnings;
};

export const checkConflicts = detectConflicts;
