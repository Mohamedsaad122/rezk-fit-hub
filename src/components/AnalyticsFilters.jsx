import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, CalendarDays, FileText, Table } from "lucide-react";

export function AnalyticsFilters({ 
    filter, 
    onFilterChange, 
    onExportCSV, 
    onExportExcel, 
    onExportPDF, 
    isExporting 
}) {
    return (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-card border border-border/80 rounded-2xl p-4 shadow-sm text-right rtl">
            {/* Range Select */}
            <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-primary" />
                <Select value={filter} onValueChange={onFilterChange}>
                    <SelectTrigger className="w-[180px] h-9 text-xs rounded-xl bg-background border-border">
                        <SelectValue placeholder="اختر الفترة الزمنية" />
                    </SelectTrigger>
                    <SelectContent className="text-xs">
                        <SelectItem value="Today">اليوم</SelectItem>
                        <SelectItem value="Yesterday">أمس</SelectItem>
                        <SelectItem value="This Week">هذا الأسبوع</SelectItem>
                        <SelectItem value="This Month">هذا الشهر</SelectItem>
                        <SelectItem value="Last Month">الشهر الماضي</SelectItem>
                        <SelectItem value="Last 3 Months">آخر 3 أشهر</SelectItem>
                        <SelectItem value="This Year">هذا العام</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Export buttons row */}
            <div className="flex flex-wrap items-center gap-2">
                <Button 
                    onClick={onExportCSV} 
                    disabled={isExporting}
                    variant="outline" 
                    size="sm" 
                    className="h-9 px-3 text-[11px] rounded-xl flex items-center gap-1.5"
                >
                    <Download className="w-3.5 h-3.5" />
                    <span>تصدير CSV</span>
                </Button>

                <Button 
                    onClick={onExportExcel} 
                    disabled={isExporting}
                    variant="outline" 
                    size="sm" 
                    className="h-9 px-3 text-[11px] rounded-xl flex items-center gap-1.5"
                >
                    <Table className="w-3.5 h-3.5" />
                    <span>تصدير Excel</span>
                </Button>

                <Button 
                    onClick={onExportPDF} 
                    disabled={isExporting}
                    variant="outline" 
                    size="sm" 
                    className="h-9 px-3 text-[11px] rounded-xl flex items-center gap-1.5"
                >
                    <FileText className="w-3.5 h-3.5" />
                    <span>تصدير PDF</span>
                </Button>
            </div>
        </div>
    );
}

export default AnalyticsFilters;
