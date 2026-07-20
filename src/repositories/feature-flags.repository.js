import AppConfig from '@/config/app.config';
import api from '@/api/axios';
import { mockDatabase } from '@/mocks/mockDatabase';
import { simulateApi } from '@/utils/mockApi.helper';
import { parseApiResponse } from '@/utils/parseApiResponse';
import { FeatureFlagListSchema, FeatureFlagSchema } from '@/contracts/feature-flag.contract';

export const FeatureFlagsRepository = {
    getAll: async () => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.devopsFeatureFlags.getAll());
        } else {
            const res = await api.get('/api/saas/devops/feature-flags');
            result = res.data;
        }
        return parseApiResponse(FeatureFlagListSchema, result, 'Feature Flags List');
    },

    create: async (data) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.devopsFeatureFlags.create(data));
        } else {
            const res = await api.post('/api/saas/devops/feature-flags', data);
            result = res.data;
        }
        return parseApiResponse(FeatureFlagSchema, result, 'Feature Flag Create');
    },

    update: async (key, data) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.devopsFeatureFlags.update(key, data));
        } else {
            const res = await api.put(`/api/saas/devops/feature-flags/${key}`, data);
            result = res.data;
        }
        return parseApiResponse(FeatureFlagSchema, result, 'Feature Flag Update');
    }
};

export default FeatureFlagsRepository;
