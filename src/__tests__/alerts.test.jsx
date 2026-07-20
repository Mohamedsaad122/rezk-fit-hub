import { describe, it, expect, beforeEach } from 'vitest';
import AppConfig from '../config/app.config';
import { mockDatabase } from '../mocks/mockDatabase';
import { AlertsService } from '../services/alerts.service';

describe('Alert Engine Test Suite', () => {
    beforeEach(() => {
        AppConfig.enableMock = true;
        mockDatabase.reset();
    });

    it('should trigger new active alerts', async () => {
        const alert = await AlertsService.triggerAlert('Memory Exceeded Limit', 'RAM > 90%', 'Critical', 'Infrastructure');
        expect(alert.id).toBeDefined();
        expect(alert.status).toBe('Active');
        expect(alert.severity).toBe('Critical');
    });

    it('should resolve alert states', async () => {
        const alert = await AlertsService.triggerAlert('CPU Spike', 'CPU > 95%', 'Warning', 'System');
        const resolved = await AlertsService.resolveAlert(alert.id);
        expect(resolved.status).toBe('Resolved');
        expect(resolved.resolvedAt).toBeDefined();
    });
});
