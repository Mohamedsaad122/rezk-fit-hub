import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import ReportService from '@/services/report.service';
import ReportScheduler from '@/services/report-scheduler';
import ExportEngine from '@/services/export-engine';
import HealthService from '@/services/health.service';
import MonitoringService from '@/services/monitoring.service';

export const useReports = () => {
    const queryClient = useQueryClient();
    const queryKey = useMemo(() => ['reports-list'], []);

    const { data: reports = [], isLoading, refetch } = useQuery({
        queryKey,
        queryFn: () => ReportService.getAllReports()
    });

    const createReportMutation = useMutation({
        mutationFn: (data) => ReportService.createReport(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        }
    });

    const updateReportMutation = useMutation({
        mutationFn: ({ id, data }) => ReportService.updateReport(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        }
    });

    const deleteReportMutation = useMutation({
        mutationFn: (id) => ReportService.deleteReport(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        }
    });

    return {
        reports,
        isLoading,
        refetch,
        createReport: createReportMutation.mutateAsync,
        updateReport: updateReportMutation.mutateAsync,
        deleteReport: deleteReportMutation.mutateAsync
    };
};

export const useReportTemplates = () => {
    const { data: templates = [], isLoading } = useQuery({
        queryKey: ['report-templates'],
        queryFn: () => ReportService.getTemplates()
    });

    return { templates, isLoading };
};

export const useReportSchedules = () => {
    const queryClient = useQueryClient();
    const queryKey = useMemo(() => ['report-schedules'], []);

    const { data: schedules = [], isLoading, refetch } = useQuery({
        queryKey,
        queryFn: () => ReportScheduler.getSchedules()
    });

    const createScheduleMutation = useMutation({
        mutationFn: (data) => ReportScheduler.createSchedule(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        }
    });

    const updateScheduleMutation = useMutation({
        mutationFn: ({ id, data }) => ReportScheduler.updateSchedule(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        }
    });

    const deleteScheduleMutation = useMutation({
        mutationFn: (id) => ReportScheduler.deleteSchedule(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        }
    });

    const triggerRunMutation = useMutation({
        mutationFn: (id) => ReportScheduler.triggerScheduleRun(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
            queryClient.invalidateQueries({ queryKey: ['reports-exports'] });
        }
    });

    return {
        schedules,
        isLoading,
        refetch,
        createSchedule: createScheduleMutation.mutateAsync,
        updateSchedule: updateScheduleMutation.mutateAsync,
        deleteSchedule: deleteScheduleMutation.mutateAsync,
        triggerScheduleRun: triggerRunMutation.mutateAsync
    };
};

export const useReportsExports = () => {
    const queryClient = useQueryClient();
    const queryKey = useMemo(() => ['reports-exports'], []);

    const { data: exports = [], isLoading, refetch } = useQuery({
        queryKey,
        queryFn: () => ReportService.getExports()
    });

    const exportReportMutation = useMutation({
        mutationFn: ({ name, format, headers, dataRows, fields }) => 
            ExportEngine.exportReport(name, format, headers, dataRows, fields),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        }
    });

    return {
        exports,
        isLoading,
        refetch,
        exportReport: exportReportMutation.mutateAsync
    };
};

export const useSystemHealth = () => {
    const queryClient = useQueryClient();
    const queryKey = useMemo(() => ['system-health-check'], []);

    const { data: healthState = null, isLoading, refetch } = useQuery({
        queryKey,
        queryFn: () => HealthService.getSystemHealth(),
        refetchInterval: 30000 // auto refresh health status every 30s
    });

    const pingServiceMutation = useMutation({
        mutationFn: (serviceKey) => HealthService.pingService(serviceKey),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey });
        }
    });

    return {
        healthState,
        isLoading,
        refetch,
        pingService: pingServiceMutation.mutateAsync
    };
};

export const useLiveMetrics = () => {
    const queryKey = useMemo(() => ['live-metrics-stats'], []);

    const { data: metrics = null, isLoading, refetch } = useQuery({
        queryKey,
        queryFn: () => MonitoringService.getLiveMetrics(),
        refetchInterval: 5000 // auto poll server metrics every 5s
    });

    const { data: history = [] } = useQuery({
        queryKey: ['live-metrics-history'],
        queryFn: () => MonitoringService.getMetricsHistory(),
        refetchInterval: 10000
    });

    return {
        metrics,
        history,
        isLoading,
        refetch
    };
};

export default {
    useReports,
    useReportTemplates,
    useReportSchedules,
    useReportsExports,
    useSystemHealth,
    useLiveMetrics
};
