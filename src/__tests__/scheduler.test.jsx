import { describe, it, expect, beforeEach, vi } from 'vitest';
import AppConfig from '../config/app.config';
import { ReportScheduler } from '../services/report-scheduler';

vi.mock('../utils/mockApi.helper', () => {
    return {
        simulateApi: (fn) => fn()
    };
});

describe('Sprint 4.5 Report Scheduler & Task Runners Test Suite', () => {
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

    it('should create scheduled tasks, manage configurations, and trigger runs', async () => {
        // Create schedule
        const newSched = await ReportScheduler.createSchedule({
            name: 'تقرير متابعة دوري إلكتروني',
            module: 'Clients',
            filters: { status: 'نشط' },
            schedule: 'weekly',
            format: 'pdf',
            recipients: ['supervisor@fit.com'],
            retentionDays: 30
        });

        expect(newSched.id).toBeDefined();
        expect(newSched.name).toBe('تقرير متابعة دوري إلكتروني');
        expect(newSched.schedule).toBe('weekly');

        // Run schedule immediately
        const runResult = await ReportScheduler.triggerScheduleRun(newSched.id);
        expect(runResult.success).toBe(true);
        expect(runResult.exportRecord).toBeDefined();
        expect(runResult.notificationMessage).toContain('supervisor@fit.com');

        // Update schedule
        const updated = await ReportScheduler.updateSchedule(newSched.id, {
            isActive: false
        });
        expect(updated.isActive).toBe(false);

        // Delete schedule
        const deleted = await ReportScheduler.deleteSchedule(newSched.id);
        expect(deleted).toBe(true);
    });
});
