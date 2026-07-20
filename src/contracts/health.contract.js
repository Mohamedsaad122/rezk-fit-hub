import { z } from 'zod';

export const HealthCheckDetailsSchema = z.object({
    status: z.enum(['Healthy', 'Warning', 'Unhealthy']),
    message: z.string(),
    latencyMs: z.number(),
    lastChecked: z.string()
});

export const SystemHealthCenterSchema = z.record(HealthCheckDetailsSchema);
export default SystemHealthCenterSchema;
