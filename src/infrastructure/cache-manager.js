import { indexedDBService } from './indexeddb.service';
import { useOfflineStore } from '@/store/offline.store';

export const CacheManager = {
    saveQuery: async (key, value, lifespanMs = 1000 * 60 * 60) => {
        const id = typeof key === 'string' ? key : JSON.stringify(key);
        const expiresAt = new Date(Date.now() + lifespanMs).toISOString();

        const entry = {
            id,
            key: id,
            value,
            expiresAt,
            sizeBytes: JSON.stringify(value).length,
            version: 1
        };

        await indexedDBService.put('queries', entry);
        await CacheManager.recalculateTotalSize();
        return entry;
    },

    getQuery: async (key) => {
        const id = typeof key === 'string' ? key : JSON.stringify(key);
        const entry = await indexedDBService.get('queries', id);
        
        if (!entry) return null;
        
        // Expiry check
        if (new Date(entry.expiresAt).getTime() <= Date.now()) {
            await indexedDBService.delete('queries', id);
            await CacheManager.recalculateTotalSize();
            return null;
        }
        
        return entry.value;
    },

    deleteQuery: async (key) => {
        const id = typeof key === 'string' ? key : JSON.stringify(key);
        await indexedDBService.delete('queries', id);
        await CacheManager.recalculateTotalSize();
        return true;
    },

    clearExpired: async () => {
        const all = await indexedDBService.getAll('queries');
        let deletedSome = false;
        const now = Date.now();
        for (const entry of all) {
            if (new Date(entry.expiresAt).getTime() < now) {
                await indexedDBService.delete('queries', entry.id);
                deletedSome = true;
            }
        }
        if (deletedSome) {
            await CacheManager.recalculateTotalSize();
        }
    },

    recalculateTotalSize: async () => {
        const all = await indexedDBService.getAll('queries');
        const totalBytes = all.reduce((acc, x) => acc + (x.sizeBytes || 0), 0);
        useOfflineStore.getState().updateStorageUsage(totalBytes);
        return totalBytes;
    }
};

export default CacheManager;
