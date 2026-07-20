import { z } from 'zod';

export const SecurityConfigSchema = z.object({
    passwordMinLength: z.number().default(8),
    passwordRequireSpecialChar: z.boolean().default(true),
    passwordRequireNumbers: z.boolean().default(true),
    passwordRequireUppercase: z.boolean().default(true),
    passwordHistoryCount: z.number().default(5),
    passwordExpirationDays: z.number().default(90),
    maxFailedAttempts: z.number().default(5),
    lockoutDurationMinutes: z.number().default(15)
});

export const BruteForceAttemptSchema = z.object({
    ip: z.string(),
    failedAttempts: z.number(),
    lastAttemptAt: z.string(),
    isLocked: z.boolean(),
    lockedUntil: z.string().nullable().optional()
});

export default { SecurityConfigSchema, BruteForceAttemptSchema };
