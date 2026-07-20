import { describe, it, expect, beforeEach } from 'vitest';
import AppConfig from '../config/app.config';
import { mockDatabase } from '../mocks/mockDatabase';
import { HealthService } from '../services/health.service';

describe('Component Health Checks Test Suite', () => {
    beforeEach(() => {
        AppConfig.enableMock = true;
        mockDatabase.reset();
    });

    it('should ping individual components and retrieve updated status logs', async () => {
        const pingRes = await HealthService.pingService('database');
        expect(pingRes).toBeDefined();
        expect(pingRes.status).toBeDefined();
        expect(pingRes.latencyMs).toBeDefined();
    });

    it('should fetch the overall dashboard health status', async () => {
        const health = await HealthService.getSystemHealth();
        expect(health.database).toBeDefined();
        expect(health.api).toBeDefined();
    });
});
