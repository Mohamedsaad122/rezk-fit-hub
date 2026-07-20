import { z } from 'zod';

export const ReleaseSchema = z.object({
    id: z.union([z.string(), z.number()]).optional(),
    tenantId: z.union([z.string(), z.number()]),
    version: z.string(),
    channel: z.enum(['Development', 'Staging', 'Beta', 'Canary', 'Production']),
    status: z.enum(['Pending', 'Deploying', 'Deployed', 'Failed', 'RolledBack']),
    description: z.string(),
    deployedAt: z.string().optional().nullable(),
    rolledBackAt: z.string().optional().nullable(),
    canaryWeight: z.number().optional().nullable()
});

export const ReleaseListSchema = z.array(ReleaseSchema);
export default ReleaseSchema;
