import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useSyncStore = create(
    devtools(
        (set, get) => ({
            queue: [],
            conflicts: [],
            isSyncing: false,
            progress: 0,
            syncStatus: 'idle',
            statistics: {
                totalSynced: 0,
                totalFailed: 0,
                totalConflicts: 0
            },

            addToQueue: (item) => set((state) => ({
                queue: [...state.queue, item]
            }), false, 'sync/addToQueue'),

            removeFromQueue: (id) => set((state) => ({
                queue: state.queue.filter(x => x.id !== id)
            }), false, 'sync/removeFromQueue'),

            updateQueueItem: (id, updates) => set((state) => ({
                queue: state.queue.map(x => x.id === id ? { ...x, ...updates } : x)
            }), false, 'sync/updateQueueItem'),

            clearQueue: () => set({ queue: [] }, false, 'sync/clearQueue'),

            setSyncing: (syncing) => set({ isSyncing: syncing }, false, 'sync/setSyncing'),

            setProgress: (percent) => set({ progress: percent }, false, 'sync/setProgress'),

            setSyncStatus: (status) => set({ syncStatus: status }, false, 'sync/setSyncStatus'),

            incrementSynced: () => set((state) => ({
                statistics: { ...state.statistics, totalSynced: state.statistics.totalSynced + 1 }
            }), false, 'sync/incrementSynced'),

            incrementFailed: () => set((state) => ({
                statistics: { ...state.statistics, totalFailed: state.statistics.totalFailed + 1 }
            }), false, 'sync/incrementFailed'),

            addConflict: (conflict) => set((state) => ({
                conflicts: [...state.conflicts, conflict],
                statistics: { ...state.statistics, totalConflicts: state.statistics.totalConflicts + 1 }
            }), false, 'sync/addConflict'),

            removeConflict: (id) => set((state) => ({
                conflicts: state.conflicts.filter(x => x.id !== id)
            }), false, 'sync/removeConflict')
        }),
        { name: 'SyncStore' }
    )
);

export default useSyncStore;
