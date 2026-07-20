export class ApiError extends Error {
    constructor(message, status, code, details = null) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.code = code;
        this.details = details;
    }
}

export class ValidationError extends ApiError {
    constructor(message = 'بيانات المدخلات غير صالحة', details = null) {
        super(message, 422, 'VALIDATION_ERROR', details);
        this.name = 'ValidationError';
    }
}

export class UnauthorizedError extends ApiError {
    constructor(message = 'غير مصرح لك بالوصول. يرجى تسجيل الدخول.') {
        super(message, 401, 'UNAUTHORIZED');
        this.name = 'UnauthorizedError';
    }
}

export class ForbiddenError extends ApiError {
    constructor(message = 'ليس لديك صلاحية لتنفيذ هذا الإجراء.') {
        super(message, 403, 'FORBIDDEN');
        this.name = 'ForbiddenError';
    }
}

export class NotFoundError extends ApiError {
    constructor(message = 'المورد المطلوب غير موجود.') {
        super(message, 404, 'NOT_FOUND');
        this.name = 'NotFoundError';
    }
}

export class ServerError extends ApiError {
    constructor(message = 'حدث خطأ في الخادم الداخلي.') {
        super(message, 500, 'SERVER_ERROR');
        this.name = 'ServerError';
    }
}

export class BadRequestError extends ApiError {
    constructor(message = 'طلب غير صالح. يرجى التحقق من البيانات المدخلة.', details = null) {
        super(message, 400, 'BAD_REQUEST', details);
        this.name = 'BadRequestError';
    }
}

export class ConflictError extends ApiError {
    constructor(message = 'حدث تعارض في البيانات. قد يكون هذا العنصر موجوداً بالفعل.') {
        super(message, 409, 'CONFLICT');
        this.name = 'ConflictError';
    }
}

export class RateLimitError extends ApiError {
    constructor(message = 'لقد تجاوزت الحد المسموح به من الطلبات. يرجى المحاولة لاحقاً.') {
        super(message, 429, 'RATE_LIMIT');
        this.name = 'RateLimitError';
    }
}

export class ServiceUnavailableError extends ApiError {
    constructor(message = 'الخدمة غير متوفرة حالياً. يرجى المحاولة لاحقاً.') {
        super(message, 503, 'SERVICE_UNAVAILABLE');
        this.name = 'ServiceUnavailableError';
    }
}
