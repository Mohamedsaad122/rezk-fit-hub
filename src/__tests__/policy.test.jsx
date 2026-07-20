import { describe, it, expect, beforeEach } from 'vitest';
import AppConfig from '../config/app.config';
import { mockDatabase } from '../mocks/mockDatabase';
import { PolicyService } from '../services/policy.service';

describe('Enterprise Security Policies Constraints Test Suite', () => {
    beforeEach(() => {
        AppConfig.enableMock = true;
        mockDatabase.reset();
    });

    it('should save and fetch enterprise policy parameters', async () => {
        const policy = await PolicyService.getPolicy();
        expect(policy.ipAllowList).toEqual([]);

        await PolicyService.updatePolicy({ ipAllowList: ['192.168.1.10'] });
        const updated = await PolicyService.getPolicy();
        expect(updated.ipAllowList).toEqual(['192.168.1.10']);
    });

    it('should block connections from IPs outside the allowlist when configured', async () => {
        await PolicyService.updatePolicy({ ipAllowList: ['10.0.0.15'] });

        // Allowed IP
        const check = await PolicyService.evaluateConstraints('10.0.0.15', 'SA');
        expect(check).toBe(true);

        // Blocked IP
        await expect(PolicyService.evaluateConstraints('192.168.1.5', 'SA'))
            .rejects.toThrow('Access blocked: IP address');
    });

    it('should enforce geo-blocking rules and reject connections from blocked countries', async () => {
        await PolicyService.updatePolicy({ blockedCountries: ['US', 'CN'] });

        // Allowed country
        const check = await PolicyService.evaluateConstraints('10.0.0.1', 'SA');
        expect(check).toBe(true);

        // Blocked country
        await expect(PolicyService.evaluateConstraints('10.0.0.1', 'US'))
            .rejects.toThrow('Access blocked: Logins from country');
    });

    it('should restrict access outside working hours when start/end ranges are set', async () => {
        await PolicyService.updatePolicy({ workingHoursStart: '09:00', workingHoursEnd: '18:00' });

        // Within hours (14:30)
        const check = await PolicyService.evaluateConstraints('10.0.0.1', 'SA', '14:30');
        expect(check).toBe(true);

        // Outside hours (22:00)
        await expect(PolicyService.evaluateConstraints('10.0.0.1', 'SA', '22:00'))
            .rejects.toThrow('Access blocked: Logins are restricted outside working hours');
    });
});
