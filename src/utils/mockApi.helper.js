/* global process */
import AppConfig from '@/config/app.config';
import {
    ValidationError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    ServerError
} from '@/api/errors';

/**
 * Delay helper returning a Promise resolving after ms milliseconds.
 */
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Generate a random number between min and max inclusive.
 */
const randomRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Simulates a real-world API call with latency and potential errors.
 * 
 * @param {Function} dataFn - Function returning the mock response data
 * @param {Object} options - Custom simulation configuration
 * @param {number} options.minDelay - Minimum artificial latency in ms
 * @param {number} options.maxDelay - Maximum artificial latency in ms
 * @param {number} options.failureRate - Decimal chance (0.0 to 1.0) of throwing an error
 * @returns {Promise<any>} Resolves with dataFn result or rejects with ApiError subclass
 */
export const simulateApi = async (dataFn, options = {}) => {
    const minDelay = options.minDelay ?? 300;
    const maxDelay = options.maxDelay ?? 800;
    const failureRate = options.failureRate ?? (AppConfig.failureRate ?? 0.0);

    // 1. Simulate Latency
    if (typeof process === 'undefined' || !process.env.VITEST) {
        const ms = randomRange(minDelay, maxDelay);
        await delay(ms);
    }

    // 2. Simulate Random Failures
    if (Math.random() < failureRate) {
        const errorChoices = [
            {
                status: 401,
                error: new UnauthorizedError('انتهت صلاحية الجلسة. يرجى تسجيل الدخول مجدداً.')
            },
            {
                status: 403,
                error: new ForbiddenError('ليس لديك الصلاحيات الكافية لتنفيذ هذا الإجراء.')
            },
            {
                status: 404,
                error: new NotFoundError('المورد المطلوب غير موجود في قاعدة البيانات.')
            },
            {
                status: 422,
                error: new ValidationError('فشل التحقق من البيانات المدخلة.', {
                    field: 'البيانات المدخلة تحتوي على قيم غير صالحة.'
                })
            },
            {
                status: 500,
                error: new ServerError('خطأ داخلي في خادم المحاكاة. يرجى المحاولة لاحقاً.')
            }
        ];

        // Randomly pick one error subclass
        const picked = errorChoices[Math.floor(Math.random() * errorChoices.length)];
        throw picked.error;
    }

    // 3. Return successful data
    return typeof dataFn === 'function' ? dataFn() : dataFn;
};

export default simulateApi;
