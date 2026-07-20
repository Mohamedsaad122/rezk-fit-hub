import { z } from 'zod';

export const FeatureFlagSchema = z.object({
    id: z.union([z.string(), z.number()]).optional(),
    tenantId: z.union([z.string(), z.number()]),
    key: z.string(),
    label: z.string(),
    description: z.string(),
    status: z.enum(['Active', 'Disabled']),
    rolloutPercent: z.number().min(0).max(100).default(100),
    rules: z.record(z.any()).optional()
});

export const FeatureFlagListSchema = z.array(FeatureFlagSchema);
export default FeatureFlagSchema;
