import { create } from 'zustand';

export const useAutomationStore = create((set) => ({
    rules: [],
    logs: [],
    
    setRules: (rules) => set({ rules }),
    setLogs: (logs) => set({ logs }),
    addRule: (rule) => set((state) => ({ rules: [...state.rules, rule] })),
    addLog: (log) => set((state) => ({ logs: [log, ...state.logs] }))
}));

export default useAutomationStore;
