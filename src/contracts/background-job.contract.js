import { z } from 'zod';

export const BackgroundJobSchema = z.object({
    id: z.union([z.string(), z.number()]),
    tenantId: z.union([z.string(), z.number()]),
    name: z.string(),
    status: z.enum(['Pending', 'Running', 'Success', 'Failed']),
    lastRun: z.string().nullable().optional(),
    nextRun: z.string().nullable().optional(),
    intervalMs: z.number(),
    retries: z.number().default(0)
});

export const BackgroundJobListSchema = z.array(BackgroundJobSchema);

export default BackgroundJobSchema;
