import AppConfig from '@/config/app.config';
import api from '@/api/axios';
import { mockDatabase } from '@/mocks/mockDatabase';
import { simulateApi } from '@/utils/mockApi.helper';
import { parseApiResponse } from '@/utils/parseApiResponse';
import { QueuedMutationSchema, QueuedMutationListSchema } from '@/contracts/sync-queue.contract';

export const SyncRepository = {
    getQueue: async () => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.syncQueue.getAll());
        } else {
            const res = await api.get('/api/saas/sync/queue');
            result = res.data;
        }
        return parseApiResponse(QueuedMutationListSchema, result, 'Sync Queue List');
    },

    addToQueue: async (data) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.syncQueue.create(data));
        } else {
            const res = await api.post('/api/saas/sync/queue', data);
            result = res.data;
        }
        return parseApiResponse(QueuedMutationSchema, result, 'Sync Queue Add');
    },

    removeFromQueue: async (id) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.syncQueue.delete(id));
        } else {
            const res = await api.delete(`/api/saas/sync/queue/${id}`);
            result = res.data.success;
        }
        return result;
    },

    updateQueueItem: async (id, data) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.syncQueue.update(id, data));
        } else {
            const res = await api.put(`/api/saas/sync/queue/${id}`, data);
            result = res.data;
        }
        return parseApiResponse(QueuedMutationSchema, result, 'Sync Queue Item Update');
    }
};

export default SyncRepository;
