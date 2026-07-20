import { create } from 'zustand';

export const useExecutionStore = create((set) => ({
    activeRuns: [],
    approvals: [],
    
    setActiveRuns: (activeRuns) => set({ activeRuns }),
    setApprovals: (approvals) => set({ approvals }),
    
    updateRunStatus: (runId, status) => set((state) => ({
        activeRuns: state.activeRuns.map((r) => r.id === runId ? { ...r, status } : r)
    })),
    updateApprovalStatus: (approvalId, status) => set((state) => ({
        approvals: state.approvals.map((a) => a.id === approvalId ? { ...a, status } : a)
    }))
}));

export default useExecutionStore;
