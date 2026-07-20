import AppConfig from '@/config/app.config';
import api from '@/api/axios';
import { mockDatabase } from '@/mocks/mockDatabase';
import { simulateApi } from '@/utils/mockApi.helper';
import { parseApiResponse } from '@/utils/parseApiResponse';
import { BillingResponseSchema } from '@/contracts/billing.contract';

export const BillingRepository = {
    get: async () => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.billing.get());
        } else {
            const res = await api.get('/api/saas/billing');
            result = res.data;
        }
        return parseApiResponse(BillingResponseSchema, result, 'Billing Get');
    },

    update: async (data) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.billing.update(data));
        } else {
            const res = await api.put('/api/saas/billing', data);
            result = res.data;
        }
        return parseApiResponse(BillingResponseSchema, result, 'Billing Update');
    }
};

export default BillingRepository;
