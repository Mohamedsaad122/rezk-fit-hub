import { z } from 'zod';

export const VaultSecretSchema = z.object({
    id: z.union([z.string(), z.number()]),
    tenantId: z.union([z.string(), z.number()]),
    key: z.string(),
    value: z.string(), // Base64 or encrypted text
    version: z.number().default(1),
    environment: z.enum(['Development', 'Staging', 'Production']),
    lastRotatedAt: z.string(),
    history: z.array(z.object({
        version: z.number(),
        value: z.string(),
        rotatedAt: z.string()
    })).default([])
});

export const VaultSecretListSchema = z.array(VaultSecretSchema);

export default VaultSecretSchema;
