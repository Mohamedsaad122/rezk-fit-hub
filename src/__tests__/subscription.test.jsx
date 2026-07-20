import { describe, it, expect, beforeEach, vi } from 'vitest';
import AppConfig from '../config/app.config';
import { mockDatabase } from '../mocks/mockDatabase';
import { SubscriptionRepository } from '../repositories/subscription.repository';
import { SubscriptionService } from '../services/subscription.service';

vi.mock('../utils/mockApi.helper', () => {
    return {
        simulateApi: (fn) => fn()
    };
});

describe('Sprint 5.0 SaaS Subscriptions Limit Verification Test Suite', () => {
    beforeEach(() => {
        AppConfig.enableMock = true;
        mockDatabase.reset();
    });

    it('should load subscriptions limits and check users/storage quotas correctly', async () => {
        // Fetch plan limits
        const starterLimits = SubscriptionService.getLimitsForPlan('Starter');
        expect(starterLimits.users).toBe(3);
        expect(starterLimits.storageGb).toBe(5);
        expect(starterLimits.reportsEnabled).toBe(false);

        const businessLimits = SubscriptionService.getLimitsForPlan('Business');
        expect(businessLimits.users).toBe(20);
        expect(businessLimits.storageGb).toBe(50);
        expect(businessLimits.apiAccessEnabled).toBe(true);

        // Verify active quotas limit checking
        // Tenant 1 has professional plan (users quota = 10)
        const isUserAllowedT1 = await SubscriptionService.checkQuotaLimit(1, 'users', 5);
        expect(isUserAllowedT1).toBe(true);

        const isUserDeniedT1 = await SubscriptionService.checkQuotaLimit(1, 'users', 11);
        expect(isUserDeniedT1).toBe(false);

        // Tenant 2 has Starter plan (users quota = 3)
        const isUserAllowedT2 = await SubscriptionService.checkQuotaLimit(2, 'users', 2);
        expect(isUserAllowedT2).toBe(true);

        const isUserDeniedT2 = await SubscriptionService.checkQuotaLimit(2, 'users', 4);
        expect(isUserDeniedT2).toBe(false);
    });
});
