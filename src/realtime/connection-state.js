import { create } from 'zustand';

export const useRealtimeStore = create((set) => ({
    isConnected: false,
    isConnecting: false,
    lastConnectedAt: null,
    lastDisconnectedAt: null,
    latency: 0,
    reconnectAttempts: 0,
    transport: 'websocket',
    serverVersion: '1.0.0',

    setConnected: (status) => set((state) => ({
        isConnected: status,
        isConnecting: false,
        lastConnectedAt: status ? new Date().toISOString() : state.lastConnectedAt,
        lastDisconnectedAt: !status ? new Date().toISOString() : state.lastDisconnectedAt,
        reconnectAttempts: status ? 0 : state.reconnectAttempts
    })),
    setConnecting: (status) => set({ isConnecting: status }),
    incrementAttempts: () => set((state) => ({ reconnectAttempts: state.reconnectAttempts + 1 })),
    setLatency: (ms) => set({ latency: ms }),
    setTransport: (type) => set({ transport: type }),
    setServerVersion: (ver) => set({ serverVersion: ver }),
    resetStore: () => set({
        isConnected: false,
        isConnecting: false,
        lastConnectedAt: null,
        lastDisconnectedAt: null,
        latency: 0,
        reconnectAttempts: 0,
        transport: 'websocket',
        serverVersion: '1.0.0'
    })
}));

export default useRealtimeStore;
