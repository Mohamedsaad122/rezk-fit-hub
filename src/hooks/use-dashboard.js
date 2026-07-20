import { useQuery } from '@tanstack/react-query';
import { DashboardService } from '@/services/dashboard.service';
import QUERY_KEYS from '@/constants/queryKeys';

/**
 * Custom hook wrapping React Query queries for dashboard metrics and top trainees.
 */
export const useDashboard = () => {
    const statsQuery = useQuery({
        queryKey: QUERY_KEYS.dashboard.stats,
        queryFn: () => DashboardService.getStats(),
    });

    const activitiesQuery = useQuery({
        queryKey: QUERY_KEYS.dashboard.activities,
        queryFn: () => DashboardService.getRecentActivities(),
    });

    const monthlyQuery = useQuery({
        queryKey: QUERY_KEYS.dashboard.monthly,
        queryFn: () => DashboardService.getMonthlyProgress(),
    });

    const traineesQuery = useQuery({
        queryKey: QUERY_KEYS.dashboard.trainees,
        queryFn: () => DashboardService.getTopTrainees(),
    });

    const isLoading = 
        statsQuery.isLoading || 
        activitiesQuery.isLoading || 
        monthlyQuery.isLoading || 
        traineesQuery.isLoading;

    const isFetching = 
        statsQuery.isFetching || 
        activitiesQuery.isFetching || 
        monthlyQuery.isFetching || 
        traineesQuery.isFetching;

    const isPending = 
        statsQuery.isPending || 
        activitiesQuery.isPending || 
        monthlyQuery.isPending || 
        traineesQuery.isPending;

    const isRefetching = 
        statsQuery.isRefetching || 
        activitiesQuery.isRefetching || 
        monthlyQuery.isRefetching || 
        traineesQuery.isRefetching;

    const isError = 
        statsQuery.isError || 
        activitiesQuery.isError || 
        monthlyQuery.isError || 
        traineesQuery.isError;

    const error = 
        statsQuery.error || 
        activitiesQuery.error || 
        monthlyQuery.error || 
        traineesQuery.error;

    const refetch = async () => {
        await Promise.all([
            statsQuery.refetch(),
            activitiesQuery.refetch(),
            monthlyQuery.refetch(),
            traineesQuery.refetch()
        ]);
    };

    return {
        isLoading,
        isFetching,
        isPending,
        isRefetching,
        isError,
        error,
        data: {
            stats: statsQuery.data || [],
            recentActivities: activitiesQuery.data || [],
            monthlyProgress: monthlyQuery.data || [],
            topTrainees: traineesQuery.data || [],
        },
        refetch,
    };
};

export default useDashboard;
