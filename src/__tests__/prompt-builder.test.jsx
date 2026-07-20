import { describe, it, expect } from 'vitest';
import { PromptBuilderService } from '../services/prompt-builder.service';

describe('Sprint 5.3 Prompt Builder & Compilation', () => {
    it('should replace placeholder variables in command templates', () => {
        const template = 'أهلاً يا {name}، هدفك الرياضي هو {goal}.';
        const compiled = PromptBuilderService.compile(template, { name: 'سارة', goal: 'اللياقة البدنية' });
        expect(compiled).toBe('أهلاً يا سارة، هدفك الرياضي هو اللياقة البدنية.');
    });

    it('should build contextual system instructions based on assistant types', () => {
        const coachInstructions = PromptBuilderService.buildSystemPrompt('Coach');
        expect(coachInstructions).toContain('مساعد تدريب رياضي');

        const nutritionInstructions = PromptBuilderService.buildSystemPrompt('Nutrition');
        expect(nutritionInstructions).toContain('أخصائي تغذية رياضية');
    });
});
