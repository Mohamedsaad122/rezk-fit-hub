import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NotificationService } from '@/services/notification.service';
import QUERY_KEYS from '@/constants/queryKeys';
import { toastService } from '@/services/toast.service';
import { useNotificationStore } from '@/store/notification.store';
import { normalizeListResponse } from '@/utils/normalization';

/**
 * Custom hook wrapping React Query queries for notifications management.
 */
export const useNotifications = (queryParams = {}) => {
    const queryClient = useQueryClient();
    const page = queryParams?.page || 1;
    const limit = queryParams?.limit || 10;
    const search = queryParams?.search || '';
    const status = queryParams?.status || 'All';
    const priority = queryParams?.priority || 'All';
    const sortBy = queryParams?.sortBy || 'Newest';

    const queryKey = ['notifications', 'list', { page, limit, search, status, priority, sortBy }];

    const notificationsQuery = useQuery({
        queryKey,
        queryFn: () => NotificationService.getAllNotifications({ page, limit, search, status, priority, sortBy }),
        placeholderData: (previousData) => previousData,
        staleTime: 30 * 1000,
        gcTime: 2 * 60 * 1000,
        refetchOnReconnect: true
    });

    const normalizedData = normalizeListResponse(notificationsQuery.data);

    // Mutation to update notification (read, unread, archived status)
    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => NotificationService.updateNotification(id, data),
        onMutate: async ({ id, data }) => {
            await queryClient.cancelQueries({ queryKey: ['notifications'] });
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.notifications.unread });

            const previousUnread = queryClient.getQueryData(QUERY_KEYS.notifications.unread);

            if (previousUnread && data.status === 'Read') {
                const rawList = previousUnread.data || previousUnread || [];
                const filtered = Array.isArray(rawList) ? rawList.filter(item => item.id !== id) : [];
                queryClient.setQueryData(QUERY_KEYS.notifications.unread, filtered);
            }

            return { previousUnread };
        },
        onError: (error, variables, context) => {
            if (context?.previousUnread) {
                queryClient.setQueryData(QUERY_KEYS.notifications.unread, context.previousUnread);
            }
            toastService.error('فشل تحديث حالة الإشعار', error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications.all });
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
        }
    });

    // Mutation to delete a notification
    const deleteMutation = useMutation({
        mutationFn: (id) => NotificationService.deleteNotification(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications.all });
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            toastService.success('تم حذف الإشعار بنجاح');
        },
        onError: (error) => {
            toastService.error('فشل حذف الإشعار', error.message);
        }
    });

    return {
        isLoading: notificationsQuery.isLoading,
        isFetching: notificationsQuery.isFetching,
        isPending: notificationsQuery.isPending,
        isRefetching: notificationsQuery.isRefetching,
        isError: notificationsQuery.isError,
        error: notificationsQuery.error,
        data: normalizedData,
        refetch: notificationsQuery.refetch,
        updateStatus: updateMutation.mutateAsync,
        deleteNotification: deleteMutation.mutateAsync,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending
    };
};

/**
 * Custom hook wrapping React Query queries for unread notifications count and quick lists.
 */
export const useUnreadNotifications = () => {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: QUERY_KEYS.notifications.unread,
        queryFn: () => NotificationService.getAllNotifications({ status: 'Unread', limit: 100 }),
        staleTime: 30 * 1000,
        gcTime: 2 * 60 * 1000,
        refetchOnReconnect: true
    });

    const rawList = query.data?.data || query.data || [];
    const list = Array.isArray(rawList) ? rawList : [];
    const count = list.length;

    const markAllReadMutation = useMutation({
        mutationFn: () => NotificationService.markAllRead(),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: ['notifications'] });
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.notifications.unread });

            const previousUnread = queryClient.getQueryData(QUERY_KEYS.notifications.unread);

            // Empty unread lists optimistically
            queryClient.setQueryData(QUERY_KEYS.notifications.unread, []);

            return { previousUnread };
        },
        onError: (error, variables, context) => {
            if (context?.previousUnread) {
                queryClient.setQueryData(QUERY_KEYS.notifications.unread, context.previousUnread);
            }
            toastService.error('فشل تحديث التنبيهات', error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications.all });
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            toastService.success('تم تحديد جميع التنبيهات كمقروءة');
        }
    });

    return {
        isLoading: query.isLoading,
        unreadNotifications: list,
        unreadCount: count,
        refetch: query.refetch,
        markAllAsRead: markAllReadMutation.mutateAsync,
        isMarkingAllRead: markAllReadMutation.isPending
    };
};

/**
 * Custom hook wrapping React Query queries for notification preferences and settings.
 */
export const useNotificationSettings = () => {
    const queryClient = useQueryClient();
    const updateStoreSettings = useNotificationStore((state) => state.updateSettings);

    const query = useQuery({
        queryKey: QUERY_KEYS.notifications.settings,
        queryFn: () => NotificationService.getSettings(),
        staleTime: 10 * 60 * 1000,
        gcTime: 15 * 60 * 1000,
        refetchOnReconnect: true
    });

    const updateMutation = useMutation({
        mutationFn: (settingsData) => NotificationService.updateSettings(settingsData),
        onSuccess: (data) => {
            updateStoreSettings(data);
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications.settings });
            toastService.success('تم حفظ الإعدادات بنجاح');
        },
        onError: (error) => {
            toastService.error('فشل حفظ الإعدادات', error.message);
        }
    });

    return {
        settings: query.data || null,
        isLoading: query.isLoading,
        updateSettings: updateMutation.mutateAsync,
        isUpdating: updateMutation.isPending
    };
};

export default useNotifications;
