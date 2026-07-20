import { z } from 'zod';

export const MetricSchema = z.object({
    id: z.union([z.string(), z.number()]).optional(),
    tenantId: z.union([z.string(), z.number()]),
    key: z.string(),
    value: z.number(),
    unit: z.string(),
    timestamp: z.string()
});

export const MetricListSchema = z.array(MetricSchema);
export default MetricSchema;
