import AppConfig from '@/config/app.config';
import api from '@/api/axios';
import { mockDatabase } from '@/mocks/mockDatabase';
import { simulateApi } from '@/utils/mockApi.helper';
import { parseApiResponse } from '@/utils/parseApiResponse';
import { MemberResponseSchema, MemberListResponseSchema } from '@/contracts/member.contract';

export const MemberRepository = {
    getAll: async () => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.members.getAll());
        } else {
            const res = await api.get('/api/saas/members');
            result = res.data;
        }
        return parseApiResponse(MemberListResponseSchema, result, 'Member List');
    },

    getById: async (id) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.members.getById(id));
        } else {
            const res = await api.get(`/api/saas/members/${id}`);
            result = res.data;
        }
        return parseApiResponse(MemberResponseSchema, result, 'Member GetById');
    },

    create: async (data) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.members.create(data));
        } else {
            const res = await api.post('/api/saas/members', data);
            result = res.data;
        }
        return parseApiResponse(MemberResponseSchema, result, 'Member Create');
    },

    update: async (id, data) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.members.update(id, data));
        } else {
            const res = await api.put(`/api/saas/members/${id}`, data);
            result = res.data;
        }
        return parseApiResponse(MemberResponseSchema, result, 'Member Update');
    },

    delete: async (id) => {
        if (AppConfig.enableMock) {
            return await simulateApi(() => mockDatabase.saas.members.delete(id));
        } else {
            await api.delete(`/api/saas/members/${id}`);
            return true;
        }
    }
};

export default MemberRepository;
