import { ReportRepository } from '@/repositories/report.repository';

export const ExportEngine = {
    /**
     * Export data rows to the target file format.
     * @param {string} reportName - The name of the report
     * @param {string} format - csv | xlsx | pdf
     * @param {Array<string>} headers - Headers names list (Arabic/English)
     * @param {Array<Object>} dataRows - Array of data row objects
     * @param {Array<string>} fields - Field keys matching columns
     * @returns {Promise<Object>} - The logged export record details
     */
    exportReport: async (reportName, format, headers, dataRows, fields) => {
        // 1. Generate local file blob content based on format
        let url = '';
        let sizeBytes = 0;

        if (format === 'csv') {
            const csvContent = ExportEngine.generateCSV(headers, dataRows, fields);
            const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
            url = URL.createObjectURL(blob);
            sizeBytes = blob.size;
        } else if (format === 'xlsx') {
            // Simulated XLSX byte streams
            const mockBytes = new Array(50000).fill(0).map(() => Math.floor(Math.random() * 256));
            const blob = new Blob([new Uint8Array(mockBytes)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            url = URL.createObjectURL(blob);
            sizeBytes = blob.size;
        } else {
            // Simulated PDF document streams
            const mockBytes = new Array(85000).fill(0).map(() => Math.floor(Math.random() * 256));
            const blob = new Blob([new Uint8Array(mockBytes)], { type: 'application/pdf' });
            url = URL.createObjectURL(blob);
            sizeBytes = blob.size;
        }

        // 2. Trigger instant local file download in browser context (when run inside UI)
        if (typeof window !== 'undefined') {
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${reportName}_${new Date().toISOString().split('T')[0]}.${format}`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        // 3. Log the export operation into the backend audit logs repository
        const record = await ReportRepository.createExport({
            name: `${reportName}_تصدير`,
            format,
            status: 'success',
            url,
            sizeBytes
        });

        return record;
    },

    /**
     * Formats headers and rows into standard CSV string
     */
    generateCSV: (headers, dataRows, fields) => {
        const headerRow = headers.join(',');
        const bodyRows = dataRows.map(row => {
            return fields.map(f => {
                const cell = row[f] === undefined || row[f] === null ? '' : String(row[f]);
                // Escape quotes and commas
                if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
                    return `"${cell.replace(/"/g, '""')}"`;
                }
                return cell;
            }).join(',');
        });
        return [headerRow, ...bodyRows].join('\n');
    }
};

export default ExportEngine;
