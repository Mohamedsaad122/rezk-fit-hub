import { z } from 'zod';

export const LogSchema = z.object({
    id: z.union([z.string(), z.number()]).optional(),
    tenantId: z.union([z.string(), z.number()]),
    timestamp: z.string(),
    level: z.enum(['Trace', 'Debug', 'Info', 'Warning', 'Error', 'Critical']),
    category: z.string(),
    message: z.string(),
    context: z.record(z.any()).optional()
});

export const LogListSchema = z.array(LogSchema);
export default LogSchema;
