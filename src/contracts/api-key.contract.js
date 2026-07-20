import { z } from 'zod';

export const ApiKeySchema = z.object({
    id: z.union([z.string(), z.number()]),
    tenantId: z.union([z.string(), z.number()]),
    value: z.string(),
    label: z.string(),
    status: z.enum(['Active', 'Revoked']),
    createdAt: z.string(),
    expiresAt: z.string().nullable().optional(),
    scopes: z.array(z.string()).default([])
});

export const ApiKeyListSchema = z.array(ApiKeySchema);

export default ApiKeySchema;
