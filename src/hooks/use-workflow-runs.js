import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { WorkflowRepository } from '@/repositories/workflow.repository';

export const useWorkflowRuns = () => {
    const queryClient = useQueryClient();

    const runsQuery = useQuery({
        queryKey: ['workflow-runs'],
        queryFn: () => WorkflowRepository.getWorkflowRuns()
    });

    const triggerRunMutation = useMutation({
        mutationFn: (workflowId) => WorkflowRepository.createWorkflowRun({ workflowId, startTime: new Date().toISOString() }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workflow-runs'] });
        }
    });

    return {
        runs: runsQuery.data || [],
        isLoading: runsQuery.isLoading,
        triggerRun: triggerRunMutation.mutateAsync
    };
};

export default useWorkflowRuns;
