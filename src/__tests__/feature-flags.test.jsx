import { describe, it, expect, beforeEach } from 'vitest';
import AppConfig from '../config/app.config';
import { mockDatabase } from '../mocks/mockDatabase';
import { FeatureFlagsService } from '../services/feature-flags.service';

describe('Feature Flags Rollout Test Suite', () => {
    beforeEach(() => {
        AppConfig.enableMock = true;
        mockDatabase.reset();
    });

    it('should evaluate gradual rollouts and check statuses', async () => {
        const flags = await FeatureFlagsService.getFeatureFlags();
        expect(flags.length).toBeGreaterThan(0);
        
        const isEnabled = await FeatureFlagsService.isEnabled('nutritionModule', 1);
        expect(isEnabled).toBe(true);
    });

    it('should toggle flag states dynamically', async () => {
        await FeatureFlagsService.updateFlag('nutritionModule', { status: 'Disabled' });
        const isEnabled = await FeatureFlagsService.isEnabled('nutritionModule', 1);
        expect(isEnabled).toBe(false);
    });
});
