import { StorageService } from './storage.service';

export const AuditSyncService = {
    syncLog: async (logDetails) => {
        const serialized = JSON.stringify(logDetails);
        const fileName = `audit_log_${Date.now()}.json`;
        return StorageService.uploadFile(fileName, serialized);
    }
};

export default AuditSyncService;
