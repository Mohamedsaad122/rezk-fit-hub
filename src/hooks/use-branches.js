import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BranchService } from '@/services/branch.service';
import { toastService } from '@/services/toast.service';

export const useBranches = (filters = {}) => {
    const query = useQuery({
        queryKey: ['branches', filters],
        queryFn: () => BranchService.getAllBranches(filters),
        placeholderData: (prev) => prev
    });

    return {
        isLoading: query.isLoading,
        isFetching: query.isFetching,
        isError: query.isError,
        data: query.data?.data || [],
        meta: query.data?.meta || { page: 1, limit: 10, total: 0, totalPages: 0 },
        refetch: query.refetch
    };
};

export const useCreateBranch = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (branchData) => BranchService.createBranch(branchData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['branches'] });
            queryClient.invalidateQueries({ queryKey: ['auditLogs'] });
            toastService.success('تم إنشاء الفرع بنجاح');
        },
        onError: (err) => {
            toastService.error('فشل إنشاء الفرع', err.message);
        }
    });
};

export const useUpdateBranch = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => BranchService.updateBranch(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['branches'] });
            queryClient.invalidateQueries({ queryKey: ['auditLogs'] });
            toastService.success('تم تحديث الفرع بنجاح');
        },
        onError: (err) => {
            toastService.error('فشل تحديث الفرع', err.message);
        }
    });
};

export const useDeleteBranch = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => BranchService.deleteBranch(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['branches'] });
            queryClient.invalidateQueries({ queryKey: ['auditLogs'] });
            toastService.success('تم حذف الفرع نهائياً');
        },
        onError: (err) => {
            toastService.error('فشل حذف الفرع', err.message);
        }
    });
};
