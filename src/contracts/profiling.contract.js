import { z } from 'zod';

export const ProfilingSchema = z.object({
    id: z.union([z.string(), z.number()]).optional(),
    tenantId: z.union([z.string(), z.number()]),
    cpuUsage: z.number(),
    memoryUsedMB: z.number(),
    memoryTotalMB: z.number(),
    timestamp: z.string()
});

export const ProfilingListSchema = z.array(ProfilingSchema);
export default ProfilingSchema;
