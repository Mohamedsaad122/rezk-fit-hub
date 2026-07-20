import { create } from 'zustand';

/**
 * Zustand store to manage local UI filter states and active pagination markers for tasks.
 */
export const useTaskStore = create((set) => ({
    filters: {
        status: 'All',
        priority: 'All',
        category: 'All',
        search: '',
        sortBy: 'Newest',
        page: 1,
    },
    setFilters: (newFilters) => set((state) => ({
        filters: { ...state.filters, ...newFilters }
    })),
    resetFilters: () => set({
        filters: {
            status: 'All',
            priority: 'All',
            category: 'All',
            search: '',
            sortBy: 'Newest',
            page: 1,
        }
    })
}));

export default useTaskStore;
