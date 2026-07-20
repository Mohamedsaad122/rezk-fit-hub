import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TaskService } from '@/services/task.service';
import QUERY_KEYS from '@/constants/queryKeys';
import { toastService } from '@/services/toast.service';
import { normalizeListResponse } from '@/utils/normalization';

/**
 * Custom hook wrapping queries for complete tasks listing, filtering, search, and mutations.
 */
export const useTasks = (queryParams = {}) => {
    const queryClient = useQueryClient();
    const page = queryParams?.page || 1;
    const limit = queryParams?.limit || 10;
    const search = queryParams?.search || '';
    const status = queryParams?.status || 'All';
    const priority = queryParams?.priority || 'All';
    const category = queryParams?.category || 'All';
    const sortBy = queryParams?.sortBy || 'Newest';
    const clientId = queryParams?.clientId || null;

    const queryKey = ['tasks', 'list', { page, limit, search, status, priority, category, sortBy, clientId }];

    const tasksQuery = useQuery({
        queryKey,
        queryFn: () => TaskService.getAllTasks({ page, limit, search, status, priority, category, sortBy, clientId }),
        placeholderData: (previousData) => previousData,
        staleTime: 30 * 1000,
        gcTime: 2 * 60 * 1000,
        refetchOnReconnect: true
    });

    const normalizedData = normalizeListResponse(tasksQuery.data);

    // Create Task Mutation
    const createMutation = useMutation({
        mutationFn: (taskData) => TaskService.createTask(taskData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications.all });
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            toastService.success('تم إنشاء المهمة بنجاح');
        },
        onError: (error) => {
            toastService.error('فشل إنشاء المهمة', error.message);
        }
    });

    // Update Task Mutation with Optimistic Updates & manual rollbacks
    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => TaskService.updateTask(id, data),
        onMutate: async ({ id, data }) => {
            await queryClient.cancelQueries({ queryKey: ['tasks'] });
            await queryClient.cancelQueries({ queryKey: ['tasks', 'detail', id] });

            const previousTask = queryClient.getQueryData(['tasks', 'detail', id]);
            
            if (previousTask) {
                queryClient.setQueryData(['tasks', 'detail', id], {
                    ...previousTask,
                    ...data
                });
            }

            return { previousTask, id };
        },
        onError: (error, _, context) => {
            if (context?.previousTask) {
                queryClient.setQueryData(['tasks', 'detail', context.id], context.previousTask);
            }
            toastService.error('فشل تحديث المهمة', error.message);
        },
        onSuccess: (data, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            queryClient.invalidateQueries({ queryKey: ['tasks', 'detail', id] });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications.all });
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        }
    });

    // Delete Task Mutation
    const deleteMutation = useMutation({
        mutationFn: (id) => TaskService.deleteTask(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            toastService.success('تم حذف المهمة بنجاح');
        },
        onError: (error) => {
            toastService.error('فشل حذف المهمة', error.message);
        }
    });

    // Bulk Update Mutation
    const bulkUpdateMutation = useMutation({
        mutationFn: ({ ids, data }) => TaskService.bulkUpdateTasks(ids, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
            toastService.success('تم تحديث المهام بنجاح');
        },
        onError: (error) => {
            toastService.error('فشل تحديث المهام الجماعي', error.message);
        }
    });

    return {
        isLoading: tasksQuery.isLoading,
        isFetching: tasksQuery.isFetching,
        isPending: tasksQuery.isPending,
        isRefetching: tasksQuery.isRefetching,
        isError: tasksQuery.isError,
        error: tasksQuery.error,
        data: normalizedData,
        refetch: tasksQuery.refetch,
        createTask: createMutation.mutateAsync,
        updateTask: updateMutation.mutateAsync,
        deleteTask: deleteMutation.mutateAsync,
        bulkUpdateTasks: bulkUpdateMutation.mutateAsync,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
        isBulkUpdating: bulkUpdateMutation.isPending
    };
};

/**
 * Custom hook wrapping queries for single task details.
 */
export const useTask = (id) => {
    const taskQuery = useQuery({
        queryKey: ['tasks', 'detail', id],
        queryFn: () => TaskService.getTaskById(id),
        enabled: !!id,
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
        refetchOnReconnect: true
    });

    return {
        isLoading: taskQuery.isLoading,
        isError: taskQuery.isError,
        error: taskQuery.error,
        data: taskQuery.data || null,
        refetch: taskQuery.refetch
    };
};

/**
 * Custom hook wrapping queries for task metrics and statistics.
 */
export const useTaskStatistics = () => {
    const statsQuery = useQuery({
        queryKey: QUERY_KEYS.tasks.statistics(),
        queryFn: () => TaskService.getStatistics(),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnReconnect: true
    });

    return {
        isLoading: statsQuery.isLoading,
        isError: statsQuery.isError,
        data: statsQuery.data || {
            total: 0,
            todo: 0,
            inProgress: 0,
            completed: 0,
            cancelled: 0,
            overdue: 0,
            completionRate: 0
        },
        refetch: statsQuery.refetch
    };
};

/**
 * Custom hook for tasks due today.
 */
export const useTodayTasks = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const queryKey = ['tasks', 'list', { status: 'Todo', dueDate: todayStr }];

    const query = useQuery({
        queryKey,
        queryFn: () => TaskService.getAllTasks({ status: 'Todo', page: 1, limit: 100 }),
        staleTime: 30 * 1000,
        gcTime: 2 * 60 * 1000,
        refetchOnReconnect: true
    });

    const list = query.data?.data || query.data || [];
    const todayTasks = Array.isArray(list) ? list.filter(t => t.dueDate === todayStr) : [];

    return {
        isLoading: query.isLoading,
        data: todayTasks,
        count: todayTasks.length,
        refetch: query.refetch
    };
};

/**
 * Custom hook for overdue tasks.
 */
export const useOverdueTasks = () => {
    const queryKey = ['tasks', 'list', { status: 'Overdue' }];

    const query = useQuery({
        queryKey,
        queryFn: () => TaskService.getAllTasks({ status: 'Overdue', page: 1, limit: 100 }),
        staleTime: 30 * 1000,
        gcTime: 2 * 60 * 1000,
        refetchOnReconnect: true
    });

    const list = query.data?.data || query.data || [];
    const overdueTasks = Array.isArray(list) ? list : [];

    return {
        isLoading: query.isLoading,
        data: overdueTasks,
        count: overdueTasks.length,
        refetch: query.refetch
    };
};

export default useTasks;
