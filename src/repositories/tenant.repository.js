import AppConfig from '@/config/app.config';
import api from '@/api/axios';
import { mockDatabase } from '@/mocks/mockDatabase';
import { simulateApi } from '@/utils/mockApi.helper';
import { parseApiResponse } from '@/utils/parseApiResponse';
import { TenantResponseSchema, TenantListResponseSchema } from '@/contracts/tenant.contract';
import { TenantSettingsResponseSchema } from '@/contracts/tenant-settings.contract';

export const TenantRepository = {
    getAll: async () => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.tenants.getAll());
        } else {
            const res = await api.get('/api/saas/tenants');
            result = res.data;
        }
        return parseApiResponse(TenantListResponseSchema, result, 'Tenant List');
    },

    getById: async (id) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.tenants.getById(id));
        } else {
            const res = await api.get(`/api/saas/tenants/${id}`);
            result = res.data;
        }
        return parseApiResponse(TenantResponseSchema, result, 'Tenant GetById');
    },

    create: async (data) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.tenants.create(data));
        } else {
            const res = await api.post('/api/saas/tenants', data);
            result = res.data;
        }
        return parseApiResponse(TenantResponseSchema, result, 'Tenant Create');
    },

    update: async (id, data) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.tenants.update(id, data));
        } else {
            const res = await api.put(`/api/saas/tenants/${id}`, data);
            result = res.data;
        }
        return parseApiResponse(TenantResponseSchema, result, 'Tenant Update');
    },

    delete: async (id) => {
        if (AppConfig.enableMock) {
            return await simulateApi(() => mockDatabase.saas.tenants.delete(id));
        } else {
            await api.delete(`/api/saas/tenants/${id}`);
            return true;
        }
    },

    getSettings: async (tenantId) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.tenants.getSettings(tenantId));
        } else {
            const res = await api.get(`/api/saas/tenants/${tenantId}/settings`);
            result = res.data;
        }
        return parseApiResponse(TenantSettingsResponseSchema, result, 'Tenant Settings');
    },

    updateSettings: async (tenantId, data) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.tenants.updateSettings(tenantId, data));
        } else {
            const res = await api.put(`/api/saas/tenants/${tenantId}/settings`, data);
            result = res.data;
        }
        return parseApiResponse(TenantSettingsResponseSchema, result, 'Tenant Settings Update');
    },

    setActiveTenant: (id) => {
        if (AppConfig.enableMock) {
            mockDatabase.saas.tenantContext.setActiveTenantId(id);
        }
    }
};

export default TenantRepository;
