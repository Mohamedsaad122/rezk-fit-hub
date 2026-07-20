import { mockDatabase } from '@/mocks/mockDatabase';

export const ProfilingService = {
    getProfilingLogs: async () => {
        return mockDatabase.saas.devopsProfiling.getAll();
    },

    takeSnapshot: async (cpuUsage, memoryUsedMB, memoryTotalMB) => {
        const payload = {
            cpuUsage,
            memoryUsedMB,
            memoryTotalMB,
            timestamp: new Date().toISOString()
        };
        return mockDatabase.saas.devopsProfiling.create(payload);
    }
};

export default ProfilingService;
