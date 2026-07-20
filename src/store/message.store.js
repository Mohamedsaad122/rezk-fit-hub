import { create } from 'zustand';

export const useMessageStore = create((set) => ({
    activeConversationId: null,
    searchQuery: '',
    filterStatus: 'All', // 'All', 'Pinned', 'Archived'

    setActiveConversationId: (id) => set({ activeConversationId: id ? Number(id) : null }),
    setSearchQuery: (query) => set({ searchQuery: query || '' }),
    setFilterStatus: (status) => set({ filterStatus: status || 'All' }),

    resetStore: () => set({
        activeConversationId: null,
        searchQuery: '',
        filterStatus: 'All'
    })
}));

export default useMessageStore;
