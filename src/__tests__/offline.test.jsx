import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useOfflineStore } from '../store/offline.store';
import { ConnectivityManager } from '../infrastructure/connectivity-manager';
import { OfflineManager } from '../infrastructure/offline-manager';
import { SocketService } from '../realtime/socket.service';

vi.mock('../realtime/socket.service', () => ({
    SocketService: {
        connect: vi.fn(),
        disconnect: vi.fn()
    }
}));

describe('Offline Platform Connection & Sockets Test Suite', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        useOfflineStore.setState({
            isOnline: true,
            status: 'Online',
            offlineSince: null,
            latencyMs: 0
        });
    });

    it('should handle offline and online toggles in the Zustand store', () => {
        const store = useOfflineStore.getState();
        expect(store.isOnline).toBe(true);

        store.setOffline();
        expect(useOfflineStore.getState().isOnline).toBe(false);
        expect(useOfflineStore.getState().status).toBe('Offline');
        expect(useOfflineStore.getState().offlineSince).toBeDefined();

        store.setOnline(45);
        expect(useOfflineStore.getState().isOnline).toBe(true);
        expect(useOfflineStore.getState().status).toBe('Online');
        expect(useOfflineStore.getState().latencyMs).toBe(45);
    });

    it('should simulate offline and online states in ConnectivityManager and notify subscribers', () => {
        let lastStatus = null;
        const unsubscribe = ConnectivityManager.subscribe((isOnline) => {
            lastStatus = isOnline;
        });

        ConnectivityManager.simulateOffline();
        expect(lastStatus).toBe(false);
        expect(useOfflineStore.getState().isOnline).toBe(false);

        ConnectivityManager.simulateOnline();
        expect(lastStatus).toBe(true);
        expect(useOfflineStore.getState().isOnline).toBe(true);

        unsubscribe();
    });

    it('should toggle Sockets connecting/disconnecting during lifecycle initialization', async () => {
        // Initialize offline manager
        await OfflineManager.init();

        // Simulate offline transition
        ConnectivityManager.simulateOffline();
        expect(SocketService.disconnect).toHaveBeenCalled();

        // Simulate online transition
        ConnectivityManager.simulateOnline();
        expect(SocketService.connect).toHaveBeenCalled();

        OfflineManager.destroy();
    });
});
