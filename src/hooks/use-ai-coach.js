import { useMutation, useQueryClient } from '@tanstack/react-query';
import { NutritionAIService } from '@/services/nutrition-ai.service';
import { WorkoutAIService } from '@/services/workout-ai.service';
import { AIService } from '@/services/ai.service';

export const useAICoach = () => {
    const queryClient = useQueryClient();

    const generateWorkoutMutation = useMutation({
        mutationFn: ({ clientName, targetMuscle, fitnessLevel }) =>
            WorkoutAIService.generateWorkoutRoutine(clientName, targetMuscle, fitnessLevel)
    });

    const generateNutritionMutation = useMutation({
        mutationFn: ({ clientDetails, goal }) =>
            NutritionAIService.generateMealPlan(clientDetails, goal)
    });

    const summarizeClientMutation = useMutation({
        mutationFn: async ({ clientName, historyMetrics }) => {
            const prompt = `حلل تقدم الأداء ولخص كشف الحالة لـ ${clientName}: ${JSON.stringify(historyMetrics)}`;
            const res = await AIService.generateJSON(prompt, null, 'أنت مساعد تدريب ذكي');
            return res;
        }
    });

    return {
        generateWorkout: generateWorkoutMutation.mutateAsync,
        isWorkoutGenerating: generateWorkoutMutation.isPending,
        generateNutrition: generateNutritionMutation.mutateAsync,
        isNutritionGenerating: generateNutritionMutation.isPending,
        summarizeClient: summarizeClientMutation.mutateAsync,
        isSummarizingClient: summarizeClientMutation.isPending
    };
};

export default useAICoach;
