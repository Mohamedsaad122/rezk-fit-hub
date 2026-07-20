import AppConfig from '@/config/app.config';
import api from '@/api/axios';
import { mockDatabase } from '@/mocks/mockDatabase';
import { simulateApi } from '@/utils/mockApi.helper';
import { parseApiResponse } from '@/utils/parseApiResponse';
import { AuditSecurityLogListSchema } from '@/contracts/audit-security.contract';

export const SecurityRepository = {
    getLogs: async () => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.securityLogs.getAll());
        } else {
            const res = await api.get('/api/saas/security/logs');
            result = res.data;
        }
        return parseApiResponse(AuditSecurityLogListSchema, result, 'Security Audit Logs');
    },

    createLog: async (logData) => {
        if (AppConfig.enableMock) {
            return simulateApi(() => mockDatabase.saas.securityLogs.create(logData));
        } else {
            const res = await api.post('/api/saas/security/logs', logData);
            return res.data;
        }
    },

    getConfig: async () => {
        if (AppConfig.enableMock) {
            return simulateApi(() => mockDatabase.saas.securityConfig.get());
        } else {
            const res = await api.get('/api/saas/security/config');
            return res.data;
        }
    },

    updateConfig: async (config) => {
        if (AppConfig.enableMock) {
            return simulateApi(() => mockDatabase.saas.securityConfig.update(config));
        } else {
            const res = await api.put('/api/saas/security/config', config);
            return res.data;
        }
    }
};

export default SecurityRepository;
