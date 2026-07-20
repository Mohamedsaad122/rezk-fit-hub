import {
    ApiError,
    ValidationError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    ServerError,
    BadRequestError,
    ConflictError,
    RateLimitError,
    ServiceUnavailableError
} from './errors';
import { useAuthStore } from '@/store/auth.store';

/**
 * Global centralized error normalization utility.
 * Maps raw Axios, network, or server response errors into normalized custom ApiError instances.
 * Also handles side-effects like session wiping on unrecoverable 401.
 * 
 * @param {Error|ApiError|any} error - Raw caught error object.
 * @returns {ApiError} Normalized error instance.
 */
export const normalizeError = (error) => {
    if (error instanceof ApiError) {
        return error;
    }

    if (error.response) {
        const status = error.response.status;
        const data = error.response.data || {};
        const message = data.message || '';
        const details = data.errors || null;

        switch (status) {
            case 400:
                return new BadRequestError(message || 'طلب غير صالح. يرجى التحقق من البيانات المدخلة.', details);
            case 401: {
                // If there's no refresh token in the session, auth is unrecoverable
                const hasRefreshToken = !!useAuthStore.getState().refreshToken;
                if (!hasRefreshToken) {
                    useAuthStore.getState().clearSession();
                    if (typeof window !== 'undefined') {
                        window.location.href = '/login';
                    }
                }
                return new UnauthorizedError(message || 'غير مصرح بالوصول. يرجى تسجيل الدخول مجدداً.');
            }
            case 403:
                return new ForbiddenError(message || 'ليس لديك صلاحية لتنفيذ هذا الإجراء.');
            case 404:
                return new NotFoundError(message || 'المورد المطلوب غير موجود.');
            case 409:
                return new ConflictError(message || 'حدث تعارض في البيانات. قد يكون هذا العنصر موجوداً بالفعل.');
            case 422:
                return new ValidationError(message || 'بيانات المدخلات غير صالحة', details);
            case 429:
                return new RateLimitError(message || 'لقد تجاوزت الحد المسموح به من الطلبات. يرجى المحاولة لاحقاً.');
            case 502:
            case 503:
                return new ServiceUnavailableError(message || 'الخدمة غير متوفرة حالياً. يرجى المحاولة لاحقاً.');
            case 500:
            default:
                return new ServerError(message || 'حدث خطأ في الخادم الداخلي.');
        }
    } else if (error.request) {
        return new ApiError(
            'لم يتم استلام أي رد من الخادم. يرجى التحقق من اتصال الشبكة.',
            0,
            'NETWORK_CONNECTION_TIMEOUT'
        );
    } else {
        return new ApiError(error.message || 'حدث خطأ غير متوقع', 0, 'UNKNOWN_CLIENT_ERROR');
    }
};

export default normalizeError;
