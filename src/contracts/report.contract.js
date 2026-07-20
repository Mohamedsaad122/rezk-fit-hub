import { z } from 'zod';

export const ReportSchema = z.object({
    id: z.number().nonnegative(),
    tenantId: z.union([z.string(), z.number()]).optional(),
    name: z.string().min(2, 'اسم التقرير مطلوب'),
    module: z.enum(['Clients', 'Calendar', 'Tasks', 'Nutrition', 'Exercises', 'Messages', 'Analytics', 'Documents', 'Audit Logs', 'Notifications']),
    filters: z.record(z.any()).default({}),
    sorting: z.object({
        field: z.string(),
        order: z.enum(['asc', 'desc'])
    }).optional(),
    grouping: z.string().optional().nullable(),
    data: z.array(z.record(z.any())).default([]),
    createdAt: z.string(),
    createdBy: z.string(),
    isFavorite: z.boolean().default(false),
    isTemplate: z.boolean().default(false)
});

export const ReportTemplateSchema = z.object({
    id: z.number().nonnegative(),
    name: z.string(),
    description: z.string(),
    module: z.string(),
    filters: z.record(z.any()).default({}),
    sorting: z.object({
        field: z.string(),
        order: z.enum(['asc', 'desc'])
    }).optional(),
    grouping: z.string().optional().nullable()
});

export const ScheduledReportSchema = z.object({
    id: z.number().nonnegative(),
    tenantId: z.union([z.string(), z.number()]).optional(),
    name: z.string().min(2, 'اسم المجدول مطلوب'),
    module: z.string(),
    filters: z.record(z.any()).default({}),
    schedule: z.string(), // e.g. '0 9 * * 1' or 'daily' | 'weekly' | 'monthly'
    format: z.enum(['csv', 'xlsx', 'pdf']),
    recipients: z.array(z.string().email('صيغة البريد الإلكتروني غير صحيحة')),
    retentionDays: z.number().nonnegative().default(30),
    lastRun: z.string().optional().nullable(),
    nextRun: z.string().optional().nullable(),
    isActive: z.boolean().default(true),
    createdAt: z.string()
});

export const ExportRecordSchema = z.object({
    id: z.number().nonnegative(),
    name: z.string(),
    format: z.enum(['csv', 'xlsx', 'pdf']),
    status: z.enum(['pending', 'success', 'failed']),
    url: z.string().optional().nullable(),
    generatedAt: z.string(),
    sizeBytes: z.number().nonnegative().default(0)
});

export const HealthStateSchema = z.enum(['Healthy', 'Warning', 'Critical', 'Offline']);

export const HealthStatusSchema = z.object({
    status: HealthStateSchema,
    message: z.string(),
    latencyMs: z.number().optional(),
    lastChecked: z.string()
});

export const SystemHealthCenterSchema = z.object({
    api: HealthStatusSchema,
    database: HealthStatusSchema,
    realtime: HealthStatusSchema,
    notifications: HealthStatusSchema,
    storage: HealthStatusSchema,
    authentication: HealthStatusSchema,
    backgroundWorkers: HealthStatusSchema
});

export const MonitoringMetricsSchema = z.object({
    activeUsers: z.number().nonnegative(),
    activeCoaches: z.number().nonnegative(),
    onlineStaff: z.number().nonnegative(),
    todayRevenue: z.number().nonnegative(),
    upcomingSessions: z.number().nonnegative(),
    systemLoad: z.number().min(0).max(100),
    storageUsage: z.number().min(0).max(100),
    apiResponseTime: z.number().nonnegative(),
    failedRequests: z.number().nonnegative(),
    queueSize: z.number().nonnegative(),
    timestamp: z.string()
});

export default {
    ReportSchema,
    ReportTemplateSchema,
    ScheduledReportSchema,
    ExportRecordSchema,
    HealthStateSchema,
    SystemHealthCenterSchema,
    MonitoringMetricsSchema
};
