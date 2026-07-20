import { create } from 'zustand';

/**
 * Zustand store to manage real-time presence data specifically for the Calendar module,
 * including active viewer lists, concurrent editors, lock flags, and coordinate cursors.
 */
export const useCalendarPresenceStore = create((set) => ({
    viewers: [],
    editors: {}, // { [appointmentId]: { username, lockedAt } }
    cursors: {}, // { [username]: { x, y, color } }
    locks: {},   // { [appointmentId]: { isLocked, lockedBy, timeoutAt } }

    setViewers: (viewers) => set({ viewers }),
    
    setEditors: (editors) => set({ editors }),
    
    updateCursor: (username, data) => set((state) => ({
        cursors: {
            ...state.cursors,
            [username]: { ...state.cursors[username], ...data }
        }
    })),

    removeCursor: (username) => set((state) => {
        const nextCursors = { ...state.cursors };
        delete nextCursors[username];
        return { cursors: nextCursors };
    }),

    setLocks: (locks) => set({ locks }),
    
    updateLock: (appointmentId, lockData) => set((state) => ({
        locks: {
            ...state.locks,
            [appointmentId]: lockData
        }
    })),

    removeLock: (appointmentId) => set((state) => {
        const nextLocks = { ...state.locks };
        delete nextLocks[appointmentId];
        return { locks: nextLocks };
    }),

    clearPresence: () => set({
        viewers: [],
        editors: {},
        cursors: {},
        locks: {}
    })
}));
