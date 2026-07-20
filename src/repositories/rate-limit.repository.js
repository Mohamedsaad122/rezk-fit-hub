import AppConfig from '@/config/app.config';
import api from '@/api/axios';
import { mockDatabase } from '@/mocks/mockDatabase';
import { simulateApi } from '@/utils/mockApi.helper';
import { parseApiResponse } from '@/utils/parseApiResponse';
import { ApiLogListSchema } from '@/contracts/api-log.contract';

export const RateLimitRepository = {
    checkRateLimit: async (ip, limit, windowMs) => {
        if (AppConfig.enableMock) {
            return simulateApi(() => mockDatabase.saas.rateLimits.check(ip, limit, windowMs));
        } else {
            const res = await api.get(`/api/saas/developer/rate-limits?ip=${ip}`);
            return res.data;
        }
    },

    logRequest: async (logData) => {
        if (AppConfig.enableMock) {
            return simulateApi(() => mockDatabase.saas.apiLogs.create(logData));
        } else {
            const res = await api.post('/api/saas/developer/logs', logData);
            return res.data;
        }
    },

    getLogs: async () => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.apiLogs.getAll());
        } else {
            const res = await api.get('/api/saas/developer/logs');
            result = res.data;
        }
        return parseApiResponse(ApiLogListSchema, result, 'API Logs List');
    }
};

export default RateLimitRepository;
