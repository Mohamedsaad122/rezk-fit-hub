import { describe, it, expect, beforeEach } from 'vitest';
import AppConfig from '../config/app.config';
import { mockDatabase } from '../mocks/mockDatabase';
import { MetricsService } from '../services/metrics.service';

describe('Metrics Telemetry Test Suite', () => {
    beforeEach(() => {
        AppConfig.enableMock = true;
        mockDatabase.reset();
    });

    it('should record a metric log successfully', async () => {
        const metric = await MetricsService.recordMetric('system.cpu.usage', 45.2, '%');
        expect(metric.id).toBeDefined();
        expect(metric.key).toBe('system.cpu.usage');
        expect(metric.value).toBe(45.2);
    });

    it('should fetch all recorded metrics', async () => {
        await MetricsService.recordMetric('system.cpu.usage', 45.2, '%');
        const list = await MetricsService.getMetrics();
        expect(list.some(m => m.key === 'system.cpu.usage')).toBe(true);
    });
});
