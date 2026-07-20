import { describe, it, expect, beforeEach, vi } from 'vitest';
import AppConfig from '../config/app.config';
import { mockDatabase } from '../mocks/mockDatabase';
import { SyncEngine } from '../infrastructure/sync-engine';
import { useSyncStore } from '../store/sync.store';
import { useOfflineStore } from '../store/offline.store';
import { indexedDBService } from '../infrastructure/indexeddb.service';
import { SyncRepository } from '../repositories/sync.repository';

describe('Sync Engine Queue Processing & Retry Test Suite', () => {
    beforeEach(async () => {
        AppConfig.enableMock = true;
        mockDatabase.reset();
        useSyncStore.getState().clearQueue();
        useSyncStore.setState({
            conflicts: [],
            statistics: { totalSynced: 0, totalFailed: 0, totalConflicts: 0 }
        });
        await indexedDBService.clear('pending_mutations');
        useOfflineStore.setState({ isOnline: true });

        // Override the simulation delay to be immediate for tests
        SyncEngine.executeMutation = async (item) => {
            if (item.url.includes('conflict') || (item.payload && item.payload.conflict)) {
                throw new Error('conflict: Version mismatch detected on server');
            } else if (item.url.includes('error') || (item.payload && item.payload.error)) {
                throw new Error('Network error on dispatch');
            } else {
                return true;
            }
        };
    });

    it('should successfully queue and process a mutation when online', async () => {
        useOfflineStore.setState({ isOnline: false });
        const item = await SyncEngine.queueMutation('/api/posts', 'POST', { title: 'New Post' });
        
        expect(item.id).toBeDefined();
        expect(item.status).toBe('Pending');

        // Since we are online, processQueue is triggered immediately
        useOfflineStore.setState({ isOnline: true });
        await SyncEngine.processQueue();

        const remainingQueue = await indexedDBService.getAll('pending_mutations');
        expect(remainingQueue.length).toBe(0);
        expect(useSyncStore.getState().statistics.totalSynced).toBe(1);
    });

    it('should keep mutations in queue when offline and sync when restored', async () => {
        useOfflineStore.setState({ isOnline: false });

        const item = await SyncEngine.queueMutation('/api/posts', 'POST', { title: 'Offline Post' });
        
        // Should remain pending and not execute
        const queueOffline = await indexedDBService.getAll('pending_mutations');
        expect(queueOffline.length).toBe(1);
        expect(queueOffline[0].status).toBe('Pending');

        // Restore online and run sync
        useOfflineStore.setState({ isOnline: true });
        await SyncEngine.processQueue();

        const queueOnline = await indexedDBService.getAll('pending_mutations');
        expect(queueOnline.length).toBe(0);
        expect(useSyncStore.getState().statistics.totalSynced).toBe(1);
    });

    it('should increment retries on minor failure and discard after 3 retries', async () => {
        useOfflineStore.setState({ isOnline: false });
        // Enqueue item with custom payload that triggers simulated failure in executeMutation
        const item = await SyncEngine.queueMutation('/api/posts/error', 'POST', { error: true });

        useOfflineStore.setState({ isOnline: true });

        // First process: increments retries
        await SyncEngine.processQueue();
        let queue = await indexedDBService.getAll('pending_mutations');
        expect(queue.length).toBe(1);
        expect(queue[0].retries).toBe(1);

        // Second process: increments retries
        await SyncEngine.processQueue();
        queue = await indexedDBService.getAll('pending_mutations');
        expect(queue[0].retries).toBe(2);

        // Third process: reaches limit, discarded
        await SyncEngine.processQueue();
        queue = await indexedDBService.getAll('pending_mutations');
        expect(queue.length).toBe(0);
        expect(useSyncStore.getState().statistics.totalFailed).toBe(3);
    });

    it('should detect a version conflict, toggle status, and insert to conflict store', async () => {
        useOfflineStore.setState({ isOnline: false });
        // Enqueue item with payload that triggers mock conflict
        const item = await SyncEngine.queueMutation('/api/posts/conflict', 'PUT', { conflict: true });

        useOfflineStore.setState({ isOnline: true });
        await SyncEngine.processQueue();

        const queue = await indexedDBService.getAll('pending_mutations');
        expect(queue.length).toBe(1);
        expect(queue[0].status).toBe('Conflict');
        
        const conflicts = useSyncStore.getState().conflicts;
        expect(conflicts.length).toBe(1);
        expect(conflicts[0].id).toBe(item.id);
    });
});
