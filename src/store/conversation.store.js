import { create } from 'zustand';

export const useConversationStore = create((set) => ({
    activeSessionId: null,
    sessions: [],
    streamingMessage: '',

    setActiveSessionId: (id) => set({ activeSessionId: id }),
    setSessions: (sessions) => set({ sessions }),
    setStreamingMessage: (msg) => set({ streamingMessage: msg }),
    appendChunk: (chunk) => set((state) => ({ streamingMessage: state.streamingMessage + chunk }))
}));

export default useConversationStore;
