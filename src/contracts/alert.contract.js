import { z } from 'zod';

export const AlertSchema = z.object({
    id: z.union([z.string(), z.number()]).optional(),
    tenantId: z.union([z.string(), z.number()]),
    title: z.string(),
    message: z.string(),
    severity: z.enum(['Info', 'Warning', 'Critical']),
    status: z.enum(['Active', 'Resolved', 'Suppressed']),
    category: z.string(),
    createdAt: z.string(),
    resolvedAt: z.string().nullable().optional(),
    escalatedAt: z.string().nullable().optional(),
    escalationLevel: z.number().default(1)
});

export const AlertListSchema = z.array(AlertSchema);
export default AlertSchema;
