import AppConfig from '@/config/app.config';
import api from '@/api/axios';
import { mockDatabase } from '@/mocks/mockDatabase';
import { simulateApi } from '@/utils/mockApi.helper';
import { parseApiResponse } from '@/utils/parseApiResponse';
import { z } from 'zod';
import {
    ReportSchema,
    ReportTemplateSchema,
    ScheduledReportSchema,
    ExportRecordSchema,
    SystemHealthCenterSchema,
    MonitoringMetricsSchema
} from '@/contracts/report.contract';

export const ReportRepository = {
    getAll: async () => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.reporting.reports.getAll());
        } else {
            const response = await api.get('/api/reports');
            result = response.data;
        }
        return parseApiResponse(z.array(ReportSchema), result, 'Report List');
    },

    getById: async (id) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.reporting.reports.getById(id));
        } else {
            const response = await api.get(`/api/reports/${id}`);
            result = response.data;
        }
        return parseApiResponse(ReportSchema, result, 'Report Detail');
    },

    create: async (data) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.reporting.reports.create(data));
        } else {
            const response = await api.post('/api/reports', data);
            result = response.data;
        }
        return parseApiResponse(ReportSchema, result, 'Create Report');
    },

    update: async (id, data) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.reporting.reports.update(id, data));
        } else {
            const response = await api.put(`/api/reports/${id}`, data);
            result = response.data;
        }
        return parseApiResponse(ReportSchema, result, 'Update Report');
    },

    delete: async (id) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.reporting.reports.delete(id));
        } else {
            const response = await api.delete(`/api/reports/${id}`);
            result = response.data;
        }
        return result;
    },

    getTemplates: async () => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.reporting.templates.getAll());
        } else {
            const response = await api.get('/api/reports/templates');
            result = response.data;
        }
        return parseApiResponse(z.array(ReportTemplateSchema), result, 'Template List');
    },

    getSchedules: async () => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.reporting.scheduler.getAll());
        } else {
            const response = await api.get('/api/reports/schedules');
            result = response.data;
        }
        return parseApiResponse(z.array(ScheduledReportSchema), result, 'Schedule List');
    },

    createSchedule: async (data) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.reporting.scheduler.create(data));
        } else {
            const response = await api.post('/api/reports/schedules', data);
            result = response.data;
        }
        return parseApiResponse(ScheduledReportSchema, result, 'Create Schedule');
    },

    updateSchedule: async (id, data) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.reporting.scheduler.update(id, data));
        } else {
            const response = await api.put(`/api/reports/schedules/${id}`, data);
            result = response.data;
        }
        return parseApiResponse(ScheduledReportSchema, result, 'Update Schedule');
    },

    deleteSchedule: async (id) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.reporting.scheduler.delete(id));
        } else {
            const response = await api.delete(`/api/reports/schedules/${id}`);
            result = response.data;
        }
        return result;
    },

    getExports: async () => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.reporting.exports.getAll());
        } else {
            const response = await api.get('/api/reports/exports');
            result = response.data;
        }
        return parseApiResponse(z.array(ExportRecordSchema), result, 'Export List');
    },

    createExport: async (data) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.reporting.exports.create(data));
        } else {
            const response = await api.post('/api/reports/exports', data);
            result = response.data;
        }
        return parseApiResponse(ExportRecordSchema, result, 'Create Export');
    },

    getHealth: async () => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.reporting.health.get());
        } else {
            const response = await api.get('/api/monitoring/health');
            result = response.data;
        }
        return parseApiResponse(SystemHealthCenterSchema, result, 'System Health Center');
    },

    getMetrics: async () => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.reporting.monitoring.getMetrics());
        } else {
            const response = await api.get('/api/monitoring/metrics');
            result = response.data;
        }
        return parseApiResponse(MonitoringMetricsSchema, result, 'Monitoring Metrics');
    }
};

export default ReportRepository;
