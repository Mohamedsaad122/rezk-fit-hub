import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useOfflineStore = create(
    devtools(
        (set) => ({
            isOnline: true,
            status: 'Online',
            offlineSince: null,
            lastSyncTime: new Date().toISOString(),
            latencyMs: 0,
            storageUsageBytes: 1024 * 1024 * 5, // Simulated 5MB initially

            setOnline: (latency = 0) => set({
                isOnline: true,
                status: 'Online',
                offlineSince: null,
                latencyMs: latency,
                lastSyncTime: new Date().toISOString()
            }, false, 'offline/setOnline'),

            setOffline: () => set({
                isOnline: false,
                status: 'Offline',
                offlineSince: new Date().toISOString(),
                latencyMs: 9999
            }, false, 'offline/setOffline'),

            setSyncing: () => set({
                status: 'Syncing'
            }, false, 'offline/setSyncing'),

            updateStorageUsage: (bytes) => set({
                storageUsageBytes: bytes
            }, false, 'offline/updateStorageUsage')
        }),
        { name: 'OfflineStore' }
    )
);

export default useOfflineStore;
