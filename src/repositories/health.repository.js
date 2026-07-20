import AppConfig from '@/config/app.config';
import api from '@/api/axios';
import { mockDatabase } from '@/mocks/mockDatabase';
import { simulateApi } from '@/utils/mockApi.helper';
import { parseApiResponse } from '@/utils/parseApiResponse';
import { SystemHealthCenterSchema } from '@/contracts/health.contract';

export const HealthRepository = {
    getSystemHealth: async () => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.reporting.health.get());
        } else {
            const res = await api.get('/api/monitoring/health');
            result = res.data;
        }
        return parseApiResponse(SystemHealthCenterSchema, result, 'System Health Center');
    },

    updateStatus: async (serviceKey, status, message, latencyMs) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.reporting.health.updateStatus(serviceKey, status, message, latencyMs));
        } else {
            const res = await api.patch(`/api/monitoring/health/${serviceKey}`, { status, message, latencyMs });
            result = res.data;
        }
        return result;
    }
};

export default HealthRepository;
