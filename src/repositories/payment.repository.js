import AppConfig from '@/config/app.config';
import api from '@/api/axios';
import { mockDatabase } from '@/mocks/mockDatabase';
import { simulateApi } from '@/utils/mockApi.helper';
import { parseApiResponse } from '@/utils/parseApiResponse';
import { PaymentResponseSchema, PaymentListResponseSchema } from '@/contracts/payment.contract';
import { TransactionListResponseSchema } from '@/contracts/transaction.contract';

export const PaymentRepository = {
    getAll: async () => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.payments.getAll());
        } else {
            const res = await api.get('/api/saas/payments');
            result = res.data;
        }
        return parseApiResponse(PaymentListResponseSchema, result, 'Payment List');
    },

    create: async (data) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.payments.create(data));
        } else {
            const res = await api.post('/api/saas/payments', data);
            result = res.data;
        }
        return parseApiResponse(PaymentResponseSchema, result, 'Payment Create');
    },

    getTransactions: async () => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.transactions.getAll());
        } else {
            const res = await api.get('/api/saas/transactions');
            result = res.data;
        }
        return parseApiResponse(TransactionListResponseSchema, result, 'Transactions List');
    }
};

export default PaymentRepository;
