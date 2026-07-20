import { CacheManager } from '@/infrastructure/cache-manager';
import { CacheRepository } from '@/repositories/cache.repository';

export const CacheService = {
    setCacheValue: async (key, value, lifespanMs) => {
        const entry = await CacheManager.saveQuery(key, value, lifespanMs);
        await CacheRepository.saveEntry(key, entry);
        return true;
    },

    getCacheValue: async (key) => {
        return CacheManager.getQuery(key);
    },

    invalidateCacheValue: async (key) => {
        await CacheManager.deleteQuery(key);
        await CacheRepository.deleteEntry(key);
        return true;
    },

    getCacheStats: async () => {
        const entries = await CacheRepository.getEntries();
        const totalBytes = entries.reduce((acc, entry) => acc + (entry.sizeBytes || 0), 0);
        return {
            count: entries.length,
            totalBytes,
            healthy: true
        };
    }
};

export default CacheService;
