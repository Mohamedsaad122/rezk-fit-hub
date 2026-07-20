import AppConfig from '@/config/app.config';
import api from '@/api/axios';
import { mockDatabase } from '@/mocks/mockDatabase';
import { simulateApi } from '@/utils/mockApi.helper';
import { parseApiResponse } from '@/utils/parseApiResponse';
import { CouponResponseSchema, CouponListResponseSchema } from '@/contracts/coupon.contract';

export const CouponRepository = {
    getAll: async () => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.coupons.getAll());
        } else {
            const res = await api.get('/api/saas/coupons');
            result = res.data;
        }
        return parseApiResponse(CouponListResponseSchema, result, 'Coupon List');
    },

    getByCode: async (code) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.coupons.getByCode(code));
        } else {
            const res = await api.get(`/api/saas/coupons/code/${code}`);
            result = res.data;
        }
        return result ? parseApiResponse(CouponResponseSchema, result, 'Coupon GetByCode') : null;
    },

    create: async (data) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.coupons.create(data));
        } else {
            const res = await api.post('/api/saas/coupons', data);
            result = res.data;
        }
        return parseApiResponse(CouponResponseSchema, result, 'Coupon Create');
    },

    update: async (id, data) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.coupons.update(id, data));
        } else {
            const res = await api.put(`/api/saas/coupons/${id}`, data);
            result = res.data;
        }
        return parseApiResponse(CouponResponseSchema, result, 'Coupon Update');
    }
};

export default CouponRepository;
