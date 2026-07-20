import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { WorkflowRepository } from '@/repositories/workflow.repository';

export const useWorkflows = () => {
    const queryClient = useQueryClient();

    const workflowsQuery = useQuery({
        queryKey: ['workflows'],
        queryFn: () => WorkflowRepository.getWorkflows()
    });

    const createWorkflowMutation = useMutation({
        mutationFn: (data) => WorkflowRepository.createWorkflow(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workflows'] });
        }
    });

    const deleteWorkflowMutation = useMutation({
        mutationFn: (id) => WorkflowRepository.deleteWorkflow(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workflows'] });
        }
    });

    return {
        workflows: workflowsQuery.data || [],
        isLoading: workflowsQuery.isLoading,
        createWorkflow: createWorkflowMutation.mutateAsync,
        deleteWorkflow: deleteWorkflowMutation.mutateAsync
    };
};

export default useWorkflows;
