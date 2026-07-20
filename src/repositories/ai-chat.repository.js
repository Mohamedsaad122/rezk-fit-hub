import AppConfig from '@/config/app.config';
import api from '@/api/axios';
import { mockDatabase } from '@/mocks/mockDatabase';
import { simulateApi } from '@/utils/mockApi.helper';
import { parseApiResponse } from '@/utils/parseApiResponse';
import { ChatSessionSchema, ChatSessionListSchema } from '@/contracts/ai-chat.contract';

export const AIChatRepository = {
    getSessions: async () => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.ai.chats.getAll());
        } else {
            const res = await api.get('/api/saas/ai/chats');
            result = res.data;
        }
        return parseApiResponse(ChatSessionListSchema, result, 'AI Chat Sessions List');
    },

    getById: async (id) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.ai.chats.getById(id));
        } else {
            const res = await api.get(`/api/saas/ai/chats/${id}`);
            result = res.data;
        }
        return parseApiResponse(ChatSessionSchema, result, 'AI Chat Session GetById');
    },

    createSession: async (title = 'محادثة جديدة') => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.ai.chats.create({ title }));
        } else {
            const res = await api.post('/api/saas/ai/chats', { title });
            result = res.data;
        }
        return parseApiResponse(ChatSessionSchema, result, 'AI Chat Session Create');
    },

    sendMessage: async (sessionId, message) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.ai.chats.addMessage(sessionId, message));
        } else {
            const res = await api.post(`/api/saas/ai/chats/${sessionId}/messages`, message);
            result = res.data;
        }
        return parseApiResponse(ChatSessionSchema, result, 'AI Chat Send Message');
    }
};

export default AIChatRepository;
