import AppConfig from '@/config/app.config';
import api from '@/api/axios';
import { mockDatabase } from '@/mocks/mockDatabase';
import { simulateApi } from '@/utils/mockApi.helper';
import { AutomationService } from './automation.service';

export const BackgroundWorkerService = {
    enqueueJob: async (jobType, payload, options = {}) => {
        const payloadData = {
            jobType,
            payload,
            status: 'Pending',
            attempts: 0,
            maxRetries: options.maxRetries ?? 3,
            timeoutMs: options.timeoutMs ?? 30000
        };

        if (AppConfig.enableMock) {
            const job = await simulateApi(() => mockDatabase.saas.backgroundJobs.create(payloadData));
            AutomationService.publishRealtimeEvent('BACKGROUND_JOB_STARTED', job);
            return job;
        } else {
            const res = await api.post('/api/saas/background-jobs', payloadData);
            return res.data;
        }
    },

    processNextJob: async () => {
        if (AppConfig.enableMock) {
            const next = await simulateApi(() => mockDatabase.saas.backgroundJobs.getPending());
            if (!next) return null;

            try {
                // Simulate processing
                next.attempts++;
                
                // If it fails on purpose for testing retries
                if (next.payload?.failOnFirstAttempt && next.attempts === 1) {
                    throw new Error('Simulated worker timeout failure');
                }

                next.status = 'Completed';
                await simulateApi(() => mockDatabase.saas.backgroundJobs.update(next.id, next));
                AutomationService.publishRealtimeEvent('BACKGROUND_JOB_COMPLETED', next);
                return { id: next.id, status: 'Completed' };
            } catch (err) {
                if (next.attempts >= next.maxRetries) {
                    next.status = 'Failed';
                } else {
                    next.status = 'Pending'; // retry later
                }
                next.error = err.message;
                await simulateApi(() => mockDatabase.saas.backgroundJobs.update(next.id, next));
                return { id: next.id, status: next.status, error: err.message };
            }
        }
        return null;
    }
};

export default BackgroundWorkerService;
