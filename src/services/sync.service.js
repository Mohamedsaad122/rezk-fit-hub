import { SyncEngine } from '@/infrastructure/sync-engine';
import { SyncRepository } from '@/repositories/sync.repository';
import { useSyncStore } from '@/store/sync.store';

export const SyncService = {
    enqueueChange: async (url, method, payload, priority = 1) => {
        return SyncEngine.queueMutation(url, method, payload, priority);
    },

    forceSync: async () => {
        return SyncEngine.processQueue();
    },

    getQueue: async () => {
        return SyncRepository.getQueue();
    },

    getSyncStats: () => {
        return useSyncStore.getState().statistics;
    },

    clearSyncQueue: async () => {
        const queue = useSyncStore.getState().queue;
        for (const item of queue) {
            await SyncRepository.removeFromQueue(item.id);
        }
        useSyncStore.getState().clearQueue();
        return true;
    }
};

export default SyncService;
