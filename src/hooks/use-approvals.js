import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ApprovalRepository } from '@/repositories/approval.repository';

export const useApprovals = () => {
    const queryClient = useQueryClient();

    const approvalsQuery = useQuery({
        queryKey: ['approvals'],
        queryFn: () => ApprovalRepository.getApprovals()
    });

    const updateApprovalStatusMutation = useMutation({
        mutationFn: ({ id, status, response }) => ApprovalRepository.updateApprovalStatus(id, status, response),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['approvals'] });
        }
    });

    return {
        approvals: approvalsQuery.data || [],
        isLoading: approvalsQuery.isLoading,
        updateApprovalStatus: updateApprovalStatusMutation.mutateAsync
    };
};

export default useApprovals;
