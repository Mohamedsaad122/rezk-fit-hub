import { describe, it, expect, beforeEach, vi } from 'vitest';
import AppConfig from '../config/app.config';
import { mockDatabase } from '../mocks/mockDatabase';
import { NutritionAIService } from '../services/nutrition-ai.service';
import { TenantRepository } from '../repositories/tenant.repository';

vi.mock('../utils/mockApi.helper', () => {
    return {
        simulateApi: (fn) => fn()
    };
});

describe('Sprint 5.3 AI Nutrition & Meals Recommendation', () => {
    beforeEach(() => {
        AppConfig.enableMock = true;
        mockDatabase.reset();
    });

    it('should generate meals plan containing calories targets and macros breakdown', async () => {
        TenantRepository.setActiveTenant(1);

        const clientDetails = { name: 'سارة أحمد', age: 25, weight: 65 };
        const result = await NutritionAIService.generateMealPlan(clientDetails, 'إنقاص الوزن');

        expect(result.meals.length).toBeGreaterThan(0);
        expect(result.dailyTarget.calories).toBeDefined();
        expect(result.dailyTarget.protein).toBeDefined();
    });
});
