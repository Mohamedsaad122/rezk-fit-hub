import AppConfig from '@/config/app.config';
import api from '@/api/axios';
import { mockDatabase } from '@/mocks/mockDatabase';
import { simulateApi } from '@/utils/mockApi.helper';
import { parseApiResponse } from '@/utils/parseApiResponse';
import { ActiveSessionListSchema } from '@/contracts/session.contract';

export const SessionRepository = {
    getSessions: async () => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.activeSessions.getAll());
        } else {
            const res = await api.get('/api/saas/security/sessions');
            result = res.data;
        }
        return parseApiResponse(ActiveSessionListSchema, result, 'Active Sessions List');
    },

    createSession: async (data) => {
        if (AppConfig.enableMock) {
            return simulateApi(() => mockDatabase.saas.activeSessions.create(data));
        } else {
            const res = await api.post('/api/saas/security/sessions', data);
            return res.data;
        }
    },

    revokeSession: async (sessionId) => {
        if (AppConfig.enableMock) {
            return simulateApi(() => mockDatabase.saas.activeSessions.revoke(sessionId));
        } else {
            const res = await api.post(`/api/saas/security/sessions/${sessionId}/revoke`);
            return res.data.success;
        }
    }
};

export default SessionRepository;
