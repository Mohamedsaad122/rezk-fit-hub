import { ReportRepository } from '@/repositories/report.repository';
import { ExportEngine } from './export-engine';
import { ReportBuilder } from './report-builder';
import { NotificationRepository } from '@/repositories/notification.repository';

export const ReportScheduler = {
    /**
     * Retrieve all active schedules.
     */
    getSchedules: () => {
        return ReportRepository.getSchedules();
    },

    /**
     * Create a new scheduled report.
     */
    createSchedule: (scheduleData) => {
        return ReportRepository.createSchedule(scheduleData);
    },

    /**
     * Modify an existing schedule.
     */
    updateSchedule: (id, scheduleData) => {
        return ReportRepository.updateSchedule(id, scheduleData);
    },

    /**
     * Terminate a schedule.
     */
    deleteSchedule: (id) => {
        return ReportRepository.deleteSchedule(id);
    },

    /**
     * Force-trigger an immediate scheduled report run.
     * Generates simulated files, adds them to exports logs, and dispatches notification alerts.
     */
    triggerScheduleRun: async (scheduleId) => {
        const schedule = await ReportRepository.getSchedules().then(list => list.find(s => s.id === Number(scheduleId)));
        if (!schedule) throw new Error('المجدول غير موجود');

        // 1. Generate report rows dynamically via ReportBuilder
        const dataRows = ReportBuilder.generateReportData(schedule.module, schedule.filters);
        
        // Define fallback dummy fields and headers
        const fields = dataRows.length > 0 ? Object.keys(dataRows[0]) : ['id', 'name'];
        const headers = fields.map(f => f.toUpperCase());

        // 2. Perform export bundle creation via ExportEngine
        const exportRecord = await ExportEngine.exportReport(
            schedule.name,
            schedule.format,
            headers,
            dataRows,
            fields
        );

        // 3. Dispatch Notification system alerts to recipients
        const emails = schedule.recipients.join(', ');
        const notificationTitle = `تقرير تلقائي مجدول: ${schedule.name}`;
        const notificationMessage = `تم توليد تقرير مجدول (${schedule.format.toUpperCase()}) بنجاح وإرساله للمستلمين: [${emails}]. حجم الملف: ${(exportRecord.sizeBytes / 1024).toFixed(1)} KB.`;

        await NotificationRepository.create({
            title: notificationTitle,
            description: notificationMessage,
            type: 'System',
            priority: 'Normal',
            status: 'Unread'
        });

        // 4. Update the schedule details (lastRun and nextRun dates)
        const now = new Date();
        const nextDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 1 day later
        await ReportRepository.updateSchedule(scheduleId, {
            lastRun: now.toISOString(),
            nextRun: nextDate.toISOString()
        });

        return {
            success: true,
            exportRecord,
            notificationMessage
        };
    }
};

export default ReportScheduler;
