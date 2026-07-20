import AppConfig from '@/config/app.config';
import api from '@/api/axios';
import { mockDatabase } from '@/mocks/mockDatabase';
import { simulateApi } from '@/utils/mockApi.helper';
import { parseApiResponse } from '@/utils/parseApiResponse';
import { LicenseResponseSchema, LicenseListResponseSchema } from '@/contracts/license.contract';

export const LicenseRepository = {
    getAll: async () => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.licenses.getAll());
        } else {
            const res = await api.get('/api/saas/licenses');
            result = res.data;
        }
        return parseApiResponse(LicenseListResponseSchema, result, 'License List');
    },

    get: async (tenantId) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.licenses.get(tenantId));
        } else {
            const res = await api.get(`/api/saas/licenses/tenant/${tenantId}`);
            result = res.data;
        }
        return parseApiResponse(LicenseResponseSchema, result, 'License Get');
    },

    create: async (data) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.licenses.create(data));
        } else {
            const res = await api.post('/api/saas/licenses', data);
            result = res.data;
        }
        return parseApiResponse(LicenseResponseSchema, result, 'License Create');
    },

    update: async (id, data) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.licenses.update(id, data));
        } else {
            const res = await api.put(`/api/saas/licenses/${id}`, data);
            result = res.data;
        }
        return parseApiResponse(LicenseResponseSchema, result, 'License Update');
    }
};

export default LicenseRepository;
