import { create } from 'zustand';

export const usePresenceStore = create((set) => ({
    // Presence details
    onlineUsers: {}, // { [userId]: { status, lastSeen } }
    typingUsers: {}, // { [conversationId]: [{ userId, clientName, timestamp }] }
    unreadCounters: {}, // { [conversationId]: count }
    activeConversations: [],
    selectedConversationId: null,

    // Actions
    setOnlineUsers: (users) => set({ onlineUsers: users }),
    
    updateUserPresence: (userId, presence) => set((state) => {
        const id = Number(userId);
        return {
            onlineUsers: {
                ...state.onlineUsers,
                [id]: {
                    ...state.onlineUsers[id],
                    ...presence,
                    lastSeen: presence.status === 'offline' ? new Date().toISOString() : (presence.lastSeen || state.onlineUsers[id]?.lastSeen)
                }
            }
        };
    }),

    setTypingUsers: (conversationId, users) => set((state) => ({
        typingUsers: {
            ...state.typingUsers,
            [Number(conversationId)]: users
        }
    })),

    addUserTyping: (conversationId, user) => set((state) => {
        const convId = Number(conversationId);
        const currentList = state.typingUsers[convId] || [];
        // Prevent duplicate entries
        if (currentList.some((u) => Number(u.userId) === Number(user.userId))) {
            return {};
        }
        return {
            typingUsers: {
                ...state.typingUsers,
                [convId]: [...currentList, { ...user, timestamp: Date.now() }]
            }
        };
    }),

    removeUserTyping: (conversationId, userId) => set((state) => {
        const convId = Number(conversationId);
        const currentList = state.typingUsers[convId] || [];
        return {
            typingUsers: {
                ...state.typingUsers,
                [convId]: currentList.filter((u) => Number(u.userId) !== Number(userId))
            }
        };
    }),

    clearTypingForConversation: (conversationId) => set((state) => ({
        typingUsers: {
            ...state.typingUsers,
            [Number(conversationId)]: []
        }
    })),

    setUnreadCounters: (counters) => set({ unreadCounters: counters }),
    
    setUnreadCount: (conversationId, count) => set((state) => ({
        unreadCounters: {
            ...state.unreadCounters,
            [Number(conversationId)]: Math.max(0, count)
        }
    })),

    incrementUnreadCount: (conversationId) => set((state) => {
        const convId = Number(conversationId);
        const currentCount = state.unreadCounters[convId] || 0;
        return {
            unreadCounters: {
                ...state.unreadCounters,
                [convId]: currentCount + 1
            }
        };
    }),

    setActiveConversations: (conversations) => set({ activeConversations: conversations }),
    setSelectedConversationId: (id) => set({ selectedConversationId: id ? Number(id) : null }),

    resetPresenceStore: () => set({
        onlineUsers: {},
        typingUsers: {},
        unreadCounters: {},
        activeConversations: [],
        selectedConversationId: null
    })
}));

export default usePresenceStore;
