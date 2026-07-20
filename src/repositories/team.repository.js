import AppConfig from '@/config/app.config';
import api from '@/api/axios';
import { mockDatabase } from '@/mocks/mockDatabase';
import { simulateApi } from '@/utils/mockApi.helper';
import { parseApiResponse } from '@/utils/parseApiResponse';
import { TeamResponseSchema, TeamListResponseSchema } from '@/contracts/team.contract';

export const TeamRepository = {
    getAll: async () => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.teams.getAll());
        } else {
            const res = await api.get('/api/saas/teams');
            result = res.data;
        }
        return parseApiResponse(TeamListResponseSchema, result, 'Team List');
    },

    getById: async (id) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.teams.getById(id));
        } else {
            const res = await api.get(`/api/saas/teams/${id}`);
            result = res.data;
        }
        return parseApiResponse(TeamResponseSchema, result, 'Team GetById');
    },

    create: async (data) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.teams.create(data));
        } else {
            const res = await api.post('/api/saas/teams', data);
            result = res.data;
        }
        return parseApiResponse(TeamResponseSchema, result, 'Team Create');
    },

    update: async (id, data) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.teams.update(id, data));
        } else {
            const res = await api.put(`/api/saas/teams/${id}`, data);
            result = res.data;
        }
        return parseApiResponse(TeamResponseSchema, result, 'Team Update');
    },

    delete: async (id) => {
        if (AppConfig.enableMock) {
            return await simulateApi(() => mockDatabase.saas.teams.delete(id));
        } else {
            await api.delete(`/api/saas/teams/${id}`);
            return true;
        }
    }
};

export default TeamRepository;
