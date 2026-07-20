import { useQuery } from '@tanstack/react-query';
import { ActivityService } from '@/services/activity.service';

export const useActivityFeed = (filters = {}) => {
    return useQuery({
        queryKey: ['activities', 'feed', filters],
        queryFn: () => ActivityService.getActivities(filters)
    });
};

export const useActivityStatistics = () => {
    return useQuery({
        queryKey: ['activities', 'statistics'],
        queryFn: () => ActivityService.getStatistics()
    });
};

export default {
    useActivityFeed,
    useActivityStatistics
};
