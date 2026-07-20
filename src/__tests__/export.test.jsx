import { describe, it, expect, beforeEach, vi } from 'vitest';
import AppConfig from '../config/app.config';
import { ExportEngine } from '../services/export-engine';

vi.mock('../utils/mockApi.helper', () => {
    return {
        simulateApi: (fn) => fn()
    };
});

describe('Sprint 4.5 Data Export formats Exporter Engine Test Suite', () => {
    beforeEach(() => {
        AppConfig.enableMock = true;
        
        // Mock global URL and Document APIs for environments where they aren't pre-defined
        if (typeof window !== 'undefined') {
            globalThis.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
        } else {
            globalThis.URL = {
                createObjectURL: vi.fn(() => 'blob:mock-url')
            };
        }
    });

    it('should format rows into valid CSV layout', () => {
        const headers = ['Name', 'Progress'];
        const rows = [
            { name: 'علي', progress: '90' },
            { name: 'عمر, كابتن', progress: '85' }
        ];
        const fields = ['name', 'progress'];

        const csv = ExportEngine.generateCSV(headers, rows, fields);
        expect(csv).toContain('Name,Progress');
        expect(csv).toContain('علي,90');
        expect(csv).toContain('"عمر, كابتن",85'); // test escaping quote commas
    });

    it('should trigger exports logging to repositories', async () => {
        const headers = ['NAME'];
        const rows = [{ name: 'Test' }];
        const fields = ['name'];

        const record = await ExportEngine.exportReport('تقرير_المتدربين', 'csv', headers, rows, fields);
        expect(record.id).toBeDefined();
        expect(record.format).toBe('csv');
        expect(record.status).toBe('success');
    });
});
