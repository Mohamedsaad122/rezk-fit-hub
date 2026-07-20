import { AnalyticsRepository } from '@/repositories/analytics.repository';

export const AnalyticsService = {
    getAnalyticsData: (filters = {}) => {
        return AnalyticsRepository.getMetrics(filters);
    }
};

export default AnalyticsService;
