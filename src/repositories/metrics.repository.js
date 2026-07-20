import AppConfig from '@/config/app.config';
import api from '@/api/axios';
import { mockDatabase } from '@/mocks/mockDatabase';
import { simulateApi } from '@/utils/mockApi.helper';
import { parseApiResponse } from '@/utils/parseApiResponse';
import { MetricListSchema, MetricSchema } from '@/contracts/metric.contract';

export const MetricsRepository = {
    getAll: async () => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.devopsMetrics.getAll());
        } else {
            const res = await api.get('/api/saas/devops/metrics');
            result = res.data;
        }
        return parseApiResponse(MetricListSchema, result, 'Metrics List');
    },

    create: async (data) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.devopsMetrics.create(data));
        } else {
            const res = await api.post('/api/saas/devops/metrics', data);
            result = res.data;
        }
        return parseApiResponse(MetricSchema, result, 'Metric Create');
    }
};

export default MetricsRepository;
