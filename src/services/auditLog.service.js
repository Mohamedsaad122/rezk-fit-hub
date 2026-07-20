import { AuditLogRepository } from '@/repositories/auditLog.repository';

export const AuditLogService = {
    getAllLogs: (filters = {}) => {
        return AuditLogRepository.getAll(filters);
    },
    createLog: (logData) => {
        return AuditLogRepository.create(logData);
    }
};

export default AuditLogService;
