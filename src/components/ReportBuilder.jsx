import React, { useState, useEffect, useTransition, useCallback } from 'react';
import { useReports } from '@/hooks/use-reports';
import { ReportBuilder as ReportBuilderService } from '@/services/report-builder';
import { ReportFilters } from './ReportFilters';
import { ReportViewer } from './ReportViewer';
import { ExportDialog } from './ExportDialog';
import { ScheduleReportDialog } from './ScheduleReportDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toastService } from '@/services/toast.service';
import { Save, Download, Clock, Play, FileText } from 'lucide-react';

const MODULES = [
    { key: 'Clients', label: 'المشتركين (Clients)' },
    { key: 'Calendar', label: 'الحجوزات والمواعيد (Calendar)' },
    { key: 'Tasks', label: 'المهام الإدارية (Tasks)' },
    { key: 'Nutrition', label: 'خطط التغذية (Nutrition)' },
    { key: 'Exercises', label: 'تمارين التدريب (Exercises)' },
    { key: 'Messages', label: 'رسائل النظام (Messages)' },
    { key: 'Analytics', label: 'البيانات المالية (Analytics)' },
    { key: 'Documents', label: 'الملفات والمستندات (Documents)' },
    { key: 'Audit Logs', label: 'سجلات العمليات (Audit Logs)' },
    { key: 'Notifications', label: 'تنبيهات المستخدمين (Notifications)' }
];

export const ReportBuilder = () => {
    const [module, setModule] = useState('Clients');
    const [filters, setFilters] = useState({});
    const [sorting, setSorting] = useState({ field: 'id', order: 'desc' });
    const [grouping] = useState('');
    const [reportName, setReportName] = useState('تقرير المشتركين المخصص');
    const [dataRows, setDataRows] = useState([]);
    const [fields, setFields] = useState([]);
    const [headers, setHeaders] = useState([]);
    const [isPending, startTransition] = useTransition();

    const [isExportOpen, setIsExportOpen] = useState(false);
    const [isScheduleOpen, setIsScheduleOpen] = useState(false);

    const { createReport } = useReports();

    // Regenerate default report name when module changes
    useEffect(() => {
        const modLabel = MODULES.find(m => m.key === module)?.label || module;
        setReportName(`تقرير مخصص لـ ${modLabel}`);
        setFilters({});
        // Set default sorting field based on module
        if (module === 'Analytics') {
            setSorting({ field: 'date', order: 'desc' });
        } else if (module === 'Audit Logs') {
            setSorting({ field: 'date', order: 'desc' });
        } else {
            setSorting({ field: 'id', order: 'desc' });
        }
    }, [module]);

    // Handle preview generation
    const handleGenerate = useCallback(() => {
        startTransition(() => {
            const rows = ReportBuilderService.generateReportData(
                module,
                filters,
                sorting.field ? sorting : null,
                grouping || null
            );
            setDataRows(rows);

            if (rows.length > 0) {
                const keys = Object.keys(rows[0]).filter(k => k !== 'id');
                setFields(keys);
                setHeaders(keys.map(k => k.toUpperCase()));
            } else {
                setFields(['name']);
                setHeaders(['NAME']);
            }
            toastService.success('تم توليد معاينة التقرير');
        });
    }, [module, filters, sorting, grouping]);

    // Auto-generate preview on mount
    useEffect(() => {
        handleGenerate();
    }, [handleGenerate]);

    const handleSaveReport = async () => {
        if (!reportName.trim()) {
            toastService.error('الرجاء إدخال اسم للتقرير');
            return;
        }

        try {
            await createReport({
                name: reportName,
                module,
                filters,
                sorting,
                grouping: grouping || null,
                data: dataRows.slice(0, 5), // Save a small snapshot
                isFavorite: false,
                isTemplate: false
            });
            toastService.success('تم حفظ التقرير في القائمة بنجاح');
        } catch (error) {
            console.error(error);
            toastService.error('فشل في حفظ التقرير');
        }
    };

    return (
        <div className="space-y-6" dir="rtl">
            <Card className="border border-border">
                <CardHeader className="text-right">
                    <CardTitle className="text-xl font-bold text-foreground">منشئ التقارير التفاعلي</CardTitle>
                    <CardDescription>قم ببناء وتصفية وتصدير تقارير مخصصة لكل أقسام النظام.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Controls Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-muted-foreground block">القسم المستهدف</label>
                            <select
                                value={module}
                                onChange={(e) => setModule(e.target.value)}
                                className="w-full p-2.5 rounded-lg border border-input bg-background text-sm"
                            >
                                {MODULES.map(m => (
                                    <option key={m.key} value={m.key}>{m.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1 md:col-span-2">
                            <label className="text-xs font-semibold text-muted-foreground block">عنوان التقرير</label>
                            <input
                                type="text"
                                value={reportName}
                                onChange={(e) => setReportName(e.target.value)}
                                className="w-full p-2.5 rounded-lg border border-input bg-background text-sm"
                                placeholder="مثال: تقرير المتدربين النشطين"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-muted-foreground block">الفرز والترتيب</label>
                            <div className="flex gap-2">
                                <select
                                    value={sorting.field}
                                    onChange={(e) => setSorting({ ...sorting, field: e.target.value })}
                                    className="flex-1 p-2.5 rounded-lg border border-input bg-background text-sm"
                                >
                                    <option value="id">المعرف (ID)</option>
                                    {fields.map(f => (
                                        <option key={f} value={f}>{f}</option>
                                    ))}
                                </select>
                                <select
                                    value={sorting.order}
                                    onChange={(e) => setSorting({ ...sorting, order: e.target.value })}
                                    className="p-2.5 rounded-lg border border-input bg-background text-sm"
                                >
                                    <option value="desc">تنازلي</option>
                                    <option value="asc">تصاعدي</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Dynamic Filters */}
                    <div className="border-t border-border pt-4">
                        <ReportFilters module={module} filters={filters} onChange={setFilters} />
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center justify-start gap-3 border-t border-border pt-4">
                        <Button onClick={handleGenerate} disabled={isPending} className="flex items-center gap-2">
                            <Play className="h-4 w-4" />
                            تحديث المعاينة
                        </Button>
                        <Button variant="outline" onClick={handleSaveReport} className="flex items-center gap-2">
                            <Save className="h-4 w-4" />
                            حفظ التقرير
                        </Button>
                        <Button variant="outline" onClick={() => setIsExportOpen(true)} className="flex items-center gap-2">
                            <Download className="h-4 w-4" />
                            تصدير فوري
                        </Button>
                        <Button variant="outline" onClick={() => setIsScheduleOpen(true)} className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            جدولة الإرسال
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Preview Section */}
            <Card className="border border-border">
                <CardHeader className="text-right flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2 text-foreground">
                        <FileText className="h-5 w-5 text-primary" />
                        معاينة نتائج التقرير ({dataRows.length} صفوف)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ReportViewer dataRows={dataRows} fields={fields} />
                </CardContent>
            </Card>

            {/* Modals */}
            <ExportDialog
                open={isExportOpen}
                onOpenChange={setIsExportOpen}
                reportName={reportName}
                headers={headers}
                dataRows={dataRows}
                fields={fields}
            />

            <ScheduleReportDialog
                open={isScheduleOpen}
                onOpenChange={setIsScheduleOpen}
                initialModule={module}
                initialFilters={filters}
            />
        </div>
    );
};

export default ReportBuilder;
