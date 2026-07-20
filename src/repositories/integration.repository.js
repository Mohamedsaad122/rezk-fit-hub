import AppConfig from '@/config/app.config';
import api from '@/api/axios';
import { mockDatabase } from '@/mocks/mockDatabase';
import { simulateApi } from '@/utils/mockApi.helper';
import { parseApiResponse } from '@/utils/parseApiResponse';
import { IntegrationListSchema, IntegrationSchema } from '@/contracts/integration.contract';

export const IntegrationRepository = {
    getAll: async () => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.integrations.getAll());
        } else {
            const res = await api.get('/api/saas/integrations');
            result = res.data;
        }
        return parseApiResponse(IntegrationListSchema, result, 'Integrations List');
    },

    update: async (id, data) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.integrations.update(id, data));
        } else {
            const res = await api.put(`/api/saas/integrations/${id}`, data);
            result = res.data;
        }
        return parseApiResponse(IntegrationSchema, result, 'Integration Update');
    }
};

export default IntegrationRepository;
