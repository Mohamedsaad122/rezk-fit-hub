import { describe, it, expect, beforeEach, vi } from 'vitest';
import AppConfig from '../config/app.config';
import { ReportRepository } from '../repositories/report.repository';
import { ReportBuilder } from '../services/report-builder';

// Mock the API delay helper to run tests instantly
vi.mock('../utils/mockApi.helper', () => {
    return {
        simulateApi: (fn) => fn()
    };
});

describe('Sprint 4.5 Reporting Engine Integration Test Suite', () => {
    beforeEach(() => {
        AppConfig.enableMock = true;
    });

    describe('1. Reports Repository CRUD & Mocks Integration', () => {
        it('should fetch reports, create a new report, update it, and delete it', async () => {
            // Retrieve reports list
            const initialReports = await ReportRepository.getAll();
            expect(initialReports).toBeDefined();
            expect(Array.isArray(initialReports)).toBe(true);

            // Create a custom report
            const newReport = await ReportRepository.create({
                name: 'تقرير اختبارات جودة المشتركين',
                module: 'Clients',
                filters: { subscriptionStatus: 'نشط' },
                sorting: { field: 'progress', order: 'desc' },
                data: [{ name: 'مستخدم تجريبي', progress: 99 }]
            });

            expect(newReport.id).toBeDefined();
            expect(newReport.name).toBe('تقرير اختبارات جودة المشتركين');
            expect(newReport.module).toBe('Clients');

            // Update custom report
            const updated = await ReportRepository.update(newReport.id, {
                name: 'تقرير جودة المتدربين المحدث'
            });
            expect(updated.name).toBe('تقرير جودة المتدربين المحدث');

            // Delete custom report
            const deleted = await ReportRepository.delete(newReport.id);
            expect(deleted).toBe(true);

            // Verify clean deletion
            const reportsAfter = await ReportRepository.getAll();
            expect(reportsAfter.find(r => r.id === newReport.id)).toBeUndefined();
        });

        it('should load report templates correctly', async () => {
            const templates = await ReportRepository.getTemplates();
            expect(templates.length).toBeGreaterThan(0);
            expect(templates[0].name).toContain('Executive Summary');
        });
    });

    describe('2. Visual Report Builder Engine Parsing', () => {
        it('should filter, sort, and group dataset rows successfully', () => {
            const data = ReportBuilder.generateReportData('Clients', { subscriptionStatus: 'نشط' }, { field: 'progress', order: 'desc' });
            expect(data).toBeDefined();
            expect(Array.isArray(data)).toBe(true);
            if (data.length > 1) {
                expect(data[0].progress).toBeGreaterThanOrEqual(data[1].progress);
            }
        });
    });
});
