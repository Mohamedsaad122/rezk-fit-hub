import { describe, it, expect, beforeEach } from 'vitest';
import { CacheManager } from '../infrastructure/cache-manager';
import { indexedDBService } from '../infrastructure/indexeddb.service';
import { useOfflineStore } from '../store/offline.store';

describe('Query Caching & Offline Hydration Test Suite', () => {
    beforeEach(async () => {
        await indexedDBService.clear('queries');
        useOfflineStore.setState({ storageUsageBytes: 0 });
    });

    it('should save a query to cache and retrieve it successfully', async () => {
        const queryKey = ['saas', 'members', 1];
        const data = { name: 'محمد علي', status: 'نشط' };

        await CacheManager.saveQuery(queryKey, data);

        const cached = await CacheManager.getQuery(queryKey);
        expect(cached).toBeDefined();
        expect(cached.name).toBe('محمد علي');
    });

    it('should discard expired queries and return null', async () => {
        const queryKey = 'expired_query';
        const data = { age: 30 };

        // Save with negative lifespan (expires in the past)
        await CacheManager.saveQuery(queryKey, data, -1000);

        const cached = await CacheManager.getQuery(queryKey);
        expect(cached).toBeNull();

        const all = await indexedDBService.getAll('queries');
        expect(all.length).toBe(0);
    });

    it('should recalculate total cache size and update offline store', async () => {
        const data1 = { text: 'short' }; // length ~ 16
        const data2 = { text: 'a longer query data payload string' }; // length ~ 48

        await CacheManager.saveQuery('q1', data1);
        await CacheManager.saveQuery('q2', data2);

        const size = await CacheManager.recalculateTotalSize();
        expect(size).toBeGreaterThan(60);

        const storeSize = useOfflineStore.getState().storageUsageBytes;
        expect(storeSize).toBe(size);
    });
});
