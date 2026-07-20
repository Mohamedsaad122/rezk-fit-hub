/**
 * Utilities to generate and export analytics files (CSV, Excel, PDF).
 */

/**
 * Trigger browser file downloads of text blob streams.
 */
const triggerDownload = (content, fileName, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

/**
 * Exports flat JSON array objects to CSV.
 */
export const exportCSV = (data, fileName = "analytics_report.csv") => {
    if (!Array.isArray(data) || data.length === 0) return false;

    const headers = Object.keys(data[0]);
    const csvRows = [];
    
    // Add BOM header for correct Arabic encoding inside Excel
    csvRows.push("\ufeff" + headers.join(","));

    for (const row of data) {
        const values = headers.map(header => {
            const val = row[header] === null || row[header] === undefined ? "" : row[header];
            const escaped = ("" + val).replace(/"/g, '""');
            return `"${escaped}"`;
        });
        csvRows.push(values.join(","));
    }

    const csvContent = csvRows.join("\n");
    triggerDownload(csvContent, fileName, "text/csv;charset=utf-8;");
    return true;
};

/**
 * Exports flat JSON data to a simulated Excel format (XML Spreadsheet or tab-delimited text).
 */
export const exportExcel = (data, fileName = "analytics_report.xls") => {
    if (!Array.isArray(data) || data.length === 0) return false;

    const headers = Object.keys(data[0]);
    let excelContent = "\ufeff" + headers.join("\t") + "\n";

    for (const row of data) {
        const values = headers.map(header => {
            const val = row[header] === null || row[header] === undefined ? "" : row[header];
            return ("" + val).replace(/\t/g, ' ');
        });
        excelContent += values.join("\t") + "\n";
    }

    triggerDownload(excelContent, fileName, "application/vnd.ms-excel;charset=utf-8;");
    return true;
};

/**
 * Generates a mock summary PDF report as formatted text.
 */
export const exportPDF = (data, fileName = "analytics_report.pdf") => {
    if (!data) return false;

    const { kpis = {}, forecasts = {} } = data;

    let content = `--------------------------------------------------\n`;
    content += `         REZK FIT HUB - BUSINESS REPORT\n`;
    content += `              تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}\n`;
    content += `--------------------------------------------------\n\n`;

    content += `1. المؤشرات الرئيسية للأداء (KPIs):\n`;
    content += `==================================\n`;
    content += `- إجمالي المتدربين: ${kpis.totalClients || 0}\n`;
    content += `- المتدربون النشطون: ${kpis.activeClients || 0}\n`;
    content += `- الجلسات واللقاءات: ${kpis.appointments || 0}\n`;
    content += `- المهام المكتملة: ${kpis.completedTasks || 0}\n`;
    content += `- نسبة الالتزام بالتغذية: ${kpis.nutritionCompliance || 0}%\n`;
    content += `- نسبة الالتزام بالتمارين: ${kpis.workoutCompletion || 0}%\n`;
    content += `- معدل استبقاء المتدربين: ${kpis.retentionRate || 0}%\n\n`;

    content += `2. التوقعات والتنبؤات للمستقبل (Forecasts):\n`;
    content += `=========================================\n`;
    if (forecasts.clientGrowth && forecasts.clientGrowth.length > 0) {
        const nextGrow = forecasts.clientGrowth[forecasts.clientGrowth.length - 1];
        content += `- نمو المتدربين المتوقع (${nextGrow.period}): ${nextGrow.forecast} متدرب\n`;
    }
    if (forecasts.appointments && forecasts.appointments.length > 0) {
        const nextApt = forecasts.appointments[forecasts.appointments.length - 1];
        content += `- اللقاءات المتوقع جدولتها (${nextApt.period}): ${nextApt.forecast} موعد\n`;
    }

    content += `\n\n--------------------------------------------------\n`;
    content += `Rezk Fit Hub © 2026 - نظام الإدارة والتحليلات الذكي\n`;
    content += `--------------------------------------------------\n`;

    triggerDownload(content, fileName, "application/pdf");
    return true;
};
