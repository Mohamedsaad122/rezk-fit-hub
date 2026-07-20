import { describe, it, expect, beforeEach, vi } from 'vitest';
import AppConfig from '../config/app.config';
import { MonitoringService } from '../services/monitoring.service';

vi.mock('../utils/mockApi.helper', () => {
    return {
        simulateApi: (fn) => fn()
    };
});

describe('Sprint 4.5 Performance Monitoring Test Suite', () => {
    beforeEach(() => {
        AppConfig.enableMock = true;
    });

    it('should query live dashboard operational statistics and metrics history logs', async () => {
        const metrics = await MonitoringService.getLiveMetrics();
        expect(metrics).toBeDefined();
        expect(metrics.activeUsers).toBeGreaterThan(0);
        expect(metrics.systemLoad).toBeDefined();

        const history = await MonitoringService.getMetricsHistory(5);
        expect(history.length).toBe(5);
        expect(history[0].systemLoad).toBeDefined();
        expect(history[0].apiResponseTime).toBeDefined();
    });
});
