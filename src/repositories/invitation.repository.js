import AppConfig from '@/config/app.config';
import api from '@/api/axios';
import { mockDatabase } from '@/mocks/mockDatabase';
import { simulateApi } from '@/utils/mockApi.helper';
import { parseApiResponse } from '@/utils/parseApiResponse';
import { InvitationResponseSchema, InvitationListResponseSchema } from '@/contracts/invitation.contract';

export const InvitationRepository = {
    getAll: async () => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.invitations.getAll());
        } else {
            const res = await api.get('/api/saas/invitations');
            result = res.data;
        }
        return parseApiResponse(InvitationListResponseSchema, result, 'Invitation List');
    },

    getById: async (id) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.invitations.getById(id));
        } else {
            const res = await api.get(`/api/saas/invitations/${id}`);
            result = res.data;
        }
        return parseApiResponse(InvitationResponseSchema, result, 'Invitation GetById');
    },

    create: async (data) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.invitations.create(data));
        } else {
            const res = await api.post('/api/saas/invitations', data);
            result = res.data;
        }
        return parseApiResponse(InvitationResponseSchema, result, 'Invitation Create');
    },

    update: async (id, data) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.invitations.update(id, data));
        } else {
            const res = await api.put(`/api/saas/invitations/${id}`, data);
            result = res.data;
        }
        return parseApiResponse(InvitationResponseSchema, result, 'Invitation Update');
    },

    delete: async (id) => {
        if (AppConfig.enableMock) {
            return await simulateApi(() => mockDatabase.saas.invitations.delete(id));
        } else {
            await api.delete(`/api/saas/invitations/${id}`);
            return true;
        }
    }
};

export default InvitationRepository;
