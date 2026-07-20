import { z } from 'zod';

export const ActiveSessionSchema = z.object({
    id: z.union([z.string(), z.number()]),
    tenantId: z.union([z.string(), z.number()]),
    userId: z.union([z.string(), z.number()]),
    ipAddress: z.string(),
    userAgent: z.string(),
    location: z.string().nullable().optional(),
    createdAt: z.string(),
    expiresAt: z.string(),
    isCurrent: z.boolean().default(false)
});

export const ActiveSessionListSchema = z.array(ActiveSessionSchema);

export default ActiveSessionSchema;
