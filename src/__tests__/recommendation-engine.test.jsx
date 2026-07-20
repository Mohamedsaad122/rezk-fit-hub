import { describe, it, expect, beforeEach, vi } from 'vitest';
import AppConfig from '../config/app.config';
import { mockDatabase } from '../mocks/mockDatabase';
import { RecommendationEngineService } from '../services/recommendation-engine.service';
import { TenantRepository } from '../repositories/tenant.repository';

vi.mock('../utils/mockApi.helper', () => {
    return {
        simulateApi: (fn) => fn()
    };
});

describe('Sprint 5.3 Recommendation & Risk Scoring Engine', () => {
    beforeEach(() => {
        AppConfig.enableMock = true;
        mockDatabase.reset();
    });

    it('should assign Critical risk level when attendance and completed tasks rates are low', async () => {
        TenantRepository.setActiveTenant(1);

        const result = await RecommendationEngineService.assessClientRisk(1, 'محمد علي', 10, 15);
        expect(result.riskLevel).toBe('Critical');
        expect(result.riskScore).toBeGreaterThanOrEqual(75);
    });

    it('should assign Low risk level when commitment indicators are high', async () => {
        TenantRepository.setActiveTenant(1);

        const result = await RecommendationEngineService.assessClientRisk(1, 'سارة أحمد', 95, 90);
        expect(result.riskLevel).toBe('Low');
        expect(result.riskScore).toBeLessThan(25);
    });
});
