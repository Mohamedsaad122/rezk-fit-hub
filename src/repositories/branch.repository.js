import AppConfig from '@/config/app.config';
import { mockDatabase } from '@/mocks/mockDatabase';
import { simulateApi } from '@/utils/mockApi.helper';
import { parseApiResponse } from '@/utils/parseApiResponse';
import { z } from 'zod';
import { BranchSchema } from '@/contracts/branch.contract';

export const BranchRepository = {
    getAll: async (filters = {}) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.branches.getAll(filters));
        } else {
            result = { data: [], meta: { page: 1, limit: 10, total: 0, totalPages: 0 } };
        }
        return {
            data: parseApiResponse(z.array(BranchSchema), result.data, 'Branches List'),
            meta: result.meta
        };
    },

    getById: async (id) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.branches.getById(id));
        } else {
            result = {};
        }
        return parseApiResponse(BranchSchema, result, 'Branch Details');
    },

    create: async (branchData) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.branches.create(branchData));
        } else {
            result = {};
        }
        return parseApiResponse(BranchSchema, result, 'Created Branch');
    },

    update: async (id, branchData) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.branches.update(id, branchData));
        } else {
            result = {};
        }
        return parseApiResponse(BranchSchema, result, 'Updated Branch');
    },

    delete: async (id) => {
        if (AppConfig.enableMock) {
            await simulateApi(() => mockDatabase.branches.delete(id));
            return true;
        }
        return true;
    }
};

export default BranchRepository;
