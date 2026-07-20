import { describe, it, expect, beforeEach } from 'vitest';
import AppConfig from '../config/app.config';
import { mockDatabase } from '../mocks/mockDatabase';
import { MfaService } from '../services/mfa.service';

describe('Multi-Factor Authentication Test Suite', () => {
    beforeEach(() => {
        AppConfig.enableMock = true;
        mockDatabase.reset();
    });

    it('should setup TOTP secret and recovery codes', async () => {
        const setup = await MfaService.setupMfa(1);
        expect(setup.secret).toBeDefined();
        expect(setup.qrCodeUrl).toContain('secret=');
        expect(setup.recoveryCodes.length).toBe(8);
        expect(setup.enabled).toBe(false);
    });

    it('should enable MFA upon successful mock code verification', async () => {
        await MfaService.setupMfa(1);
        const enabled = await MfaService.verifyAndEnableMfa(1, '123456');
        expect(enabled.enabled).toBe(true);

        // Verification check
        const check = await MfaService.verifyOtp(1, '123456');
        expect(check).toBe(true);
    });

    it('should support recovery codes and invalidate used recovery codes', async () => {
        const setup = await MfaService.setupMfa(1);
        await MfaService.verifyAndEnableMfa(1, '123456');

        const firstCode = setup.recoveryCodes[0];
        
        // Login with backup code
        const verify = await MfaService.verifyOtp(1, firstCode);
        expect(verify).toBe(true);

        // Subsequent check with same code must fail since it was invalidated
        await expect(MfaService.verifyOtp(1, firstCode))
            .rejects.toThrow('Invalid MFA authentication code');
    });
});
