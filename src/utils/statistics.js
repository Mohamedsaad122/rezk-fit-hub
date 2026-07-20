/**
 * Basic mathematical statistics helpers.
 */

export const sum = (arr) => {
    if (!Array.isArray(arr) || arr.length === 0) return 0;
    return arr.reduce((acc, val) => acc + (Number(val) || 0), 0);
};

export const mean = (arr) => {
    if (!Array.isArray(arr) || arr.length === 0) return 0;
    return sum(arr) / arr.length;
};

export const variance = (arr) => {
    if (!Array.isArray(arr) || arr.length <= 1) return 0;
    const avg = mean(arr);
    const sumOfSquares = arr.reduce((acc, val) => acc + Math.pow((Number(val) || 0) - avg, 2), 0);
    return sumOfSquares / (arr.length - 1); // Sample variance
};

export const stdDev = (arr) => {
    return Math.sqrt(variance(arr));
};

export default {
    sum,
    mean,
    variance,
    stdDev
};
