import { z } from 'zod';

export const OfflineSessionSchema = z.object({
    id: z.union([z.string(), z.number()]),
    tenantId: z.union([z.string(), z.number()]),
    isOnline: z.boolean(),
    status: z.enum(['Online', 'Offline', 'Syncing']),
    offlineSince: z.string().nullable().optional(),
    lastSyncTime: z.string().nullable().optional()
});

export const OfflineSessionListSchema = z.array(OfflineSessionSchema);

export default OfflineSessionSchema;
