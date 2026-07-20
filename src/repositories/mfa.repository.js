import AppConfig from '@/config/app.config';
import api from '@/api/axios';
import { mockDatabase } from '@/mocks/mockDatabase';
import { simulateApi } from '@/utils/mockApi.helper';

export const MfaRepository = {
    getSettings: async (userId) => {
        if (AppConfig.enableMock) {
            return simulateApi(() => mockDatabase.saas.mfaSettings.get(userId));
        } else {
            const res = await api.get(`/api/saas/security/mfa?userId=${userId}`);
            return res.data;
        }
    },

    saveSettings: async (userId, data) => {
        if (AppConfig.enableMock) {
            return simulateApi(() => mockDatabase.saas.mfaSettings.set(userId, data));
        } else {
            const res = await api.post(`/api/saas/security/mfa?userId=${userId}`, data);
            return res.data;
        }
    }
};

export default MfaRepository;
