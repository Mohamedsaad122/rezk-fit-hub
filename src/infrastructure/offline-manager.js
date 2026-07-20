import { ConnectivityManager } from './connectivity-manager';
import { ServiceWorkerManager } from './service-worker-manager';
import { SyncEngine } from './sync-engine';
import { CacheManager } from './cache-manager';
import { SocketService } from '@/realtime/socket.service';

export const OfflineManager = {
    unsubscribeConnectivity: null,

    init: async () => {
        // Initialize network listeners
        ConnectivityManager.init();

        // Register Service Worker
        await ServiceWorkerManager.registerServiceWorker();

        // Hydrate cache and clear old elements
        await CacheManager.clearExpired();
        await CacheManager.recalculateTotalSize();

        // Listen for connectivity changes
        OfflineManager.unsubscribeConnectivity = ConnectivityManager.subscribe(async (isOnline) => {
            if (isOnline) {
                // Sockets resume
                SocketService.connect();
                // Trigger queue processing
                await SyncEngine.processQueue();
            } else {
                // Sockets pause
                SocketService.disconnect();
            }
        });
    },

    destroy: () => {
        if (OfflineManager.unsubscribeConnectivity) {
            OfflineManager.unsubscribeConnectivity();
            OfflineManager.unsubscribeConnectivity = null;
        }
        ConnectivityManager.destroy();
    }
};

export default OfflineManager;
