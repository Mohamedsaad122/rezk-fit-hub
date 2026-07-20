import AppConfig from '@/config/app.config';
import api from '@/api/axios';
import { mockDatabase } from '@/mocks/mockDatabase';
import { simulateApi } from '@/utils/mockApi.helper';
import { parseApiResponse } from '@/utils/parseApiResponse';
import { LogListSchema, LogSchema } from '@/contracts/log.contract';

export const LogsRepository = {
    getAll: async () => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.devopsLogs.getAll());
        } else {
            const res = await api.get('/api/saas/devops/logs');
            result = res.data;
        }
        return parseApiResponse(LogListSchema, result, 'Logs List');
    },

    create: async (data) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.devopsLogs.create(data));
        } else {
            const res = await api.post('/api/saas/devops/logs', data);
            result = res.data;
        }
        return parseApiResponse(LogSchema, result, 'Log Create');
    }
};

export default LogsRepository;
