import { z } from 'zod';

export const RateLimitSchema = z.object({
    id: z.union([z.string(), z.number()]).optional(),
    tenantId: z.union([z.string(), z.number()]).optional(),
    ip: z.string(),
    limit: z.number(),
    windowMs: z.number(),
    remaining: z.number(),
    resetTime: z.string()
});

export default RateLimitSchema;
