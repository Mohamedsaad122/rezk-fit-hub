import { create } from 'zustand';

export const useDocumentStore = create((set) => ({
    filters: {
        category: 'All',
        search: '',
        owner: 'All',
        isFavorite: undefined,
        isArchived: false,
        clientId: null,
        sortBy: 'Newest',
    },
    layoutMode: 'grid', // 'grid' | 'list' | 'gallery'
    activeDocumentId: null,
    
    setFilters: (newFilters) => set((state) => ({
        filters: { ...state.filters, ...newFilters }
    })),
    
    setLayoutMode: (mode) => set({ layoutMode: mode }),
    
    setActiveDocumentId: (id) => set({ activeDocumentId: id }),
    
    resetFilters: () => set({
        filters: {
            category: 'All',
            search: '',
            owner: 'All',
            isFavorite: undefined,
            isArchived: false,
            clientId: null,
            sortBy: 'Newest',
        }
    })
}));

export default useDocumentStore;
