import { z } from 'zod';

export const AuditLogSchema = z.object({
    id: z.number().nonnegative(),
    action: z.string().min(1),
    entity: z.string().min(1),
    user: z.string().min(1),
    date: z.string(), // ISO String
    ip: z.string(),
    device: z.string(),
    status: z.enum(['Success', 'Failure']),
    details: z.string().min(1)
});

export const AuditLogCreateSchema = AuditLogSchema.omit({ id: true, date: true });
