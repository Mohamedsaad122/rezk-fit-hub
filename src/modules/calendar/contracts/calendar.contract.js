import { z } from 'zod';

export const CalendarEventTypeSchema = z.enum([
    "Workout Session",
    "Nutrition Consultation",
    "Assessment",
    "Follow-up",
    "Meeting",
    "Personal Training"
], {
    errorMap: () => ({ message: 'نوع الفعالية غير صالح' })
});

export const CalendarEventStatusSchema = z.enum([
    "Scheduled",
    "Completed",
    "Cancelled",
    "Missed",
    "In Progress"
], {
    errorMap: () => ({ message: 'حالة الفعالية غير صالحة' })
});

// Enforcing baseline object representation prior to refine mapping
export const CalendarEventBaseObject = z.object({
    title: z.string().min(1, 'العنوان مطلوب').min(2, 'العنوان يجب أن يتكون من حرفين على الأقل'),
    description: z.string().max(500, 'الوصف لا يمكن أن يتجاوز 500 حرف').optional().default(''),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'صيغة التاريخ يجب أن تكون YYYY-MM-DD'),
    startTime: z.string().regex(/^\d{2}:\d{2}$/, 'صيغة وقت البدء يجب أن تكون HH:MM'),
    endTime: z.string().regex(/^\d{2}:\d{2}$/, 'صيغة وقت الانتهاء يجب أن تكون HH:MM'),
    type: CalendarEventTypeSchema,
    status: CalendarEventStatusSchema.default('Scheduled'),
    coachId: z.union([z.number(), z.string()]).default(1),
    clientId: z.union([z.number(), z.string()]).nullable().optional().default(null),
    color: z.string().optional().default('blue'),
    notes: z.string().optional().default(''),
    duration: z.number().optional(),
    createdBy: z.string().optional().default('Coach'),
    updatedBy: z.string().optional().default('Coach'),
    branchId: z.union([z.number(), z.string()]).nullable().optional().default(1),
    roomId: z.string().nullable().optional().default(null),
    equipmentId: z.string().nullable().optional().default(null),
    nutritionistId: z.union([z.number(), z.string()]).nullable().optional().default(null),
    isRecurring: z.boolean().optional().default(false),
    recurringPattern: z.object({
        frequency: z.enum(['daily', 'weekly', 'monthly']),
        interval: z.number().default(1),
        count: z.number().optional().nullable(),
        untilDate: z.string().optional().nullable(),
        skipHolidays: z.boolean().default(true)
    }).nullable().optional().default(null),
    lock: z.object({
        isLocked: z.boolean().default(false),
        lockedBy: z.string().nullable().optional(),
        lockedAt: z.string().nullable().optional(),
        timeoutAt: z.string().nullable().optional()
    }).nullable().optional().default(null)
});

export const CalendarEventRequestSchema = CalendarEventBaseObject.refine((data) => {
    const parseTime = (t) => {
        const [h, m] = t.split(':').map(Number);
        return h * 60 + m;
    };
    return parseTime(data.endTime) > parseTime(data.startTime);
}, {
    message: 'وقت الانتهاء يجب أن يكون بعد وقت البدء',
    path: ['endTime']
});

export const CalendarEventResponseSchema = z.object({
    id: z.union([z.string(), z.number()]),
    tenantId: z.union([z.string(), z.number()]).optional(),
    title: z.string(),
    description: z.string().default(''),
    date: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    type: CalendarEventTypeSchema,
    status: CalendarEventStatusSchema,
    coachId: z.union([z.number(), z.string()]),
    clientId: z.union([z.number(), z.string()]).nullable().optional(),
    color: z.string(),
    notes: z.string().default(''),
    duration: z.number().optional(),
    createdBy: z.string().optional(),
    updatedBy: z.string().optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
    branchId: z.union([z.number(), z.string()]).nullable().optional(),
    roomId: z.string().nullable().optional(),
    equipmentId: z.string().nullable().optional(),
    nutritionistId: z.union([z.number(), z.string()]).nullable().optional(),
    isRecurring: z.boolean().optional().default(false),
    recurringPattern: z.object({
        frequency: z.enum(['daily', 'weekly', 'monthly']),
        interval: z.number().default(1),
        count: z.number().optional().nullable(),
        untilDate: z.string().optional().nullable(),
        skipHolidays: z.boolean().default(true)
    }).nullable().optional(),
    lock: z.object({
        isLocked: z.boolean().default(false),
        lockedBy: z.string().nullable().optional(),
        lockedAt: z.string().nullable().optional(),
        timeoutAt: z.string().nullable().optional()
    }).nullable().optional()
});

export const CalendarEventListResponseSchema = z.array(CalendarEventResponseSchema);

// Friendly structural aliases matching specifications
export const CalendarEvent = CalendarEventResponseSchema;
export const CalendarEventCreate = CalendarEventRequestSchema;
export const CalendarEventUpdate = CalendarEventBaseObject.partial();
export const CalendarEventResponse = CalendarEventResponseSchema;
export const CalendarEventList = CalendarEventListResponseSchema;
