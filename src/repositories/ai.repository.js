import AppConfig from '@/config/app.config';
import api from '@/api/axios';
import { mockDatabase } from '@/mocks/mockDatabase';
import { simulateApi } from '@/utils/mockApi.helper';
import { parseApiResponse } from '@/utils/parseApiResponse';
import { AIPromptTemplateListSchema, AIPromptTemplateSchema } from '@/contracts/ai-prompt.contract';

export const AIRepository = {
    getPrompts: async () => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.ai.prompts.getAll());
        } else {
            const res = await api.get('/api/saas/ai/prompts');
            result = res.data;
        }
        return parseApiResponse(AIPromptTemplateListSchema, result, 'AI Prompts List');
    },

    createPrompt: async (data) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.ai.prompts.create(data));
        } else {
            const res = await api.post('/api/saas/ai/prompts', data);
            result = res.data;
        }
        return parseApiResponse(AIPromptTemplateSchema, result, 'AI Prompt Create');
    }
};

export default AIRepository;
