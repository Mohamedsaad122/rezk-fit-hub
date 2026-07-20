import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { BackgroundSync } from '../infrastructure/background-sync';
import { useBackgroundJobsStore } from '../store/background-jobs.store';
import { useOfflineStore } from '../store/offline.store';
import { SyncEngine } from '../infrastructure/sync-engine';

vi.mock('../infrastructure/sync-engine', () => ({
    SyncEngine: {
        processQueue: vi.fn(() => Promise.resolve())
    }
}));

describe('Background Synchronization & Jobs Scheduler Test Suite', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        BackgroundSync.clearAllJobs();
        useOfflineStore.setState({ isOnline: true });
    });

    afterEach(() => {
        BackgroundSync.clearAllJobs();
    });

    it('should register a background job and add to Zustand store', async () => {
        const job = await BackgroundSync.registerJob('Periodic Data Sync', 1000 * 60);
        
        expect(job.id).toBeDefined();
        expect(job.name).toBe('Periodic Data Sync');
        expect(job.intervalMs).toBe(60000);
        expect(job.status).toBe('Pending');

        const activeJobs = useBackgroundJobsStore.getState().jobs;
        expect(activeJobs.length).toBe(1);
        expect(activeJobs[0].id).toBe(job.id);
    });

    it('should cancel a scheduled job and remove it', async () => {
        const job = await BackgroundSync.registerJob('Temp Job', 10000);
        expect(BackgroundSync.timers.has(job.id)).toBe(true);

        const result = await BackgroundSync.cancelJob(job.id);
        expect(result).toBe(true);
        expect(BackgroundSync.timers.has(job.id)).toBe(false);

        const activeJobs = useBackgroundJobsStore.getState().jobs;
        expect(activeJobs.length).toBe(0);
    });

    it('should successfully run active job and invoke processQueue if online', async () => {
        const job = await BackgroundSync.registerJob('Succeed Job', 5000);
        
        await BackgroundSync.runJob(job.id);

        const updatedJobs = useBackgroundJobsStore.getState().jobs;
        expect(updatedJobs[0].status).toBe('Success');
        expect(updatedJobs[0].lastRun).toBeDefined();
        expect(SyncEngine.processQueue).toHaveBeenCalled();
    });

    it('should fail and postpone the job execution if offline', async () => {
        useOfflineStore.setState({ isOnline: false });
        const job = await BackgroundSync.registerJob('Postpone Job', 5000);

        await BackgroundSync.runJob(job.id);

        const updatedJobs = useBackgroundJobsStore.getState().jobs;
        expect(updatedJobs[0].status).toBe('Failed');
        expect(SyncEngine.processQueue).not.toHaveBeenCalled();
    });
});
