import { describe, it, expect, beforeEach, vi } from 'vitest';
import AppConfig from '../config/app.config';
import { mockDatabase } from '../mocks/mockDatabase';
import { BillingService } from '../services/billing.service';
import { SubscriptionRepository } from '../repositories/subscription.repository';
import { TenantRepository } from '../repositories/tenant.repository';

vi.mock('../utils/mockApi.helper', () => {
    return {
        simulateApi: (fn) => fn()
    };
});

describe('Sprint 5.2 Subscription Renewals & Grace Periods', () => {
    beforeEach(() => {
        AppConfig.enableMock = true;
        mockDatabase.reset();
    });

    it('should renew subscription and extend the end date by one month', async () => {
        TenantRepository.setActiveTenant(1);

        const subBefore = await SubscriptionRepository.get(1);
        const originalEndDate = new Date(subBefore.endDate);

        // Renew subscription
        const renewed = await BillingService.renewSubscription(1);
        expect(renewed.status).toBe('Active');

        const newEndDate = new Date(renewed.endDate);
        expect(newEndDate.getTime()).toBeGreaterThan(originalEndDate.getTime());
    });

    it('should update subscription status to Cancelled, Expired, and PastDue', async () => {
        TenantRepository.setActiveTenant(1);

        // Cancel
        const cancelled = await BillingService.cancelSubscription(1);
        expect(cancelled.status).toBe('Cancelled');

        // Expire
        const expired = await BillingService.expireSubscription(1);
        expect(expired.status).toBe('Expired');

        // PastDue
        const pastDue = await BillingService.markPastDue(1);
        expect(pastDue.status).toBe('PastDue');
    });
});
