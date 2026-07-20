import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminUserService } from '@/services/adminUser.service';
import { toastService } from '@/services/toast.service';

export const useAdminUsers = (filters = {}) => {
    const query = useQuery({
        queryKey: ['adminUsers', filters],
        queryFn: () => AdminUserService.getAllUsers(filters),
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

export const useCreateAdminUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (userData) => AdminUserService.createUser(userData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
            queryClient.invalidateQueries({ queryKey: ['auditLogs'] });
            toastService.success('تم إنشاء حساب المستخدم بنجاح');
        },
        onError: (err) => {
            toastService.error('فشل إنشاء المستخدم', err.message);
        }
    });
};

export const useUpdateAdminUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => AdminUserService.updateUser(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
            queryClient.invalidateQueries({ queryKey: ['auditLogs'] });
            toastService.success('تم تحديث بيانات المستخدم بنجاح');
        },
        onError: (err) => {
            toastService.error('فشل تحديث البيانات', err.message);
        }
    });
};

export const useDeleteAdminUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => AdminUserService.deleteUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
            queryClient.invalidateQueries({ queryKey: ['auditLogs'] });
            toastService.success('تم حذف حساب المستخدم نهائياً');
        },
        onError: (err) => {
            toastService.error('فشل حذف حساب المستخدم', err.message);
        }
    });
};
