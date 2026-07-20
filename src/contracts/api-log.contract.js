import { z } from 'zod';

export const ApiLogSchema = z.object({
    id: z.union([z.string(), z.number()]),
    tenantId: z.union([z.string(), z.number()]),
    path: z.string(),
    method: z.string(),
    status: z.number(),
    latencyMs: z.number(),
    clientIp: z.string(),
    scopes: z.array(z.string()).default([]),
    timestamp: z.string()
});

export const ApiLogListSchema = z.array(ApiLogSchema);

export default ApiLogSchema;
