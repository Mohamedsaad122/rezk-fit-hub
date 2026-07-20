import { z } from 'zod';

export const CalendarSyncLogSchema = z.object({
    id: z.union([z.string(), z.number()]),
    tenantId: z.union([z.string(), z.number()]),
    provider: z.string(),
    syncToken: z.string().optional(),
    status: z.enum(['Success', 'Failed']),
    syncedItemsCount: z.number().default(0),
    errorMessage: z.string().nullable().optional(),
    timestamp: z.string()
});

export const CalendarSyncLogListSchema = z.array(CalendarSyncLogSchema);

export default CalendarSyncLogSchema;
