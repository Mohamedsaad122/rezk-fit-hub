import { describe, it, expect, beforeEach } from 'vitest';
import AppConfig from '../config/app.config';
import { mockDatabase } from '../mocks/mockDatabase';
import { SecurityService } from '../services/security.service';

describe('Brute Force & Security Config Test Suite', () => {
    beforeEach(() => {
        AppConfig.enableMock = true;
        mockDatabase.reset();
    });

    it('should load default security configs and allow updates', async () => {
        const config = await SecurityService.getConfig();
        expect(config.passwordMinLength).toBe(8);
        expect(config.maxFailedAttempts).toBe(5);

        await SecurityService.updateConfig({ maxFailedAttempts: 3 });
        const updated = await SecurityService.getConfig();
        expect(updated.maxFailedAttempts).toBe(3);
    });

    it('should trigger lockout when failed attempt counts exceed max configured limits', async () => {
        const ip = '192.168.1.99';
        await SecurityService.updateConfig({ maxFailedAttempts: 2, lockoutDurationMinutes: 10 });

        // First failure
        await SecurityService.registerFailedAttempt(ip);
        let check = await SecurityService.verifyBruteForce(ip);
        expect(check.lockedUntil).toBeNull();

        // Second failure -> locked out!
        await SecurityService.registerFailedAttempt(ip);
        
        await expect(SecurityService.verifyBruteForce(ip))
            .rejects.toThrow('IP address is locked due to brute force protection');
    });
});
