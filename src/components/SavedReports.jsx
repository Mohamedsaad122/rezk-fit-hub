import React, { useState } from 'react';
import { useReports, useReportTemplates, useReportSchedules, useReportsExports } from '@/hooks/use-reports';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toastService } from '@/services/toast.service';
import { Play, Trash2, Download, Clock, Star, Copy } from 'lucide-react';

export const SavedReports = () => {
    const { reports, deleteReport, updateReport } = useReports();
    const { templates } = useReportTemplates();
    const { schedules, deleteSchedule, triggerScheduleRun } = useReportSchedules();
    const { exports } = useReportsExports();
    const [activeTab, setActiveTab] = useState('saved'); // 'saved' | 'templates' | 'schedules' | 'exports'

    const handleToggleFavorite = async (report) => {
        try {
            await updateReport({
                id: report.id,
                data: { isFavorite: !report.isFavorite }
            });
            toastService.success(report.isFavorite ? 'تمت الإزالة من المفضلة' : 'تمت الإضافة للمفضلة');
        } catch (error) {
            console.error(error);
            toastService.error('فشل في تحديث حالة المفضلة');
        }
    };

    const handleDeleteReport = async (id) => {
        try {
            await deleteReport(id);
            toastService.success('تم حذف التقرير بنجاح');
        } catch (error) {
            console.error(error);
            toastService.error('فشل في حذف التقرير');
        }
    };

    const handleDeleteSchedule = async (id) => {
        try {
            await deleteSchedule(id);
            toastService.success('تم حذف الجدولة بنجاح');
        } catch (error) {
            console.error(error);
            toastService.error('فشل في حذف الجدولة');
        }
    };

    const handleRunSchedule = async (id) => {
        try {
            await triggerScheduleRun(id);
            toastService.success('تم تشغيل المجدول وإرسال التنبيهات بنجاح');
        } catch (error) {
            console.error(error);
            toastService.error('فشل في تشغيل التقرير المجدول');
        }
    };

    return (
        <div className="space-y-6" dir="rtl">
            {/* Tabs List */}
            <div className="flex gap-2 border-b border-border pb-px overflow-x-auto">
                <button
                    onClick={() => setActiveTab('saved')}
                    className={`pb-3 px-4 font-semibold text-sm transition-all border-b-2 whitespace-nowrap ${
                        activeTab === 'saved'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                >
                    التقارير المحفوظة ({reports.length})
                </button>
                <button
                    onClick={() => setActiveTab('templates')}
                    className={`pb-3 px-4 font-semibold text-sm transition-all border-b-2 whitespace-nowrap ${
                        activeTab === 'templates'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                >
                    قوالب النظام ({templates.length})
                </button>
                <button
                    onClick={() => setActiveTab('schedules')}
                    className={`pb-3 px-4 font-semibold text-sm transition-all border-b-2 whitespace-nowrap ${
                        activeTab === 'schedules'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                >
                    التقارير المجدولة ({schedules.length})
                </button>
                <button
                    onClick={() => setActiveTab('exports')}
                    className={`pb-3 px-4 font-semibold text-sm transition-all border-b-2 whitespace-nowrap ${
                        activeTab === 'exports'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                >
                    سجل التنزيلات والتصدير ({exports.length})
                </button>
            </div>

            {/* Saved Reports View */}
            {activeTab === 'saved' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reports.length === 0 ? (
                        <p className="text-muted-foreground text-sm col-span-2 py-8 text-center">لا توجد تقارير محفوظة بعد.</p>
                    ) : (
                        reports.map((report) => (
                            <Card key={report.id} className="border border-border">
                                <CardHeader className="text-right pb-3">
                                    <div className="flex items-center justify-between flex-row-reverse">
                                        <button
                                            onClick={() => handleToggleFavorite(report)}
                                            className={`text-muted-foreground hover:text-yellow-500 transition-colors ${
                                                report.isFavorite ? 'text-yellow-500' : ''
                                            }`}
                                        >
                                            <Star className="h-5 w-5 fill-current" />
                                        </button>
                                        <CardTitle className="text-base font-bold text-foreground">{report.name}</CardTitle>
                                    </div>
                                    <CardDescription className="text-xs">
                                        تاريخ الإنشاء: {new Date(report.createdAt).toLocaleDateString('ar-EG')} | القسم: {report.module}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex justify-start gap-2 pt-0">
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDeleteReport(report.id)}
                                        className="h-8 flex items-center gap-1.5"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        حذف
                                    </Button>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            )}

            {/* Templates View */}
            {activeTab === 'templates' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {templates.map((template) => (
                        <Card key={template.id} className="border border-border hover:bg-muted/10 transition-colors">
                            <CardHeader className="text-right">
                                <CardTitle className="text-base font-bold text-foreground flex items-center gap-2 flex-row-reverse justify-end">
                                    <Copy className="h-4 w-4 text-primary" />
                                    {template.name}
                                </CardTitle>
                                <CardDescription className="text-xs mt-2 leading-relaxed">
                                    {template.description}
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            )}

            {/* Schedules View */}
            {activeTab === 'schedules' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {schedules.length === 0 ? (
                        <p className="text-muted-foreground text-sm col-span-2 py-8 text-center">لا توجد تقارير مجدولة مفعلة.</p>
                    ) : (
                        schedules.map((schedule) => (
                            <Card key={schedule.id} className="border border-border">
                                <CardHeader className="text-right pb-3">
                                    <div className="flex items-center justify-between flex-row-reverse">
                                        <Clock className="h-5 w-5 text-primary" />
                                        <CardTitle className="text-base font-bold text-foreground">{schedule.name}</CardTitle>
                                    </div>
                                    <CardDescription className="text-xs space-y-1 mt-2">
                                        <div>نوع التكرار: {schedule.schedule === 'daily' ? 'يومي' : schedule.schedule === 'weekly' ? 'أسبوعي' : 'شهري'}</div>
                                        <div>المستلمين: {schedule.recipients.join(', ')}</div>
                                        <div>توقيت التشغيل القادم: {schedule.nextRun ? new Date(schedule.nextRun).toLocaleDateString('ar-EG') : '-'}</div>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex justify-start gap-2 pt-0">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleRunSchedule(schedule.id)}
                                        className="h-8 flex items-center gap-1.5"
                                    >
                                        <Play className="h-4 w-4" />
                                        تشغيل الآن
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDeleteSchedule(schedule.id)}
                                        className="h-8 flex items-center gap-1.5"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        حذف
                                    </Button>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            )}

            {/* Exports logs View */}
            {activeTab === 'exports' && (
                <div className="overflow-x-auto rounded-lg border border-border bg-card">
                    <table className="w-full text-right text-sm border-collapse" dir="rtl">
                        <thead>
                            <tr className="bg-muted/40 border-b border-border">
                                <th className="p-3 font-semibold text-muted-foreground">اسم الملف</th>
                                <th className="p-3 font-semibold text-muted-foreground">الصيغة</th>
                                <th className="p-3 font-semibold text-muted-foreground">الحجم</th>
                                <th className="p-3 font-semibold text-muted-foreground">التوقيت</th>
                                <th className="p-3 font-semibold text-muted-foreground">الرابط</th>
                            </tr>
                        </thead>
                        <tbody>
                            {exports.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-muted-foreground text-sm">
                                        لا توجد تنزيلات سابقة في السجل.
                                    </td>
                                </tr>
                            ) : (
                                exports.map((exp) => (
                                    <tr key={exp.id} className="border-b border-border/40 last:border-b-0 hover:bg-muted/30 transition-colors">
                                        <td className="p-3 font-medium text-foreground">{exp.name}</td>
                                        <td className="p-3 uppercase">
                                            <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                                exp.format === 'pdf' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                            }`}>
                                                {exp.format}
                                            </span>
                                        </td>
                                        <td className="p-3 text-muted-foreground">{(exp.sizeBytes / 1024).toFixed(1)} KB</td>
                                        <td className="p-3 text-muted-foreground">
                                            {new Date(exp.generatedAt).toLocaleDateString('ar-EG')}
                                        </td>
                                        <td className="p-3">
                                            <a
                                                href={exp.url || '#'}
                                                download={`${exp.name}.${exp.format}`}
                                                className="text-primary hover:underline flex items-center gap-1.5 justify-start text-xs font-semibold"
                                            >
                                                <Download className="h-3.5 w-3.5" />
                                                تنزيل الملف
                                            </a>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default SavedReports;
