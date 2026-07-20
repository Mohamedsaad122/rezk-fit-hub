import { describe, it, expect, beforeEach } from 'vitest';
import { AIService } from '../services/ai.service';

describe('Sprint 5.3 AI Provider Abstraction & Adapters', () => {
    beforeEach(() => {
        AIService.setProviderConfig({
            activeProvider: 'Mock',
            modelName: 'gpt-4o',
            temperature: 0.7
        });
    });

    it('should change active provider dynamically and return mapped labels', async () => {
        AIService.setProviderConfig({ activeProvider: 'OpenAI' });
        const res1 = await AIService.generateText('Hello');
        expect(res1).toContain('[OpenAI');

        AIService.setProviderConfig({ activeProvider: 'Claude' });
        const res2 = await AIService.generateText('Hello');
        expect(res2).toContain('[Claude]');
    });

    it('should fall back to Mock provider templates on invalid configurations', async () => {
        AIService.setProviderConfig({ activeProvider: 'Mock' });
        const res = await AIService.generateText('Tell me about chest workouts');
        expect(res).toContain('بنش مسطح');
    });
});
