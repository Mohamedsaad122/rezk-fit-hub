import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AIInsightsRepository } from '@/repositories/ai-insights.repository';
import { RecommendationEngineService } from '@/services/recommendation-engine.service';

export const useAIInsights = () => {
    const queryClient = useQueryClient();

    const insightsQuery = useQuery({
        queryKey: ['saas', 'ai', 'insights'],
        queryFn: () => AIInsightsRepository.getAll()
    });

    const assessRiskMutation = useMutation({
        mutationFn: ({ clientId, clientName, attendanceRate, completedTasksRate }) =>
            RecommendationEngineService.assessClientRisk(clientId, clientName, attendanceRate, completedTasksRate),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['saas', 'ai', 'insights'] });
        }
    });

    const suggestAppointmentsMutation = useMutation({
        mutationFn: ({ clientId, historyLogs }) =>
            RecommendationEngineService.suggestAppointments(clientId, historyLogs)
    });

    return {
        insights: insightsQuery.data || [],
        isLoading: insightsQuery.isLoading,
        assessRisk: assessRiskMutation.mutateAsync,
        isAssessingRisk: assessRiskMutation.isPending,
        suggestAppointments: suggestAppointmentsMutation.mutateAsync,
        isSuggestingAppointments: suggestAppointmentsMutation.isPending
    };
};

export default useAIInsights;
