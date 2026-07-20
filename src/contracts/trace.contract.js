import { z } from 'zod';

export const TraceSchema = z.object({
    id: z.union([z.string(), z.number()]).optional(),
    tenantId: z.union([z.string(), z.number()]),
    traceId: z.string(),
    parentId: z.string().nullable().optional(),
    name: z.string(),
    correlationId: z.string(),
    startTime: z.string(),
    durationMs: z.number(),
    status: z.enum(['Success', 'Failed']),
    tags: z.record(z.string()).optional()
});

export const TraceListSchema = z.array(TraceSchema);
export default TraceSchema;
