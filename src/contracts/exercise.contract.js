import { z } from 'zod';

export const ExerciseDifficultySchema = z.enum(['مبتدئ', 'متوسط', 'متقدم'], {
    errorMap: () => ({ message: 'مستوى الصعوبة يجب أن يكون: مبتدئ، متوسط، أو متقدم' })
});

export const ExerciseRequestSchema = z.object({
    name: z.string().min(2, 'اسم التمرين يجب أن يتكون من حرفين على الأقل'),
    duration: z.string().min(1, 'المدة مطلوبة'),
    difficulty: ExerciseDifficultySchema,
    participants: z.number().min(0, 'عدد المشاركين لا يمكن أن يكون سالباً').default(0),
    sets: z.string().min(1, 'تفاصيل المجموعات والتكرارات مطلوبة'),
    image: z.string().min(1, 'الرمز التعبيري أو رابط الصورة مطلوب').default('💪'),
});

export const ExerciseResponseSchema = z.object({
    id: z.union([z.string(), z.number()]),
    name: z.string(),
    duration: z.string(),
    difficulty: z.string(),
    participants: z.number(),
    sets: z.string(),
    image: z.string(),
});

export const ExerciseCategoryResponseSchema = z.object({
    id: z.union([z.string(), z.number()]),
    name: z.string(),
    description: z.string(),
    color: z.string(),
    exercises: z.array(ExerciseResponseSchema)
});

export const ExerciseCategoriesResponseSchema = z.array(ExerciseCategoryResponseSchema);
