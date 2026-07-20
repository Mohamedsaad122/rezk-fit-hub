import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useMetricsStore = create(
    devtools(
        (set) => ({
            metrics: [],
            setMetrics: (metrics) => set({ metrics }, false, 'metrics/setMetrics'),
            addMetric: (metric) => set((state) => ({ metrics: [...state.metrics, metric] }), false, 'metrics/addMetric')
        }),
        { name: 'MetricsStore' }
    )
);

export default useMetricsStore;
