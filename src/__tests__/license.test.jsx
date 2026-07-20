import { describe, it, expect, beforeEach, vi } from 'vitest';
import AppConfig from '../config/app.config';
import { mockDatabase } from '../mocks/mockDatabase';
import { LicenseService } from '../services/license.service';

vi.mock('../utils/mockApi.helper', () => {
    return {
        simulateApi: (fn) => fn()
    };
});

describe('Sprint 5.0 SaaS Licensing Engine Test Suite', () => {
    beforeEach(() => {
        AppConfig.enableMock = true;
        mockDatabase.reset();
    });

    it('should validate licenses expiration and grace periods', async () => {
        // Tenant 1 is active & valid
        const validationT1 = await LicenseService.checkLicenseValidity(1);
        expect(validationT1.isValid).toBe(true);
        expect(validationT1.status).toBe('Active');

        // Verify remaining grace period days calculations
        // Let's create an expiration string 2 days in the past
        const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString();
        const graceDays = LicenseService.getGracePeriodRemainingDays(twoDaysAgo);
        // Expecting 5 days remaining out of 7
        expect(graceDays).toBe(5);
    });

    it('should decode and validate base64 offline license keys', () => {
        const payload = {
            tenantId: 2,
            expiresAt: '2027-12-31T00:00:00Z',
            seatsCount: 15,
            deviceCount: 8,
            signature: 'SIGN_HMAC_MOCK_XYZ'
        };

        const base64Code = btoa(JSON.stringify(payload));
        
        const parsed = LicenseService.parseOfflineLicense(base64Code);
        expect(parsed.tenantId).toBe(2);
        expect(parsed.seatsCount).toBe(15);
        expect(parsed.licenseKey).toContain('OFFLINE-KEY-2-15');
    });
});
