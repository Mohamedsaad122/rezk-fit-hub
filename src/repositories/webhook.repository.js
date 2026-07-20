import AppConfig from '@/config/app.config';
import api from '@/api/axios';
import { mockDatabase } from '@/mocks/mockDatabase';
import { simulateApi } from '@/utils/mockApi.helper';
import { parseApiResponse } from '@/utils/parseApiResponse';
import { WebhookEndpointListSchema, WebhookEndpointSchema, WebhookDeliveryLogListSchema } from '@/contracts/webhook.contract';

export const WebhookRepository = {
    getAll: async () => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.webhooks.getAll());
        } else {
            const res = await api.get('/api/saas/webhooks');
            result = res.data;
        }
        return parseApiResponse(WebhookEndpointListSchema, result, 'Webhooks List');
    },

    create: async (data) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.webhooks.create(data));
        } else {
            const res = await api.post('/api/saas/webhooks', data);
            result = res.data;
        }
        return parseApiResponse(WebhookEndpointSchema, result, 'Webhook Create');
    },

    delete: async (id) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.webhooks.delete(id));
        } else {
            const res = await api.delete(`/api/saas/webhooks/${id}`);
            result = res.data.success;
        }
        return result;
    },

    getLogs: async () => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.webhooks.getLogs());
        } else {
            const res = await api.get('/api/saas/webhooks/logs');
            result = res.data;
        }
        return parseApiResponse(WebhookDeliveryLogListSchema, result, 'Webhook Logs List');
    },

    addLog: async (data) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.webhooks.addLog(data));
        } else {
            const res = await api.post('/api/saas/webhooks/logs', data);
            result = res.data;
        }
        return result;
    }
};

export default WebhookRepository;
