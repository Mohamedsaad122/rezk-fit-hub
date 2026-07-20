import { create } from 'zustand';
import { AIService } from '@/services/ai.service';

export const useAIStore = create((set) => ({
    activeProvider: 'Mock',
    modelName: 'gpt-4o',
    temperature: 0.7,

    setProvider: (provider) => {
        set({ activeProvider: provider });
        AIService.setProviderConfig({ activeProvider: provider });
    },

    setModelConfig: (model, temp) => {
        set({ modelName: model, temperature: temp });
        AIService.setProviderConfig({ modelName: model, temperature: temp });
    }
}));

export default useAIStore;
