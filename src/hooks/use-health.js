import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HealthService } from '@/services/health.service';
import { useHealthStore } from '@/store/health.store';

export const useHealth = () => {
    const queryClient = useQueryClient();
    const { systemHealth, setSystemHealth, updateServiceHealth } = useHealthStore();

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['system-health'],
        queryFn: async () => {
            const status = await HealthService.getSystemHealth();
            setSystemHealth(status);
            return status;
        }
    });

    const pingMutation = useMutation({
        mutationFn: async (serviceKey) => {
            return HealthService.pingService(serviceKey);
        },
        onSuccess: (updatedHealth, serviceKey) => {
            updateServiceHealth(serviceKey, updatedHealth);
            queryClient.invalidateQueries(['system-health']);
        }
    });

    return {
        systemHealth: data || systemHealth,
        isLoading,
        refetch,
        pingService: pingMutation.mutateAsync
    };
};

export default useHealth;
