import { z } from 'zod';

export const CacheEntrySchema = z.object({
    key: z.string(),
    tenantId: z.union([z.string(), z.number()]),
    value: z.any(),
    expiresAt: z.string(),
    sizeBytes: z.number().default(0),
    version: z.number().default(1)
});

export const CacheEntryListSchema = z.array(CacheEntrySchema);

export default CacheEntrySchema;
