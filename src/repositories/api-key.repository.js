import AppConfig from '@/config/app.config';
import api from '@/api/axios';
import { mockDatabase } from '@/mocks/mockDatabase';
import { simulateApi } from '@/utils/mockApi.helper';
import { parseApiResponse } from '@/utils/parseApiResponse';
import { ApiKeySchema, ApiKeyListSchema } from '@/contracts/api-key.contract';

export const ApiKeyRepository = {
    getKeys: async () => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.apiKeys.getAll());
        } else {
            const res = await api.get('/api/saas/developer/keys');
            result = res.data;
        }
        return parseApiResponse(ApiKeyListSchema, result, 'API Keys List');
    },

    createKey: async (data) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.apiKeys.create(data));
        } else {
            const res = await api.post('/api/saas/developer/keys', data);
            result = res.data;
        }
        return parseApiResponse(ApiKeySchema, result, 'API Key Create');
    },

    revokeKey: async (id) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.apiKeys.revoke(id));
        } else {
            const res = await api.post(`/api/saas/developer/keys/${id}/revoke`);
            result = res.data;
        }
        return parseApiResponse(ApiKeySchema, result, 'API Key Revoke');
    }
};

export default ApiKeyRepository;
