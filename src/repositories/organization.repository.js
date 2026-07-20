import AppConfig from '@/config/app.config';
import api from '@/api/axios';
import { mockDatabase } from '@/mocks/mockDatabase';
import { simulateApi } from '@/utils/mockApi.helper';
import { parseApiResponse } from '@/utils/parseApiResponse';
import { OrganizationResponseSchema, OrganizationListResponseSchema } from '@/contracts/organization.contract';

export const OrganizationRepository = {
    getAll: async () => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.organizations.getAll());
        } else {
            const res = await api.get('/api/saas/organizations');
            result = res.data;
        }
        return parseApiResponse(OrganizationListResponseSchema, result, 'Organization List');
    },

    getById: async (id) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.organizations.getById(id));
        } else {
            const res = await api.get(`/api/saas/organizations/${id}`);
            result = res.data;
        }
        return parseApiResponse(OrganizationResponseSchema, result, 'Organization GetById');
    },

    create: async (data) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.organizations.create(data));
        } else {
            const res = await api.post('/api/saas/organizations', data);
            result = res.data;
        }
        return parseApiResponse(OrganizationResponseSchema, result, 'Organization Create');
    },

    update: async (id, data) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.organizations.update(id, data));
        } else {
            const res = await api.put(`/api/saas/organizations/${id}`, data);
            result = res.data;
        }
        return parseApiResponse(OrganizationResponseSchema, result, 'Organization Update');
    },

    delete: async (id) => {
        if (AppConfig.enableMock) {
            return await simulateApi(() => mockDatabase.saas.organizations.delete(id));
        } else {
            await api.delete(`/api/saas/organizations/${id}`);
            return true;
        }
    },

    setActiveOrganization: (id) => {
        if (AppConfig.enableMock) {
            mockDatabase.saas.tenantContext.setActiveOrganizationId(id);
        }
    }
};

export default OrganizationRepository;
