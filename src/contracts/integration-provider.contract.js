import { z } from 'zod';

export const ProviderConfigSchema = z.object({
    providerName: z.string(),
    enabled: z.boolean().default(false),
    credentials: z.record(z.string()).default({}),
    latencyMs: z.number().default(0),
    uptimePercent: z.number().default(100)
});

export const ProviderConfigListSchema = z.array(ProviderConfigSchema);

export default ProviderConfigSchema;
