import { describe, it, expect, beforeEach } from 'vitest';
import AppConfig from '../config/app.config';
import { mockDatabase } from '../mocks/mockDatabase';
import { TracingService } from '../services/tracing.service';

describe('Distributed Request Tracing Test Suite', () => {
    beforeEach(() => {
        AppConfig.enableMock = true;
        mockDatabase.reset();
    });

    it('should register trace spans with parent relationships', async () => {
        const trace = await TracingService.createTraceSpan('SELECT * FROM trainees', 'corr-123', 15, 'Success', 'tr-parent');
        expect(trace.id).toBeDefined();
        expect(trace.traceId).toBeDefined();
        expect(trace.parentId).toBe('tr-parent');
        expect(trace.correlationId).toBe('corr-123');
    });

    it('should retrieve trace spans', async () => {
        await TracingService.createTraceSpan('GET /api/trainees', 'corr-456', 22);
        const list = await TracingService.getTraces();
        expect(list.length).toBeGreaterThan(0);
    });
});
