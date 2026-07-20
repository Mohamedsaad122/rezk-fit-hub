import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MetricsService } from '@/services/metrics.service';
import { useMetricsStore } from '@/store/metrics.store';

export const useMetrics = () => {
    const queryClient = useQueryClient();
    const { metrics, setMetrics, addMetric } = useMetricsStore();

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['devops-metrics'],
        queryFn: async () => {
            const list = await MetricsService.getMetrics();
            setMetrics(list);
            return list;
        }
    });

    const recordMutation = useMutation({
        mutationFn: async ({ key, value, unit }) => {
            return MetricsService.recordMetric(key, value, unit);
        },
        onSuccess: (newMetric) => {
            addMetric(newMetric);
            queryClient.invalidateQueries(['devops-metrics']);
        }
    });

    return {
        metrics: data || metrics,
        isLoading,
        refetch,
        recordMetric: recordMutation.mutateAsync
    };
};

export default useMetrics;
