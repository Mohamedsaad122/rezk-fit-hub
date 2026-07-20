import { describe, it, expect } from 'vitest';
import { RuleEngineService } from '../services/rule-engine.service';

describe('Rule & Formula Compiler Engine Test Suite', () => {
    it('should evaluate context variables against boolean conditions correctly', () => {
        const rule = {
            status: 'Active',
            conditions: [
                { field: 'price', operator: 'GREATER_THAN', value: 1000 },
                { field: 'category', operator: 'EQUALS', value: 'VIP' }
            ]
        };

        // Matching context
        expect(RuleEngineService.evaluateRule(rule, { price: 1500, category: 'VIP' })).toBe(true);

        // Not matching price
        expect(RuleEngineService.evaluateRule(rule, { price: 500, category: 'VIP' })).toBe(false);

        // Not matching category
        expect(RuleEngineService.evaluateRule(rule, { price: 2000, category: 'Standard' })).toBe(false);
    });

    it('should calculate sandbox math expression values safely with replacements', () => {
        const formula = '(price * discount) + base_fee';
        const variables = { price: 200, discount: 0.9, base_fee: 10 };

        const result = RuleEngineService.evaluateFormula(formula, variables);
        expect(result).toBe(190); // 200 * 0.9 + 10 = 190
    });

    it('should reject unsafe characters or malicious script execution in formula expressions', () => {
        const formula = 'alert("xss")';
        const result = RuleEngineService.evaluateFormula(formula, {});
        expect(result).toBeNull();
    });
});
