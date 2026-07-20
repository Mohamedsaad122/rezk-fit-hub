import { create } from 'zustand';

export const useReportStore = create((set) => ({
    reports: [],
    templates: [],
    schedules: [],
    exports: [],
    healthState: null,
    liveMetrics: null,
    builderConfig: {
        module: 'Clients',
        filters: {},
        sorting: { field: 'id', order: 'desc' },
        grouping: null
    },
    activeReport: null,
    isLoading: false,

    setReports: (reports) => set({ reports }),
    setTemplates: (templates) => set({ templates }),
    setSchedules: (schedules) => set({ schedules }),
    setExports: (exports) => set({ exports }),
    setHealthState: (healthState) => set({ healthState }),
    setLiveMetrics: (liveMetrics) => set({ liveMetrics }),
    
    setBuilderConfig: (config) => set((state) => ({
        builderConfig: { ...state.builderConfig, ...config }
    })),
    
    setActiveReport: (activeReport) => set({ activeReport }),
    setIsLoading: (isLoading) => set({ isLoading }),

    resetReportStore: () => set({
        reports: [],
        templates: [],
        schedules: [],
        exports: [],
        healthState: null,
        liveMetrics: null,
        builderConfig: {
            module: 'Clients',
            filters: {},
            sorting: { field: 'id', order: 'desc' },
            grouping: null
        },
        activeReport: null,
        isLoading: false
    })
}));

export default useReportStore;
