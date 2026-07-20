import AppConfig from '@/config/app.config';
import { mockDatabase } from '@/mocks/mockDatabase';
import { simulateApi } from '@/utils/mockApi.helper';
import { parseApiResponse } from '@/utils/parseApiResponse';
import { z } from 'zod';
import { ActivitySchema, ActivityStatisticsSchema } from '@/contracts/activity.contract';

export const ActivityRepository = {
    getActivities: async (filters = {}) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.activities.getAll(filters));
        } else {
            result = [];
        }
        return parseApiResponse(z.array(ActivitySchema), result, 'Activity Logs List');
    },

    logActivity: async (category, description, actor, clientId) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.activities.create({
                category,
                description,
                actor,
                clientId: clientId ? Number(clientId) : null
            }));
        } else {
            result = {};
        }
        return parseApiResponse(ActivitySchema, result, 'Created Activity Log');
    },

    getStatistics: async () => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.activities.getStatistics());
        } else {
            result = {};
        }
        return parseApiResponse(ActivityStatisticsSchema, result, 'Activity Feed Statistics');
    }
};

export default ActivityRepository;
