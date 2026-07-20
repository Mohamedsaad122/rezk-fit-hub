import { z } from 'zod';

export const SubscriptionRequestSchema = z.object({
    tenantId: z.union([z.string(), z.number()]),
    planId: z.enum(['Starter', 'Professional', 'Business', 'Enterprise', 'Unlimited']),
    status: z.enum(['Active', 'Expired', 'Trialing', 'PastDue']).default('Active'),
    startDate: z.string(),
    endDate: z.string(),
    limits: z.object({
        users: z.number().min(1),
        storageGb: z.number().min(1),
        reportsEnabled: z.boolean().default(true),
        analyticsEnabled: z.boolean().default(true),
        realtimeEnabled: z.boolean().default(true),
        exportsEnabled: z.boolean().default(true),
        apiAccessEnabled: z.boolean().default(true)
    })
});

export const SubscriptionResponseSchema = z.object({
    id: z.union([z.string(), z.number()]),
    tenantId: z.union([z.string(), z.number()]),
    planId: z.string(),
    status: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    limits: z.object({
        users: z.number(),
        storageGb: z.number(),
        reportsEnabled: z.boolean(),
        analyticsEnabled: z.boolean(),
        realtimeEnabled: z.boolean(),
        exportsEnabled: z.boolean(),
        apiAccessEnabled: z.boolean()
    })
});

export const SubscriptionListResponseSchema = z.array(SubscriptionResponseSchema);

export default SubscriptionResponseSchema;
