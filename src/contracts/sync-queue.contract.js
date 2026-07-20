import { z } from 'zod';

export const QueuedMutationSchema = z.object({
    id: z.union([z.string(), z.number()]),
    tenantId: z.union([z.string(), z.number()]),
    url: z.string(),
    method: z.enum(['POST', 'PUT', 'DELETE', 'PATCH']),
    payload: z.any(),
    timestamp: z.string(),
    retries: z.number().default(0),
    status: z.enum(['Pending', 'Syncing', 'Failed', 'Conflict']),
    priority: z.number().default(1), // Higher = more urgent
    conflictType: z.string().nullable().optional()
});

export const QueuedMutationListSchema = z.array(QueuedMutationSchema);

export default QueuedMutationSchema;
