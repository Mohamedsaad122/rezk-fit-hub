import { create } from 'zustand';

export const useNetworkStore = create((set) => ({
    isOffline: typeof navigator !== 'undefined' ? !navigator.onLine : false,
    activeRequests: 0,
    isMaintenance: false,

    incrementRequests: () => set((state) => ({ activeRequests: state.activeRequests + 1 })),
    decrementRequests: () => set((state) => ({ activeRequests: Math.max(0, state.activeRequests - 1) })),
    setOffline: (status) => set({ isOffline: status }),
    setMaintenance: (status) => set({ isMaintenance: status }),
    resetNetworkState: () => set({ activeRequests: 0, isMaintenance: false })
}));

export default useNetworkStore;
