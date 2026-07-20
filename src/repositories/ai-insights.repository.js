import AppConfig from '@/config/app.config';
import api from '@/api/axios';
import { mockDatabase } from '@/mocks/mockDatabase';
import { simulateApi } from '@/utils/mockApi.helper';
import { parseApiResponse } from '@/utils/parseApiResponse';
import { PredictiveInsightSchema, PredictiveInsightListSchema } from '@/contracts/ai-insights.contract';

export const AIInsightsRepository = {
    getAll: async () => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.ai.insights.getAll());
        } else {
            const res = await api.get('/api/saas/ai/insights');
            result = res.data;
        }
        return parseApiResponse(PredictiveInsightListSchema, result, 'AI Insights List');
    },

    createInsight: async (data) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.ai.insights.create(data));
        } else {
            const res = await api.post('/api/saas/ai/insights', data);
            result = res.data;
        }
        return parseApiResponse(PredictiveInsightSchema, result, 'AI Insight Create');
    }
};

export default AIInsightsRepository;
