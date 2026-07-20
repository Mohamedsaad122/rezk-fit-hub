import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ClientService } from '@/services/client.service';
import QUERY_KEYS from '@/constants/queryKeys';
import { toastService } from '@/services/toast.service';
import { normalizeListResponse } from '@/utils/normalization';

/**
 * Custom hook wrapping React Query queries for client trainees listing.
 */
export const useClients = (queryParams = {}) => {
    const page = queryParams?.page || 1;
    const limit = queryParams?.limit || 10;
    const search = queryParams?.search || '';
    const status = queryParams?.status || '';

    const queryKey = QUERY_KEYS.clients.list({ page, limit, search, status });
    
    const clientsQuery = useQuery({
        queryKey,
        queryFn: () => ClientService.getAllClients({ page, limit, search, status }),
        placeholderData: (previousData) => previousData,
        staleTime: 2 * 60 * 1000,
        gcTime: 5 * 60 * 1000,
        refetchOnReconnect: true
    });

    const normalizedData = normalizeListResponse(clientsQuery.data);

    return {
        isLoading: clientsQuery.isLoading,
        isFetching: clientsQuery.isFetching,
        isPending: clientsQuery.isPending,
        isRefetching: clientsQuery.isRefetching,
        isError: clientsQuery.isError,
        error: clientsQuery.error,
        data: normalizedData,
        refetch: clientsQuery.refetch,
    };
};

/**
 * Custom hook wrapping React Query queries for client details.
 */
export const useClientDetails = (clientId) => {
    const clientDetailsQuery = useQuery({
        queryKey: QUERY_KEYS.clients.detail(clientId),
        queryFn: () => ClientService.getClientById(clientId),
        enabled: !!clientId,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        refetchOnReconnect: true
    });

    return {
        isLoading: clientDetailsQuery.isLoading,
        isFetching: clientDetailsQuery.isFetching,
        isPending: clientDetailsQuery.isPending,
        isRefetching: clientDetailsQuery.isRefetching,
        isError: clientDetailsQuery.isError,
        error: clientDetailsQuery.error,
        data: clientDetailsQuery.data || null,
        refetch: clientDetailsQuery.refetch,
    };
};

/**
 * Mutation hook to create a client trainee.
 */
export const useCreateClient = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (clientData) => ClientService.createClient(clientData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.clients.all });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard.stats });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard.trainees });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.nutrition.all });
            toastService.success('تمت إضافة المتدرب بنجاح');
        },
        onError: (error) => {
            toastService.error('فشل إضافة المتدرب', error.message);
        }
    });
};

/**
 * Mutation hook to update a client trainee.
 * Implements optimistic updates and manual rollbacks.
 */
export const useUpdateClient = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ clientId, clientData }) => ClientService.updateClient(clientId, clientData),
        onMutate: async ({ clientId, clientData }) => {
            // Cancel outgoing detail fetches
            await queryClient.cancelQueries({ queryKey: QUERY_KEYS.clients.detail(clientId) });
            
            // Snapshot previous value
            const previousClient = queryClient.getQueryData(QUERY_KEYS.clients.detail(clientId));
            
            // Optimistically update
            if (previousClient) {
                queryClient.setQueryData(QUERY_KEYS.clients.detail(clientId), {
                    ...previousClient,
                    ...clientData
                });
            }
            
            return { previousClient, clientId };
        },
        onError: (error, _, context) => {
            // Rollback on failure
            if (context?.previousClient) {
                queryClient.setQueryData(QUERY_KEYS.clients.detail(context.clientId), context.previousClient);
            }
            toastService.error('فشل تحديث بيانات المتدرب', error.message);
        },
        onSuccess: (data, { clientId }) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.clients.all });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.clients.detail(clientId) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard.stats });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard.trainees });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.nutrition.all });
            toastService.success('تم تحديث بيانات المتدرب بنجاح');
        }
    });
};

/**
 * Mutation hook to delete a client trainee.
 */
export const useDeleteClient = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (clientId) => ClientService.deleteClient(clientId),
        onSuccess: (_, clientId) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.clients.all });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.clients.detail(clientId) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard.stats });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard.trainees });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.nutrition.all });
            toastService.success('تم حذف المتدرب بنجاح');
        },
        onError: (error) => {
            toastService.error('فشل حذف المتدرب', error.message);
        }
    });
};

export default useClients;
