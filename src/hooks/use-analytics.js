import { useQuery } from '@tanstack/react-query';
import { AnalyticsService } from '@/services/analytics.service';

/**
 * Custom React Query hook to load complete analytics metrics, charts, and forecasts.
 */
export const useAnalytics = (filters = {}) => {
    const queryKey = ['analytics', 'metrics', filters];

    const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
        queryKey,
        queryFn: () => AnalyticsService.getAnalyticsData(filters),
        placeholderData: (previousData) => previousData
    });

    return {
        isLoading,
        isFetching,
        isError,
        error,
        data: data || null,
        refetch
    };
};

export default useAnalytics;
