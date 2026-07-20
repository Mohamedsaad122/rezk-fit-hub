import { create } from 'zustand';

/**
 * Zustand store to persist calendar navigation coordinates, active views,
 * and collapsed state.
 */
export const useCalendarStore = create((set) => ({
    currentView: 'Month', // 'Month' | 'Week' | 'Day' | 'Agenda'
    selectedDate: '2026-07-13', // Baseline seed date context
    collapsedPanels: false, // Collapse state for side calendars panel

    setView: (view) => set({ currentView: view }),
    setSelectedDate: (date) => set({ selectedDate: date }),
    togglePanels: () => set((state) => ({ collapsedPanels: !state.collapsedPanels })),
    setCollapsedPanels: (collapsed) => set({ collapsedPanels: collapsed }),
}));

export default useCalendarStore;
