import { AIService } from '@/services/ai.service';
import { PromptBuilderService } from '@/services/prompt-builder.service';
import { eventBus } from '@/realtime/event-bus';

export const WorkoutAIService = {
    generateWorkoutRoutine: async (clientName, targetMuscle, fitnessLevel) => {
        try {
            const prompt = `صمم روتين تمرين لـ ${clientName}، مستوى اللياقة ${fitnessLevel}، ويستهدف عضلات ${targetMuscle}`;
            const systemPrompt = PromptBuilderService.buildSystemPrompt('Coach');

            eventBus.publish('AI_PROCESSING_STARTED', { type: 'Workout' });
            const routine = await AIService.generateJSON(prompt, null, systemPrompt);
            eventBus.publish('AI_PROCESSING_FINISHED', { type: 'Workout', data: routine });

            return routine;
        } catch (error) {
            console.error('Error generating workout routine:', error);
            throw error;
        }
    }
};

export default WorkoutAIService;
