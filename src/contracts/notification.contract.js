import { z } from 'zod';

export const NotificationPrioritySchema = z.enum(['Low', 'Normal', 'High', 'Critical'], {
    errorMap: () => ({ message: 'الأولوية يجب أن تكون: Low, Normal, High, or Critical' })
});

export const NotificationStatusSchema = z.enum(['Unread', 'Read', 'Archived'], {
    errorMap: () => ({ message: 'الحالة يجب أن تكون: Unread, Read, or Archived' })
});

export const NotificationResponseSchema = z.object({
    id: z.union([z.string(), z.number()]),
    tenantId: z.union([z.string(), z.number()]).optional(),
    title: z.string().min(1, 'العنوان مطلوب'),
    description: z.string().min(1, 'الوصف مطلوب'),
    type: z.string(),
    priority: NotificationPrioritySchema.default('Normal'),
    status: NotificationStatusSchema.default('Unread'),
    createdAt: z.string(),
    readAt: z.string().nullable().optional(),
    actionUrl: z.string().nullable().optional(),
    clientId: z.union([z.string(), z.number()]).nullable().optional(),
    icon: z.string().optional().default('🔔'),
    color: z.string().optional().default('blue'),
});

export const NotificationListResponseSchema = z.array(NotificationResponseSchema);

export const NotificationSettingsSchema = z.object({
    categories: z.object({
        appointment: z.boolean().default(true),
        workout: z.boolean().default(true),
        nutrition: z.boolean().default(true),
        client: z.boolean().default(true),
        assessment: z.boolean().default(true),
        progress: z.boolean().default(true),
        system: z.boolean().default(true),
    }),
    muteReminders: z.boolean().default(false),
    reminderTiming: z.number().default(15), // in minutes
    soundEnabled: z.boolean().default(true),
    desktopNotifications: z.boolean().default(true),
});

export default NotificationResponseSchema;
