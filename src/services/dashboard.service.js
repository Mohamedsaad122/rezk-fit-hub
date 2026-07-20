import { DashboardRepository } from '@/repositories/dashboard.repository';

/**
 * Service acting as business layer between controllers and repository actions for Dashboard Stats.
 */
export const DashboardService = {
    getStats: () => {
        return DashboardRepository.getStats();
    },

    getRecentActivities: () => {
        return DashboardRepository.getRecentActivities();
    },

    getMonthlyProgress: () => {
        return DashboardRepository.getMonthlyProgress();
    },

    getTopTrainees: () => {
        return DashboardRepository.getTopTrainees();
    }
};

export default DashboardService;
