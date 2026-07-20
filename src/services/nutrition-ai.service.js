import { AIService } from '@/services/ai.service';
import { PromptBuilderService } from '@/services/prompt-builder.service';
import { eventBus } from '@/realtime/event-bus';

export const NutritionAIService = {
    generateMealPlan: async (clientDetails, goal) => {
        try {
            const prompt = `صمم نظام وجبات يومي مفصل لـ ${clientDetails.name}، بعمر ${clientDetails.age}، وزن ${clientDetails.weight} كجم، وهدف ${goal}`;
            const systemPrompt = PromptBuilderService.buildSystemPrompt('Nutrition');
            
            eventBus.publish('AI_PROCESSING_STARTED', { type: 'Nutrition' });
            const mealPlan = await AIService.generateJSON(prompt, null, systemPrompt);
            eventBus.publish('AI_PROCESSING_FINISHED', { type: 'Nutrition', data: mealPlan });

            return mealPlan;
        } catch (error) {
            console.error('Error generating meal plan:', error);
            throw error;
        }
    }
};

export default NutritionAIService;
