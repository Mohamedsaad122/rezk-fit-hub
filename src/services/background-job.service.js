import { BackgroundSync } from '@/infrastructure/background-sync';
import { useBackgroundJobsStore } from '@/store/background-jobs.store';

export const BackgroundJobService = {
    scheduleSyncJob: async (name, intervalMs) => {
        return BackgroundSync.registerJob(name, intervalMs);
    },

    cancelSyncJob: async (id) => {
        return BackgroundSync.cancelJob(id);
    },

    getActiveJobs: () => {
        return useBackgroundJobsStore.getState().jobs;
    },

    runSyncJobImmediately: async (id) => {
        await BackgroundSync.runJob(id);
        return true;
    }
};

export default BackgroundJobService;
