import { z } from 'zod';

export const EnterprisePolicySchema = z.object({
    id: z.union([z.string(), z.number()]).optional(),
    tenantId: z.union([z.string(), z.number()]),
    ipAllowList: z.array(z.string()).default([]),
    blockedCountries: z.array(z.string()).default([]),
    workingHoursStart: z.string().nullable().optional(), // '09:00'
    workingHoursEnd: z.string().nullable().optional(), // '18:00'
    blockWeekendLogin: z.boolean().default(false),
    deviceRestricted: z.boolean().default(false)
});

export default EnterprisePolicySchema;
