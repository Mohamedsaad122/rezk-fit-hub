import { z } from 'zod';

export const MealSchema = z.object({
    name: z.string().min(1, 'اسم الوجبة مطلوب'),
    time: z.string().min(1, 'وقت الوجبة مطلوب'),
    calories: z.number().min(0, 'السعرات الحرارية لا يمكن أن تكون سالبة'),
});

export const MacroItemSchema = z.object({
    value: z.number().min(0, 'النسبة المئوية يجب أن تكون أكبر من أو تساوي 0').max(100, 'النسبة المئوية يجب أن تكون أقل من أو تساوي 100'),
    color: z.string().default('bg-gray-500'),
});

export const MacrosSchema = z.object({
    protein: MacroItemSchema,
    carbs: MacroItemSchema,
    fats: MacroItemSchema,
}).refine((data) => {
    const total = data.protein.value + data.carbs.value + data.fats.value;
    return total === 100;
}, {
    message: 'مجموع نسب المغذيات (البروتين، الكربوهيدرات، الدهون) يجب أن يساوي 100%',
    path: ['protein']
});

export const NutritionPlanRequestSchema = z.object({
    name: z.string().min(2, 'اسم البرنامج يجب أن يتكون من حرفين على الأقل'),
    description: z.string().min(1, 'الوصف مطلوب'),
    duration: z.string().min(1, 'المدة مطلوبة'),
    participants: z.number().min(0, 'عدد المشتركين لا يمكن أن يكون سالباً').default(0),
    calories: z.number().min(0, 'السعرات الحرارية يجب أن تكون أكبر من 0'),
    image: z.string().min(1, 'أيقونة البرنامج مطلوبة').default('🍎'),
    macros: MacrosSchema,
    meals: z.array(MealSchema).min(1, 'يجب إدخال وجبة واحدة على الأقل'),
    assignedClientId: z.union([z.number(), z.string()]).nullable().optional(),
    status: z.enum(['نشط', 'مسودة']).default('نشط')
});

export const NutritionPlanResponseSchema = z.object({
    id: z.union([z.string(), z.number()]),
    name: z.string(),
    description: z.string(),
    duration: z.string(),
    participants: z.number(),
    calories: z.number(),
    image: z.string(),
    macros: z.object({
        protein: MacroItemSchema,
        carbs: MacroItemSchema,
        fats: MacroItemSchema,
    }),
    meals: z.array(MealSchema),
    assignedClientId: z.union([z.number(), z.string()]).nullable().optional(),
    status: z.string().default('نشط')
});

export const NutritionPlansResponseSchema = z.array(NutritionPlanResponseSchema);
