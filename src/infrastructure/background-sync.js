import { useBackgroundJobsStore } from '@/store/background-jobs.store';
import { SyncEngine } from './sync-engine';
import { useOfflineStore } from '@/store/offline.store';

export const BackgroundSync = {
    timers: new Map(),

    registerJob: async (name, intervalMs) => {
        const job = {
            id: `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            tenantId: 1,
            name,
            status: 'Pending',
            lastRun: null,
            nextRun: new Date(Date.now() + intervalMs).toISOString(),
            intervalMs,
            retries: 0
        };

        // Add to Zustand store
        useBackgroundJobsStore.getState().addJob(job);

        // Schedule timer loop
        const timerId = setInterval(() => {
            BackgroundSync.runJob(job.id);
        }, intervalMs);

        BackgroundSync.timers.set(job.id, timerId);
        return job;
    },

    cancelJob: async (id) => {
        const timerId = BackgroundSync.timers.get(id);
        if (timerId) {
            clearInterval(timerId);
            BackgroundSync.timers.delete(id);
        }
        useBackgroundJobsStore.getState().removeJob(id);
        return true;
    },

    runJob: async (id) => {
        const store = useBackgroundJobsStore.getState();
        const job = store.jobs.find(j => j.id === id);
        if (!job) return;

        store.updateJob(id, { status: 'Running' });

        // If offline, postpone job
        if (!useOfflineStore.getState().isOnline) {
            store.updateJob(id, {
                status: 'Failed',
                nextRun: new Date(Date.now() + job.intervalMs).toISOString()
            });
            return;
        }

        try {
            // Trigger sync engine queue processing
            await SyncEngine.processQueue();

            store.updateJob(id, {
                status: 'Success',
                lastRun: new Date().toISOString(),
                nextRun: new Date(Date.now() + job.intervalMs).toISOString(),
                retries: 0
            });
        } catch (err) {
            const retries = (job.retries || 0) + 1;
            store.updateJob(id, {
                status: 'Failed',
                retries,
                nextRun: new Date(Date.now() + job.intervalMs).toISOString()
            });
        }
    },

    clearAllJobs: () => {
        BackgroundSync.timers.forEach((timerId) => {
            clearInterval(timerId);
        });
        BackgroundSync.timers.clear();
        useBackgroundJobsStore.getState().jobs = [];
    }
};

export default BackgroundSync;
