import { z } from 'zod';

export const AIPromptTemplateSchema = z.object({
    id: z.union([z.string(), z.number()]),
    name: z.string(),
    category: z.enum(['Workout', 'Nutrition', 'Insights', 'Coaching', 'Custom']),
    templateText: z.string(),
    variables: z.array(z.string())
});

export const AIPromptTemplateListSchema = z.array(AIPromptTemplateSchema);

export default AIPromptTemplateSchema;
