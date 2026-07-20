import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FeatureFlagsService } from '@/services/feature-flags.service';
import { useFeatureFlagsStore } from '@/store/feature-flags.store';

export const useFeatureFlags = () => {
    const queryClient = useQueryClient();
    const { flags, setFlags, updateFlag: updateInStore } = useFeatureFlagsStore();

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['feature-flags'],
        queryFn: async () => {
            const list = await FeatureFlagsService.getFeatureFlags();
            setFlags(list);
            return list;
        }
    });

    const updateMutation = useMutation({
        mutationFn: async ({ key, updates }) => {
            return FeatureFlagsService.updateFlag(key, updates);
        },
        onSuccess: (updatedFlag) => {
            updateInStore(updatedFlag.key, updatedFlag);
            queryClient.invalidateQueries(['feature-flags']);
        }
    });

    return {
        flags: data || flags,
        isLoading,
        refetch,
        updateFlag: updateMutation.mutateAsync
    };
};

export default useFeatureFlags;
