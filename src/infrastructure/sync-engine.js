import { useSyncStore } from '@/store/sync.store';
import { useOfflineStore } from '@/store/offline.store';
import { indexedDBService } from './indexeddb.service';
import { SyncRepository } from '@/repositories/sync.repository';
import { eventBus } from '@/realtime/event-bus';

export const SyncEngine = {
    // Adds a mutation to the queue (either online or offline)
    queueMutation: async (url, method, payload, priority = 1) => {
        const item = {
            id: `mut_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
            tenantId: 1, // Will be bound to active tenant context
            url,
            method,
            payload,
            timestamp: new Date().toISOString(),
            retries: 0,
            status: 'Pending',
            priority
        };

        // Persist to IndexedDB
        await indexedDBService.put('pending_mutations', item);
        
        // Add to Zustand store
        useSyncStore.getState().addToQueue(item);
        
        // Add to mockDatabase in mock mode
        await SyncRepository.addToQueue(item);

        eventBus.publish('Sync Started', item);

        // If online, immediately process
        if (useOfflineStore.getState().isOnline) {
            SyncEngine.processQueue();
        }
        
        return item;
    },

    // Process all mutations in the queue sequentially
    processQueue: async () => {
        const store = useSyncStore.getState();
        if (store.isSyncing) return;

        const queue = await indexedDBService.getAll('pending_mutations');
        if (queue.length === 0) return;

        store.setSyncing(true);
        store.setSyncStatus('syncing');
        useOfflineStore.getState().setSyncing();

        // Sort by priority (descending) and timestamp (ascending)
        const sortedQueue = queue.sort((a, b) => {
            if (b.priority !== a.priority) return b.priority - a.priority;
            return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        });

        const totalItems = sortedQueue.length;
        let processedItems = 0;

        for (const item of sortedQueue) {
            // Check connectivity
            if (!useOfflineStore.getState().isOnline) {
                store.setSyncStatus('paused');
                break;
            }

            store.updateQueueItem(item.id, { status: 'Syncing' });
            processedItems++;
            store.setProgress(Math.round((processedItems / totalItems) * 100));

            try {
                // Simulate REST network calls or execute operations
                const success = await SyncEngine.executeMutation(item);
                
                if (success) {
                    // Remove from queue
                    await indexedDBService.delete('pending_mutations', item.id);
                    store.removeFromQueue(item.id);
                    await SyncRepository.removeFromQueue(item.id);
                    
                    store.incrementSynced();
                    eventBus.publish('Sync Finished', { id: item.id, success: true });
                } else {
                    // Critical failure or conflict
                    throw new Error('Mutation execution failed');
                }
            } catch (err) {
                store.incrementFailed();
                
                // Retries threshold check
                const currentRetries = (item.retries || 0) + 1;
                
                if (err.message && err.message.includes('conflict')) {
                    // Mark conflict
                    const conflictItem = { ...item, status: 'Conflict', conflictType: 'LWW_RESOLVABLE' };
                    await indexedDBService.put('pending_mutations', conflictItem);
                    store.updateQueueItem(item.id, { status: 'Conflict' });
                    store.addConflict(conflictItem);
                    eventBus.publish('Sync Failed', { id: item.id, reason: 'Conflict' });
                } else if (currentRetries >= 3) {
                    // Fail completely after 3 retries
                    await indexedDBService.delete('pending_mutations', item.id);
                    store.removeFromQueue(item.id);
                    await SyncRepository.removeFromQueue(item.id);
                    eventBus.publish('Sync Failed', { id: item.id, reason: 'Max Retries' });
                } else {
                    // Increment retry counter
                    const retryItem = { ...item, retries: currentRetries, status: 'Pending' };
                    await indexedDBService.put('pending_mutations', retryItem);
                    store.updateQueueItem(item.id, { retries: currentRetries, status: 'Pending' });
                }
            }
        }

        store.setSyncing(false);
        store.setProgress(100);
        store.setSyncStatus('idle');
        useOfflineStore.getState().setOnline();
    },

    // Mutation execution simulator
    executeMutation: async (item) => {
        // Return simulated success
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate a conflict if requested in payload/url
                if (item.url.includes('conflict') || (item.payload && item.payload.conflict)) {
                    reject(new Error('conflict: Version mismatch detected on server'));
                } else if (item.url.includes('error') || (item.payload && item.payload.error)) {
                    reject(new Error('Network error on dispatch'));
                } else {
                    resolve(true);
                }
            }, 100);
        });
    }
};

export default SyncEngine;
