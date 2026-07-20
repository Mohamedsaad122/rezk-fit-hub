import { describe, it, expect, beforeEach } from 'vitest';
import AppConfig from '../config/app.config';
import { mockDatabase } from '../mocks/mockDatabase';
import { TelemetryService } from '../services/telemetry.service';
import { MetricsService } from '../services/metrics.service';

describe('Client Telemetry Test Suite', () => {
    beforeEach(() => {
        AppConfig.enableMock = true;
        mockDatabase.reset();
    });

    it('should track client page views and record corresponding metric units', async () => {
        await TelemetryService.trackPageView('/test-path');
        const metrics = await MetricsService.getMetrics();
        expect(metrics.some(m => m.key === 'telemetry.page.view')).toBe(true);
    });

    it('should record user performance metrics', async () => {
        await TelemetryService.trackPerformance('testLoadTime', 180);
        const metrics = await MetricsService.getMetrics();
        expect(metrics.some(m => m.key === 'telemetry.performance.testLoadTime')).toBe(true);
    });
});
