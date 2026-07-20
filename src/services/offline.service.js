import { OfflineRepository } from '@/repositories/offline.repository';
import { useOfflineStore } from '@/store/offline.store';

export const OfflineService = {
    getDevices: async () => {
        return OfflineRepository.getDevices();
    },

    registerCurrentDevice: async (name, os) => {
        const payload = {
            name,
            os,
            status: 'Active',
            storageUsedBytes: useOfflineStore.getState().storageUsageBytes,
            lastSyncTime: new Date().toISOString()
        };
        return OfflineRepository.registerDevice(payload);
    },

    getOfflineStatus: () => {
        const state = useOfflineStore.getState();
        return {
            isOnline: state.isOnline,
            status: state.status,
            offlineSince: state.offlineSince,
            lastSyncTime: state.lastSyncTime,
            latencyMs: state.latencyMs,
            storageUsageBytes: state.storageUsageBytes
        };
    }
};

export default OfflineService;
