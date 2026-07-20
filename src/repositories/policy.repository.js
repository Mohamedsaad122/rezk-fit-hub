import AppConfig from '@/config/app.config';
import api from '@/api/axios';
import { mockDatabase } from '@/mocks/mockDatabase';
import { simulateApi } from '@/utils/mockApi.helper';

export const PolicyRepository = {
    getPolicy: async () => {
        if (AppConfig.enableMock) {
            return simulateApi(() => mockDatabase.saas.enterprisePolicy.get());
        } else {
            const res = await api.get('/api/saas/security/policy');
            return res.data;
        }
    },

    updatePolicy: async (data) => {
        if (AppConfig.enableMock) {
            return simulateApi(() => mockDatabase.saas.enterprisePolicy.update(data));
        } else {
            const res = await api.put('/api/saas/security/policy', data);
            return res.data;
        }
    }
};

export default PolicyRepository;
