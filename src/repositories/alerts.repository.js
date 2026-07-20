import AppConfig from '@/config/app.config';
import api from '@/api/axios';
import { mockDatabase } from '@/mocks/mockDatabase';
import { simulateApi } from '@/utils/mockApi.helper';
import { parseApiResponse } from '@/utils/parseApiResponse';
import { AlertListSchema, AlertSchema } from '@/contracts/alert.contract';

export const AlertsRepository = {
    getAll: async () => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.devopsAlerts.getAll());
        } else {
            const res = await api.get('/api/saas/devops/alerts');
            result = res.data;
        }
        return parseApiResponse(AlertListSchema, result, 'Alerts List');
    },

    create: async (data) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.devopsAlerts.create(data));
        } else {
            const res = await api.post('/api/saas/devops/alerts', data);
            result = res.data;
        }
        return parseApiResponse(AlertSchema, result, 'Alert Create');
    },

    updateStatus: async (id, status, resolvedAt = null) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.devopsAlerts.updateStatus(id, status, resolvedAt));
        } else {
            const res = await api.patch(`/api/saas/devops/alerts/${id}`, { status, resolvedAt });
            result = res.data;
        }
        return parseApiResponse(AlertSchema, result, 'Alert Update Status');
    }
};

export default AlertsRepository;
