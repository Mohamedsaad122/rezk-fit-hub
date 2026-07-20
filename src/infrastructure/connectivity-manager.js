import { useOfflineStore } from '@/store/offline.store';

export const ConnectivityManager = {
    listeners: new Set(),

    init: () => {
        if (typeof window === 'undefined') return;

        window.addEventListener('online', ConnectivityManager.handleOnline);
        window.addEventListener('offline', ConnectivityManager.handleOffline);

        // Set initial state
        if (navigator.onLine) {
            ConnectivityManager.handleOnline();
        } else {
            ConnectivityManager.handleOffline();
        }
    },

    destroy: () => {
        if (typeof window === 'undefined') return;

        window.removeEventListener('online', ConnectivityManager.handleOnline);
        window.removeEventListener('offline', ConnectivityManager.handleOffline);
    },

    handleOnline: () => {
        // Measure simulated latency
        const latency = Math.floor(Math.random() * 80) + 20;
        useOfflineStore.getState().setOnline(latency);
        ConnectivityManager.notify(true);
    },

    handleOffline: () => {
        useOfflineStore.getState().setOffline();
        ConnectivityManager.notify(false);
    },

    // Programmatic toggle support for testing and manual offline center controls
    simulateOffline: () => {
        useOfflineStore.getState().setOffline();
        ConnectivityManager.notify(false);
    },

    simulateOnline: () => {
        const latency = Math.floor(Math.random() * 40) + 10;
        useOfflineStore.getState().setOnline(latency);
        ConnectivityManager.notify(true);
    },

    subscribe: (callback) => {
        ConnectivityManager.listeners.add(callback);
        return () => {
            ConnectivityManager.listeners.delete(callback);
        };
    },

    notify: (isOnline) => {
        ConnectivityManager.listeners.forEach(cb => {
            try {
                cb(isOnline);
            } catch (err) {
                console.error('Error in connectivity listener:', err);
            }
        });
    }
};

export default ConnectivityManager;
