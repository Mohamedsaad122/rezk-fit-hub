import { describe, it, expect, beforeEach, vi } from 'vitest';
import AppConfig from '../config/app.config';
import { mockDatabase } from '../mocks/mockDatabase';
import { BillingRepository } from '../repositories/billing.repository';
import { TenantRepository } from '../repositories/tenant.repository';

vi.mock('../utils/mockApi.helper', () => {
    return {
        simulateApi: (fn) => fn()
    };
});

describe('Sprint 5.2 Enterprise Billing Profile Operations', () => {
    beforeEach(() => {
        AppConfig.enableMock = true;
        mockDatabase.reset();
    });

    it('should support fetching and updating billing profiles isolated by tenant', async () => {
        TenantRepository.setActiveTenant(1);

        const profile = await BillingRepository.get();
        expect(profile.companyName).toBe('مؤسسة التدريب الافتراضية');

        // Update profile
        const updated = await BillingRepository.update({
            companyName: 'مؤسسة التدريب العالمية'
        });
        expect(updated.companyName).toBe('مؤسسة التدريب العالمية');

        // Switch to tenant 2
        TenantRepository.setActiveTenant(2);
        const t2Profile = await BillingRepository.get();
        expect(t2Profile.companyName).toBe('Elite Training Hub Ltd');
    });
});
