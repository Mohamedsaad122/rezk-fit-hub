import { ConflictResolver } from '@/infrastructure/conflict-resolver';
import { useSyncStore } from '@/store/sync.store';
import { indexedDBService } from '@/infrastructure/indexeddb.service';
import { SyncRepository } from '@/repositories/sync.repository';

export const ConflictResolutionService = {
    getConflicts: () => {
        return useSyncStore.getState().conflicts;
    },

    resolveConflict: async (conflictId, strategy, manualValue = null) => {
        const store = useSyncStore.getState();
        const conflict = store.conflicts.find(c => c.id === conflictId);
        if (!conflict) return null;

        // Simulate getting the remote state from a repository/server
        const remoteState = {
            id: conflict.payload?.id || 1,
            tenantId: conflict.tenantId,
            version: (conflict.payload?.version || 1) + 1,
            updatedAt: new Date(Date.now() - 1000).toISOString(),
            ...conflict.payload,
            name: 'سيرفر ريزك فيت هب المستجد'
        };

        let resolvedPayload;
        switch (strategy) {
            case 'LWW':
                resolvedPayload = ConflictResolver.resolveLastWriteWins(conflict.payload, remoteState);
                break;
            case 'FieldLevel':
                resolvedPayload = ConflictResolver.resolveFieldLevelMerge(conflict.payload, remoteState);
                break;
            case 'Version':
                resolvedPayload = ConflictResolver.resolveVersionComparison(conflict.payload, remoteState);
                break;
            case 'Manual':
                resolvedPayload = manualValue || conflict.payload;
                break;
            default:
                resolvedPayload = conflict.payload;
        }

        // Save resolved value back into the queue for re-transmission
        const updatedItem = {
            ...conflict,
            payload: resolvedPayload,
            status: 'Pending',
            retries: 0,
            conflictType: null
        };

        await indexedDBService.put('pending_mutations', updatedItem);
        store.updateQueueItem(conflict.id, updatedItem);
        store.removeConflict(conflict.id);
        
        await SyncRepository.updateQueueItem(conflict.id, updatedItem);

        return updatedItem;
    }
};

export default ConflictResolutionService;
