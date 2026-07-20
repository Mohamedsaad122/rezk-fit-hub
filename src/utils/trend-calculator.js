/**
 * Utility to calculate trend growth or decline rates.
 */
export const calculateTrend = (current, prior) => {
    const currentVal = Number(current) || 0;
    const priorVal = Number(prior) || 0;

    if (priorVal === 0) {
        return currentVal > 0 ? 100 : 0;
    }

    // Returns percentage rate rounded to nearest integer (e.g. +12 or -5)
    return Math.round(((currentVal - priorVal) / priorVal) * 100);
};

export default {
    calculateTrend
};
