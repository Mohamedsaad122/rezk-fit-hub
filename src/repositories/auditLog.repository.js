import AppConfig from '@/config/app.config';
import { mockDatabase } from '@/mocks/mockDatabase';
import { simulateApi } from '@/utils/mockApi.helper';
import { parseApiResponse } from '@/utils/parseApiResponse';
import { z } from 'zod';
import { AuditLogSchema } from '@/contracts/auditLog.contract';

export const AuditLogRepository = {
    getAll: async (filters = {}) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.auditLogs.getAll(filters));
        } else {
            result = { data: [], meta: { page: 1, limit: 10, total: 0, totalPages: 0 } };
        }
        return {
            data: parseApiResponse(z.array(AuditLogSchema), result.data, 'Audit Logs List'),
            meta: result.meta
        };
    },

    create: async (logData) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.auditLogs.create(logData));
        } else {
            result = {};
        }
        return parseApiResponse(AuditLogSchema, result, 'Created Audit Log');
    }
};

export default AuditLogRepository;
