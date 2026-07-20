import AppConfig from '@/config/app.config';
import api from '@/api/axios';
import { mockDatabase } from '@/mocks/mockDatabase';
import { simulateApi } from '@/utils/mockApi.helper';
import { parseApiResponse } from '@/utils/parseApiResponse';
import { DeveloperAppSchema, DeveloperAppListSchema } from '@/contracts/developer-app.contract';

export const DeveloperRepository = {
    getApps: async () => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.developerApps.getAll());
        } else {
            const res = await api.get('/api/saas/developer/apps');
            result = res.data;
        }
        return parseApiResponse(DeveloperAppListSchema, result, 'Developer Apps List');
    },

    createApp: async (data) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.developerApps.create(data));
        } else {
            const res = await api.post('/api/saas/developer/apps', data);
            result = res.data;
        }
        return parseApiResponse(DeveloperAppSchema, result, 'Developer App Create');
    },

    deleteApp: async (id) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.developerApps.delete(id));
        } else {
            const res = await api.delete(`/api/saas/developer/apps/${id}`);
            result = res.data.success;
        }
        return result;
    }
};

export default DeveloperRepository;
