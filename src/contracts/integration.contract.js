import { z } from 'zod';

export const IntegrationSchema = z.object({
    id: z.union([z.string(), z.number()]),
    tenantId: z.union([z.string(), z.number()]),
    name: z.string(),
    type: z.enum(['Calendar', 'Storage', 'Email', 'SMS', 'Webhook']),
    provider: z.string(),
    status: z.enum(['Connected', 'Disconnected', 'Error']),
    lastSync: z.string().nullable().optional(),
    healthScore: z.number().min(0).max(100).default(100)
});

export const IntegrationListSchema = z.array(IntegrationSchema);

export default IntegrationSchema;
