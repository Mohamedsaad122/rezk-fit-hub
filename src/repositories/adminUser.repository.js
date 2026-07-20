import AppConfig from '@/config/app.config';
import { mockDatabase } from '@/mocks/mockDatabase';
import { simulateApi } from '@/utils/mockApi.helper';
import { parseApiResponse } from '@/utils/parseApiResponse';
import { z } from 'zod';
import { AdminUserSchema } from '@/contracts/adminUser.contract';

export const AdminUserRepository = {
    getAll: async (filters = {}) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.adminUsers.getAll(filters));
        } else {
            result = { data: [], meta: { page: 1, limit: 10, total: 0, totalPages: 0 } };
        }
        return {
            data: parseApiResponse(z.array(AdminUserSchema), result.data, 'Admin Users List'),
            meta: result.meta
        };
    },

    getById: async (id) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.adminUsers.getById(id));
        } else {
            result = {};
        }
        return parseApiResponse(AdminUserSchema, result, 'Admin User Details');
    },

    create: async (userData) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.adminUsers.create(userData));
        } else {
            result = {};
        }
        return parseApiResponse(AdminUserSchema, result, 'Created Admin User');
    },

    update: async (id, userData) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.adminUsers.update(id, userData));
        } else {
            result = {};
        }
        return parseApiResponse(AdminUserSchema, result, 'Updated Admin User');
    },

    delete: async (id) => {
        if (AppConfig.enableMock) {
            await simulateApi(() => mockDatabase.adminUsers.delete(id));
            return true;
        }
        return true;
    }
};

export default AdminUserRepository;
