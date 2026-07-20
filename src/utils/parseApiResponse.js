import { ValidationError } from '@/api/errors';
import { logger } from '@/utils/logger';

/**
 * Reusable utility to validate API and mock response data against Zod contracts.
 * @param {import('zod').ZodSchema} schema - Zod contract schema.
 * @param {any} data - Raw data payload to validate.
 * @param {string} sourceName - Context descriptor for debugging.
 * @returns {any} Validated and typed domain object.
 * @throws {ValidationError} Application-level validation error on parse failures.
 */
export function parseApiResponse(schema, data, sourceName = 'API Response') {
    const result = schema.safeParse(data);
    if (!result.success) {
        // Output detailed validation details to console for development diagnostics
        logger.error(`[Contract Validation Failure] in ${sourceName}:`, result.error.format());
        
        // Throw structured validation error
        throw new ValidationError(
            `فشل التحقق من صحة بيانات الخادم في ${sourceName}`,
            result.error.flatten()
        );
    }
    return result.data;
}

export default parseApiResponse;
