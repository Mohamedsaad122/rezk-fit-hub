import AppConfig from '@/config/app.config';
import api from '@/api/axios';
import { mockDatabase } from '@/mocks/mockDatabase';
import { simulateApi } from '@/utils/mockApi.helper';
import { parseApiResponse } from '@/utils/parseApiResponse';
import { SubscriptionResponseSchema, SubscriptionListResponseSchema } from '@/contracts/subscription.contract';

export const SubscriptionRepository = {
    getAll: async () => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.subscriptions.getAll());
        } else {
            const res = await api.get('/api/saas/subscriptions');
            result = res.data;
        }
        return parseApiResponse(SubscriptionListResponseSchema, result, 'Subscription List');
    },

    get: async (tenantId) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.subscriptions.get(tenantId));
        } else {
            const res = await api.get(`/api/saas/subscriptions/tenant/${tenantId}`);
            result = res.data;
        }
        return parseApiResponse(SubscriptionResponseSchema, result, 'Subscription Get');
    },

    update: async (tenantId, data) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.subscriptions.update(tenantId, data));
        } else {
            const res = await api.put(`/api/saas/subscriptions/tenant/${tenantId}`, data);
            result = res.data;
        }
        return parseApiResponse(SubscriptionResponseSchema, result, 'Subscription Update');
    }
};

export default SubscriptionRepository;
