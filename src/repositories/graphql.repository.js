import AppConfig from '@/config/app.config';
import api from '@/api/axios';
import { mockDatabase } from '@/mocks/mockDatabase';
import { simulateApi } from '@/utils/mockApi.helper';

export const GraphqlRepository = {
    executeRaw: async (query, variables) => {
        if (AppConfig.enableMock) {
            // Simulated GraphQL handler
            return simulateApi(() => {
                const clients = mockDatabase.clients.getAll();
                const tasks = mockDatabase.tasks.getAll();
                
                // Extremely simple GraphQL mock resolver
                let data = {};
                if (query.includes('clients')) {
                    data.clients = clients;
                }
                if (query.includes('tasks')) {
                    data.tasks = tasks;
                }
                return { data };
            });
        } else {
            const res = await api.post('/api/saas/graphql', { query, variables });
            return res.data;
        }
    }
};

export default GraphqlRepository;
