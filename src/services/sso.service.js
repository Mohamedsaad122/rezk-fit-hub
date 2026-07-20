import AppConfig from '@/config/app.config';
import api from '@/api/axios';
import { mockDatabase } from '@/mocks/mockDatabase';
import { simulateApi } from '@/utils/mockApi.helper';

export const SsoService = {
    getSettings: async () => {
        if (AppConfig.enableMock) {
            return simulateApi(() => mockDatabase.saas.ssoSettings || []);
        } else {
            const res = await api.get('/api/saas/security/sso');
            return res.data;
        }
    },

    saveSettings: async (settings) => {
        if (AppConfig.enableMock) {
            return simulateApi(() => {
                mockDatabase.saas.ssoSettings = settings;
                return mockDatabase.saas.ssoSettings;
            });
        } else {
            const res = await api.post('/api/saas/security/sso', settings);
            return res.data;
        }
    },

    authenticateViaSso: async (provider, token) => {
        // Mock validation for federation logins
        if (!token) {
            throw new Error('SSO Authentication token is required');
        }

        // Return a mock user claims payload
        return {
            userId: 101,
            email: 'partner-sso@company.com',
            name: 'SSO User Client',
            provider
        };
    }
};

export default SsoService;
