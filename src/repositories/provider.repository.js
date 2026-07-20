import AppConfig from '@/config/app.config';
import api from '@/api/axios';
import { mockDatabase } from '@/mocks/mockDatabase';
import { simulateApi } from '@/utils/mockApi.helper';
import { parseApiResponse } from '@/utils/parseApiResponse';
import { CalendarSyncLogListSchema, CalendarSyncLogSchema } from '@/contracts/calendar-sync.contract';

export const ProviderRepository = {
    getSyncLogs: async () => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.calendarSync.getLogs());
        } else {
            const res = await api.get('/api/saas/sync/logs');
            result = res.data;
        }
        return parseApiResponse(CalendarSyncLogListSchema, result, 'Calendar Sync Logs');
    },

    createSyncLog: async (data) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.calendarSync.createLog(data));
        } else {
            const res = await api.post('/api/saas/sync/logs', data);
            result = res.data;
        }
        return parseApiResponse(CalendarSyncLogSchema, result, 'Calendar Sync Log Create');
    }
};

export default ProviderRepository;
