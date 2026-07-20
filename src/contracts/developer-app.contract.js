import { z } from 'zod';

export const DeveloperAppSchema = z.object({
    id: z.union([z.string(), z.number()]),
    tenantId: z.union([z.string(), z.number()]),
    name: z.string(),
    logo: z.string().nullable().optional(),
    clientId: z.string(),
    clientSecret: z.string(),
    redirectUris: z.array(z.string()).default([]),
    status: z.enum(['Active', 'Suspended']),
    createdAt: z.string()
});

export const DeveloperAppListSchema = z.array(DeveloperAppSchema);

export default DeveloperAppSchema;
