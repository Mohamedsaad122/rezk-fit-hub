import { API_ENDPOINTS } from '@/constants/api.constants';
import api from '@/api/axios';
import AppConfig from '@/config/app.config';
import { simulateApi } from '@/utils/mockApi.helper';
import { parseApiResponse } from '@/utils/parseApiResponse';
import { StatsOverviewResponseSchema, TraineeProgressStatsResponseSchema } from '@/contracts/stats.contract';

/**
 * Standardized Statistics and Tracking Repository.
 * Handles overall reporting, performance charting datasets, and trainee specific metric histories.
 */
export const StatsRepository = {
    getOverview: async () => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => [
                { key: 'active_clients', label: 'المتدربين النشطين', value: 124 },
                { key: 'total_workouts', label: 'التمارين المكتملة', value: 582 },
                { key: 'nutrition_plans', label: 'خطط التغذية النشطة', value: 36 },
                { key: 'retention_rate', label: 'معدل الالتزام', value: '92%' }
            ]);
        } else {
            const response = await api.get(API_ENDPOINTS.DASHBOARD.OVERVIEW);
            result = response.data;
        }

        return parseApiResponse(StatsOverviewResponseSchema, result, 'Stats Overview');
    },

    getTraineeProgress: async (traineeId) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => [
                { date: '2026-06-01', weight: 85, fatPercentage: 22, muscleMass: 35, caloriesConsumed: 2200, caloriesBurned: 500 },
                { date: '2026-06-15', weight: 83.5, fatPercentage: 21, muscleMass: 35.5, caloriesConsumed: 2100, caloriesBurned: 550 },
                { date: '2026-07-01', weight: 82, fatPercentage: 19.8, muscleMass: 36, caloriesConsumed: 2000, caloriesBurned: 600 }
            ]);
        } else {
            const response = await api.get(API_ENDPOINTS.CLIENTS.STATS(traineeId));
            result = response.data;
        }

        return parseApiResponse(TraineeProgressStatsResponseSchema, result, 'Trainee Progress Stats');
    }
};

export default StatsRepository;
