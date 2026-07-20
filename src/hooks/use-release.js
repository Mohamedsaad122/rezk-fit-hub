import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ReleaseService } from '@/services/release.service';
import { useReleaseStore } from '@/store/release.store';

export const useRelease = () => {
    const queryClient = useQueryClient();
    const { releases, setReleases, addRelease, rollbackRelease: rollbackInStore } = useReleaseStore();

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['releases'],
        queryFn: async () => {
            const list = await ReleaseService.getReleases();
            setReleases(list);
            return list;
        }
    });

    const deployMutation = useMutation({
        mutationFn: async ({ version, channel, description, canaryWeight }) => {
            return ReleaseService.deployRelease(version, channel, description, canaryWeight);
        },
        onSuccess: (newRelease) => {
            addRelease(newRelease);
            queryClient.invalidateQueries(['releases']);
        }
    });

    const rollbackMutation = useMutation({
        mutationFn: async (id) => {
            return ReleaseService.rollbackRelease(id);
        },
        onSuccess: (_, id) => {
            rollbackInStore(id);
            queryClient.invalidateQueries(['releases']);
        }
    });

    return {
        releases: data || releases,
        isLoading,
        refetch,
        deployRelease: deployMutation.mutateAsync,
        rollbackRelease: rollbackMutation.mutateAsync
    };
};

export default useRelease;
