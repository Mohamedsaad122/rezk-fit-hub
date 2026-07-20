import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NutritionService } from '@/services/nutrition.service';
import QUERY_KEYS from '@/constants/queryKeys';
import { toastService } from '@/services/toast.service';
import { normalizeListResponse } from '@/utils/normalization';

/**
 * Custom hook wrapping React Query queries for nutrition and diet plans.
 */
export const useNutrition = (queryParams = {}) => {
    const page = queryParams?.page || 1;
    const limit = queryParams?.limit || 10;
    const search = queryParams?.search || '';
    const status = queryParams?.status || '';

    const queryKey = QUERY_KEYS.nutrition.list({ page, limit, search, status });

    const plansQuery = useQuery({
        queryKey,
        queryFn: () => NutritionService.getAllPlans({ page, limit, search, status }),
        placeholderData: (previousData) => previousData,
    });

    const normalizedData = normalizeListResponse(plansQuery.data);

    return {
        isLoading: plansQuery.isLoading,
        isFetching: plansQuery.isFetching,
        isPending: plansQuery.isPending,
        isRefetching: plansQuery.isRefetching,
        isError: plansQuery.isError,
        error: plansQuery.error,
        data: normalizedData,
        refetch: plansQuery.refetch,
    };
};

/**
 * Mutation hook to create a nutrition plan.
 */
export const useCreateNutrition = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (planData) => NutritionService.createPlan(planData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.nutrition.all });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard.stats });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.clients.all });
            toastService.success('تم إنشاء النظام الغذائي بنجاح');
        },
        onError: (error) => {
            toastService.error('فشل إنشاء النظام الغذائي', error.message);
        }
    });
};

/**
 * Mutation hook to update a nutrition plan.
 */
export const useUpdateNutrition = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ planId, planData }) => NutritionService.updatePlan(planId, planData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.nutrition.all });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard.stats });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.clients.all });
            toastService.success('تم تحديث النظام الغذائي بنجاح');
        },
        onError: (error) => {
            toastService.error('فشل تحديث النظام الغذائي', error.message);
        }
    });
};

/**
 * Mutation hook to delete a nutrition plan.
 */
export const useDeleteNutrition = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (planId) => NutritionService.deletePlan(planId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.nutrition.all });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard.stats });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.clients.all });
            toastService.success('تم حذف النظام الغذائي بنجاح');
        },
        onError: (error) => {
            toastService.error('فشل حذف النظام الغذائي', error.message);
        }
    });
};

export default useNutrition;
