import { z } from 'zod';

export const ClientRequestSchema = z.object({
    name: z.string().min(2, 'الاسم يجب أن يتكون من حرفين على الأقل'),
    progress: z.number().min(0, 'التقدم لا يمكن أن يكون أقل من 0').max(100, 'التقدم لا يمكن أن يتجاوز 100').default(0),
    workouts: z.number().min(0, 'عدد التمارين لا يمكن أن يكون أقل من 0').default(0),
    streak: z.number().min(0, 'الالتزام لا يمكن أن يكون أقل من 0').default(0),
    goal: z.string().min(1, 'الهدف مطلوب'),
    avatar: z.string().optional().default('👩'),
    email: z.string().min(1, 'البريد الإلكتروني مطلوب').email('صيغة البريد الإلكتروني غير صحيحة'),
    phone: z.string().min(1, 'رقم الهاتف مطلوب'),
    age: z.number().min(12, 'العمر يجب أن يكون 12 سنة على الأقل').max(100, 'العمر غير صالح').default(25),
    currentWeight: z.number().min(30, 'الوزن يجب أن يكون 30 كجم على الأقل').default(70),
    targetWeight: z.number().min(30, 'الوزن المستهدف يجب أن يكون 30 كجم على الأقل').default(65),
    subscriptionStatus: z.enum(['نشط', 'معلق', 'منتهي'], {
        errorMap: () => ({ message: 'حالة الاشتراك غير صالحة' })
    }).default('نشط'),
    joinDate: z.string().optional(),
    assignedCategoryId: z.string().nullable().optional().default(null)
});

export const ClientResponseSchema = z.object({
    id: z.union([z.string(), z.number()]),
    tenantId: z.union([z.string(), z.number()]).optional(),
    name: z.string(),
    progress: z.number(),
    workouts: z.number(),
    streak: z.number(),
    goal: z.string(),
    avatar: z.string(),
    email: z.string(),
    phone: z.string(),
    age: z.number(),
    currentWeight: z.number(),
    targetWeight: z.number(),
    subscriptionStatus: z.string(),
    joinDate: z.string(),
    assignedCategoryId: z.string().nullable().optional()
});

export const ClientListResponseSchema = z.array(ClientResponseSchema);
