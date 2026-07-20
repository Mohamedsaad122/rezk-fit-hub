import { ActivityRepository } from '@/repositories/activity.repository';

export const ActivityService = {
    getActivities: (filters = {}) => {
        return ActivityRepository.getActivities(filters);
    },
    logActivity: (category, description, actor, clientId) => {
        return ActivityRepository.logActivity(category, description, actor, clientId);
    },
    getStatistics: () => {
        return ActivityRepository.getStatistics();
    }
};

export default ActivityService;
