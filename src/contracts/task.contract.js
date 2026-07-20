import { z } from 'zod';

export const TaskPrioritySchema = z.enum(['Low', 'Medium', 'High', 'Critical'], {
    errorMap: () => ({ message: 'الأولوية يجب أن تكون: Low, Medium, High, or Critical' })
});

export const TaskStatusSchema = z.enum(['Todo', 'In Progress', 'Completed', 'Cancelled', 'Overdue'], {
    errorMap: () => ({ message: 'الحالة يجب أن تكون: Todo, In Progress, Completed, Cancelled, or Overdue' })
});

export const TaskCategorySchema = z.enum([
    'Workout', 
    'Nutrition', 
    'Assessment', 
    'Consultation', 
    'Follow Up', 
    'Phone Call', 
    'Meeting', 
    'Administrative', 
    'Reminder'
], {
    errorMap: () => ({ message: 'فئة المهمة غير صالحة' })
});

export const TaskResponseSchema = z.object({
    id: z.union([z.string(), z.number()]),
    tenantId: z.union([z.string(), z.number()]).optional(),
    title: z.string().min(2, 'العنوان يجب أن يتكون من حرفين على الأقل'),
    description: z.string().optional().default(''),
    clientId: z.union([z.string(), z.number()]).nullable().optional().default(null),
    appointmentId: z.union([z.string(), z.number()]).nullable().optional().default(null),
    assignedTo: z.string().optional().default('Coach'),
    priority: TaskPrioritySchema.default('Medium'),
    status: TaskStatusSchema.default('Todo'),
    category: TaskCategorySchema.default('Reminder'),
    dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'صيغة تاريخ الاستحقاق YYYY-MM-DD').nullable().optional().default(null),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'صيغة تاريخ البدء YYYY-MM-DD').nullable().optional().default(null),
    completedAt: z.string().nullable().optional().default(null),
    estimatedMinutes: z.number().nonnegative().optional().default(0),
    actualMinutes: z.number().nonnegative().optional().default(0),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional()
});

export const TaskRequestSchema = TaskResponseSchema.omit({ 
    id: true, 
    createdAt: true, 
    updatedAt: true 
}).partial({
    description: true,
    clientId: true,
    appointmentId: true,
    assignedTo: true,
    priority: true,
    status: true,
    category: true,
    dueDate: true,
    startDate: true,
    completedAt: true,
    estimatedMinutes: true,
    actualMinutes: true
});

export const TaskListResponseSchema = z.array(TaskResponseSchema);

export const TaskStatisticsSchema = z.object({
    total: z.number().nonnegative(),
    todo: z.number().nonnegative(),
    inProgress: z.number().nonnegative(),
    completed: z.number().nonnegative(),
    cancelled: z.number().nonnegative(),
    overdue: z.number().nonnegative(),
    completionRate: z.number().min(0).max(100)
});

export default TaskResponseSchema;
