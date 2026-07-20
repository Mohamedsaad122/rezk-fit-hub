import { z } from 'zod';

export const ActivitySchema = z.object({
    id: z.number().nonnegative(),
    category: z.enum(['Workout', 'Client', 'Nutrition', 'Appointment', 'Task', 'Notification', 'Message', 'Document', 'Exercise']),
    description: z.string(),
    actor: z.string(),
    clientId: z.number().nullable(),
    timestamp: z.string() // ISO string
});

export const ActivityStatisticsSchema = z.object({
    total: z.number().nonnegative(),
    workout: z.number().nonnegative(),
    client: z.number().nonnegative(),
    nutrition: z.number().nonnegative(),
    appointment: z.number().nonnegative(),
    task: z.number().nonnegative()
});

export default {
    ActivitySchema,
    ActivityStatisticsSchema
};
