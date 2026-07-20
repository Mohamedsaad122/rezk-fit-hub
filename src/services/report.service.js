import { ReportRepository } from '@/repositories/report.repository';

export const ReportService = {
    getAllReports: () => {
        return ReportRepository.getAll();
    },

    getReportById: (id) => {
        return ReportRepository.getById(id);
    },

    createReport: (data) => {
        return ReportRepository.create(data);
    },

    updateReport: (id, data) => {
        return ReportRepository.update(id, data);
    },

    deleteReport: (id) => {
        return ReportRepository.delete(id);
    },

    getTemplates: () => {
        return ReportRepository.getTemplates();
    },

    getExports: () => {
        return ReportRepository.getExports();
    }
};

export default ReportService;
