import { z } from 'zod';

export const AutomationLogSchema = z.object({
    id: z.union([z.string(), z.number()]),
    tenantId: z.union([z.string(), z.number()]),
    ruleId: z.union([z.string(), z.number()]),
    triggerEvent: z.string(),
    status: z.enum(['Success', 'Failed']),
    details: z.string(),
    timestamp: z.string()
});

export const AutomationLogListSchema = z.array(AutomationLogSchema);

export default AutomationLogSchema;
