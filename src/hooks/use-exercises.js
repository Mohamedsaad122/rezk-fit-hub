import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ExerciseService } from '@/services/exercise.service';
import QUERY_KEYS from '@/constants/queryKeys';
import { toastService } from '@/services/toast.service';

/**
 * Custom hook wrapping React Query queries for exercise categories and routines.
 */
export const useExercises = () => {
    const categoriesQuery = useQuery({
        queryKey: QUERY_KEYS.exercises.all,
        queryFn: () => ExerciseService.getAllCategories(),
    });

    return {
        isLoading: categoriesQuery.isLoading,
        isFetching: categoriesQuery.isFetching,
        isPending: categoriesQuery.isPending,
        isRefetching: categoriesQuery.isRefetching,
        isError: categoriesQuery.isError,
        error: categoriesQuery.error,
        data: categoriesQuery.data || [],
        refetch: categoriesQuery.refetch,
    };
};

/**
 * Mutation hook to create an exercise inside a specific category.
 */
export const useCreateExercise = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ categoryId, exerciseData }) => ExerciseService.createExercise(categoryId, exerciseData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.exercises.all });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard.stats });
            toastService.success('تمت إضافة التمرين بنجاح');
        },
        onError: (error) => {
            toastService.error('فشل إضافة التمرين', error.message);
        }
    });
};

/**
 * Mutation hook to update an exercise.
 */
export const useUpdateExercise = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ exerciseId, exerciseData }) => ExerciseService.updateExercise(exerciseId, exerciseData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.exercises.all });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard.stats });
            toastService.success('تم تحديث التمرين بنجاح');
        },
        onError: (error) => {
            toastService.error('فشل تحديث التمرين', error.message);
        }
    });
};

/**
 * Mutation hook to delete an exercise.
 */
export const useDeleteExercise = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (exerciseId) => ExerciseService.deleteExercise(exerciseId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.exercises.all });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard.stats });
            toastService.success('تم حذف التمرين بنجاح');
        },
        onError: (error) => {
            toastService.error('فشل حذف التمرين', error.message);
        }
    });
};

export default useExercises;
