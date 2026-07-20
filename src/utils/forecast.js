/**
 * Predictive forecasting models for business metrics.
 */

/**
 * Forecasts the next data point using Simple Moving Average (SMA).
 */
export const forecastSMA = (data, windowSize = 3) => {
    if (!Array.isArray(data) || data.length === 0) return 0;
    const size = Math.min(data.length, windowSize);
    const subset = data.slice(-size);
    const sum = subset.reduce((acc, val) => acc + (Number(val) || 0), 0);
    return Math.round(sum / size);
};

/**
 * Forecasts the next data point using Simple Linear Regression (y = mx + c).
 */
export const forecastLinearRegression = (data) => {
    if (!Array.isArray(data) || data.length === 0) return 0;
    if (data.length === 1) return Number(data[0]) || 0;

    const n = data.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;

    for (let i = 0; i < n; i++) {
        const x = i;
        const y = Number(data[i]) || 0;
        sumX += x;
        sumY += y;
        sumXY += x * y;
        sumXX += x * x;
    }

    const denominator = n * sumXX - sumX * sumX;
    if (denominator === 0) {
        return Math.round(sumY / n); // fallback to mean
    }

    const slope = (n * sumXY - sumX * sumY) / denominator;
    const intercept = (sumY - slope * sumX) / n;

    // Predict for index n (next month / interval)
    return Math.round(slope * n + intercept);
};

export default {
    forecastSMA,
    forecastLinearRegression
};
