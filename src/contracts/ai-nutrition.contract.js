import { z } from 'zod';

export const MealSchema = z.object({
    name: z.string(),
    ingredients: z.array(z.string()),
    calories: z.number(),
    macros: z.object({
        protein: z.number(),
        carbs: z.number(),
        fats: z.number()
    })
});

export const NutritionRecommendationSchema = z.object({
    meals: z.array(MealSchema),
    advice: z.string(),
    dailyTarget: z.object({
        calories: z.number(),
        protein: z.number(),
        carbs: z.number(),
        fats: z.number()
    })
});

export default NutritionRecommendationSchema;
