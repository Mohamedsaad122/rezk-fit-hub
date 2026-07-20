import { z } from 'zod';

export const AutomationRuleSchema = z.object({
    id: z.union([z.string(), z.number()]),
    tenantId: z.union([z.string(), z.number()]),
    name: z.string(),
    description: z.string().optional().nullable(),
    triggerEvent: z.string(),
    conditions: z.array(z.object({
        field: z.string(),
        operator: z.enum(['EQUALS', 'NOT_EQUALS', 'GREATER_THAN', 'LESS_THAN', 'CONTAINS']),
        value: z.any()
    })).default([]),
    actions: z.array(z.object({
        actionType: z.string(),
        params: z.record(z.any()).default({})
    })).default([]),
    status: z.enum(['Active', 'Disabled']).default('Active'),
    priority: z.number().default(1),
    createdAt: z.string()
});

export const AutomationRuleListSchema = z.array(AutomationRuleSchema);

export default AutomationRuleSchema;
