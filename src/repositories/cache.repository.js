import AppConfig from '@/config/app.config';
import api from '@/api/axios';
import { mockDatabase } from '@/mocks/mockDatabase';
import { simulateApi } from '@/utils/mockApi.helper';
import { parseApiResponse } from '@/utils/parseApiResponse';
import { CacheEntrySchema, CacheEntryListSchema } from '@/contracts/cache-entry.contract';

export const CacheRepository = {
    getEntries: async () => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.cache.getAll());
        } else {
            const res = await api.get('/api/saas/cache/entries');
            result = res.data;
        }
        return parseApiResponse(CacheEntryListSchema, result, 'Cache Entries List');
    },

    saveEntry: async (key, data) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.cache.set(key, data));
        } else {
            const res = await api.post(`/api/saas/cache/entries/${encodeURIComponent(key)}`, data);
            result = res.data;
        }
        return parseApiResponse(CacheEntrySchema, result, 'Cache Entry Save');
    },

    deleteEntry: async (key) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.cache.delete(key));
        } else {
            const res = await api.delete(`/api/saas/cache/entries/${encodeURIComponent(key)}`);
            result = res.data.success;
        }
        return result;
    }
};

export default CacheRepository;
