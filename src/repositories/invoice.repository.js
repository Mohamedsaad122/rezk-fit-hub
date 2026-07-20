import AppConfig from '@/config/app.config';
import api from '@/api/axios';
import { mockDatabase } from '@/mocks/mockDatabase';
import { simulateApi } from '@/utils/mockApi.helper';
import { parseApiResponse } from '@/utils/parseApiResponse';
import { InvoiceResponseSchema, InvoiceListResponseSchema } from '@/contracts/invoice.contract';

export const InvoiceRepository = {
    getAll: async () => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.invoices.getAll());
        } else {
            const res = await api.get('/api/saas/invoices');
            result = res.data;
        }
        return parseApiResponse(InvoiceListResponseSchema, result, 'Invoice List');
    },

    getById: async (id) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.invoices.getById(id));
        } else {
            const res = await api.get(`/api/saas/invoices/${id}`);
            result = res.data;
        }
        return parseApiResponse(InvoiceResponseSchema, result, 'Invoice GetById');
    },

    create: async (data) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.invoices.create(data));
        } else {
            const res = await api.post('/api/saas/invoices', data);
            result = res.data;
        }
        return parseApiResponse(InvoiceResponseSchema, result, 'Invoice Create');
    },

    update: async (id, data) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.invoices.update(id, data));
        } else {
            const res = await api.put(`/api/saas/invoices/${id}`, data);
            result = res.data;
        }
        return parseApiResponse(InvoiceResponseSchema, result, 'Invoice Update');
    },

    refund: async (invoiceId, amount, reason) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.refunds.create({ invoiceId, amount, reason }));
        } else {
            const res = await api.post(`/api/saas/invoices/${invoiceId}/refund`, { amount, reason });
            result = res.data;
        }
        return result;
    }
};

export default InvoiceRepository;
