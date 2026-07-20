import AppConfig from '@/config/app.config';
import api from '@/api/axios';
import { mockDatabase } from '@/mocks/mockDatabase';
import { simulateApi } from '@/utils/mockApi.helper';
import { parseApiResponse } from '@/utils/parseApiResponse';
import { AutomationLogListSchema } from '@/contracts/automation.contract';

export const AutomationRepository = {
    getLogs: async () => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.automationLogs.getAll());
        } else {
            const res = await api.get('/api/saas/automation/logs');
            result = res.data;
        }
        return parseApiResponse(AutomationLogListSchema, result, 'Automation Logs List');
    },

    createLog: async (data) => {
        if (AppConfig.enableMock) {
            return simulateApi(() => mockDatabase.saas.automationLogs.create(data));
        } else {
            const res = await api.post('/api/saas/automation/logs', data);
            return res.data;
        }
    }
};

export default AutomationRepository;
