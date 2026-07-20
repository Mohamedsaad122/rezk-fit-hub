import AppConfig from '@/config/app.config';
import api from '@/api/axios';
import { mockDatabase } from '@/mocks/mockDatabase';
import { simulateApi } from '@/utils/mockApi.helper';
import { parseApiResponse } from '@/utils/parseApiResponse';
import { ReleaseListSchema, ReleaseSchema } from '@/contracts/release.contract';

export const ReleaseRepository = {
    getAll: async () => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.devopsReleases.getAll());
        } else {
            const res = await api.get('/api/saas/devops/releases');
            result = res.data;
        }
        return parseApiResponse(ReleaseListSchema, result, 'Releases List');
    },

    create: async (data) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.devopsReleases.create(data));
        } else {
            const res = await api.post('/api/saas/devops/releases', data);
            result = res.data;
        }
        return parseApiResponse(ReleaseSchema, result, 'Release Create');
    },

    rollback: async (id) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.devopsReleases.rollback(id));
        } else {
            const res = await api.post(`/api/saas/devops/releases/${id}/rollback`);
            result = res.data;
        }
        return parseApiResponse(ReleaseSchema, result, 'Release Rollback');
    }
};

export default ReleaseRepository;
