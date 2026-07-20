import { describe, it, expect, beforeEach } from 'vitest';
import AppConfig from '../config/app.config';
import { mockDatabase } from '../mocks/mockDatabase';
import { RateLimitService } from '../services/rate-limit.service';

describe('API Gateway Rate Limiting & Throttling Test Suite', () => {
    beforeEach(() => {
        AppConfig.enableMock = true;
        mockDatabase.reset();
    });

    it('should track IP request counts and decrement remaining limits in the window', async () => {
        const ip = '192.168.1.50';
        
        const r1 = await RateLimitService.checkAndThrottle(ip, 5, 60000);
        expect(r1.remaining).toBe(4);

        const r2 = await RateLimitService.checkAndThrottle(ip, 5, 60000);
        expect(r2.remaining).toBe(3);
    });

    it('should throw an error and trigger throttle when IP exceeds limits', async () => {
        const ip = '10.0.0.1';
        
        // Execute 1 call on a limit of 2 (succeeds)
        await RateLimitService.checkAndThrottle(ip, 2, 60000);

        // Second call should fail with rate limit error
        await expect(RateLimitService.checkAndThrottle(ip, 2, 60000))
            .rejects.toThrow('Rate limit exceeded');
    });

    it('should create log entries for every executed request check', async () => {
        const ip = '172.16.0.5';
        await RateLimitService.checkAndThrottle(ip, 10, 60000);

        const logs = await RateLimitService.getApiLogs();
        expect(logs.length).toBe(1);
        expect(logs[0].clientIp).toBe(ip);
        expect(logs[0].status).toBe(200);
    });
});
