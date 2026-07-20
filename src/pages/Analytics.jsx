import React, { useState } from "react";
import { useAnalytics } from "@/hooks/use-analytics";
import SEO from "@/components/SEO";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorState } from "@/components/ErrorState";
import { StatisticsGrid } from "@/components/StatisticsGrid";
import { AnalyticsFilters } from "@/components/AnalyticsFilters";
import { ClientGrowthChart } from "@/components/ClientGrowthChart";
import { RevenueChart } from "@/components/RevenueChart";
import { TaskCompletionChart } from "@/components/TaskCompletionChart";
import { WorkoutDistributionChart } from "@/components/WorkoutDistributionChart";
import { NutritionDistributionChart } from "@/components/NutritionDistributionChart";
import { AttendanceChart } from "@/components/AttendanceChart";
import { TopPerformersCard } from "@/components/TopPerformersCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { exportCSV, exportExcel, exportPDF } from "@/utils/analytics-utils";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Cpu } from "lucide-react";
import { usePresenceStore } from "@/store/presence.store";
import { PresenceAvatar } from "@/components/PresenceAvatar";
import { CommentEngine } from "@/components/CommentEngine";
import { ActivityTimeline } from "@/components/ActivityTimeline";

export default function Analytics() {
    const [filter, setFilter] = useState("This Month");
    const { data: analytics, isLoading, isError, refetch, isFetching } = useAnalytics({ range: filter });
    const [isExporting, setIsExporting] = useState(false);

    const { onlineUsers } = usePresenceStore();
    const onlineCoaches = Object.entries(onlineUsers)
        .map(([id, u]) => ({ id: Number(id), ...u }))
        .filter(u => u.status === 'online');

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[500px] bg-background">
                <LoadingSpinner message="جاري إعداد تقارير الأعمال وتجميع التحليلات..." />
            </div>
        );
    }

    if (isError || !analytics) {
        return (
            <div className="p-6 max-w-4xl mx-auto pt-28">
                <ErrorState 
                    onRetry={refetch} 
                    title="عذراً، حدث خطأ أثناء تحميل البيانات الإحصائية" 
                    message="يرجى المحاولة مرة أخرى أو التحقق من اتصال الشبكة." 
                />
            </div>
        );
    }

    const { kpis = {}, kpiTrends = {}, charts = {}, topPerformers = {}, forecasts = {} } = analytics;

    // Build data exports mapping
    const handleExportCSV = async () => {
        setIsExporting(true);
        try {
            const clientExport = charts.clientGrowth.map(c => ({
                "الشهر": c.name,
                "المشتركين الجدد": c.clients,
                "نسبة النمو مقارنة بالشهر السابق (%)": kpiTrends.totalClients || 8
            }));
            exportCSV(clientExport, `تقرير_المشتركين_${filter}.csv`);
        } finally {
            setIsExporting(false);
        }
    };

    const handleExportExcel = async () => {
        setIsExporting(true);
        try {
            const revenueExport = charts.revenue.map(r => ({
                "الشهر": r.name,
                "الإيرادات بالريال": r.revenue
            }));
            exportExcel(revenueExport, `تقرير_الإيرادات_${filter}.xls`);
        } finally {
            setIsExporting(false);
        }
    };

    const handleExportPDF = async () => {
        setIsExporting(true);
        try {
            exportPDF({ kpis, forecasts }, `تقرير_الملخص_التنفيذي_${filter}.pdf`);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="min-h-full bg-gradient-to-br from-background via-muted/20 to-background pt-28 pb-12 px-6 text-right rtl">
            <SEO title="تحليلات الأعمال والذكاء الاصطناعي — Rezk Fit Hub" />

            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header title */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center justify-between w-full flex-row-reverse">
                        <div className="flex items-center gap-2 flex-row-reverse">
                            <div className="flex -space-x-1.5 flex-row-reverse pl-2">
                                {onlineCoaches.slice(0, 3).map((u) => (
                                    <PresenceAvatar key={u.id} userId={u.id} avatar={u.id === 2 ? '👨' : (u.id === 3 ? '👩' : '🍎')} size="sm" className="border-2 border-background" />
                                ))}
                            </div>
                            {onlineCoaches.length > 0 && (
                                <span className="text-xs text-muted-foreground font-semibold">نشط الآن: {onlineCoaches.length} مستخدمين</span>
                            )}
                        </div>
                        <div className="text-right">
                            <h1 className="text-3xl font-bold text-foreground">التحليلات الذكية وتقارير BI</h1>
                            <p className="text-muted-foreground mt-1">متابعة مؤشرات الأداء الرئيسي وتوقعات النمو المستقبلي للنادي</p>
                        </div>
                    </div>

                    {isFetching && (
                        <Badge className="bg-primary/20 hover:bg-primary/30 text-primary border-0 text-xs px-3 py-1 font-sans animate-pulse">
                            جاري تحديث البيانات...
                        </Badge>
                    )}
                </div>

                {/* Filters Row */}
                <AnalyticsFilters 
                    filter={filter}
                    onFilterChange={setFilter}
                    onExportCSV={handleExportCSV}
                    onExportExcel={handleExportExcel}
                    onExportPDF={handleExportPDF}
                    isExporting={isExporting}
                />

                {/* KPIs Stats Grid */}
                <StatisticsGrid kpis={kpis} trends={kpiTrends} />

                {/* Grid charts row 1 */}
                <div className="grid lg:grid-cols-2 gap-6">
                    <ClientGrowthChart data={charts.clientGrowth} />
                    <RevenueChart data={charts.revenue} />
                </div>

                {/* Grid charts row 2 */}
                <div className="grid lg:grid-cols-2 gap-6">
                    <TaskCompletionChart data={charts.taskCompletion} />
                    <WorkoutDistributionChart data={charts.workoutDistribution} />
                </div>

                {/* Grid charts row 3 */}
                <div className="grid lg:grid-cols-2 gap-6">
                    <NutritionDistributionChart data={charts.nutritionComplianceTrend} />
                    <AttendanceChart data={charts.attendance} />
                </div>

                {/* Predictive analytics & Leaderboard lists */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Forecast section */}
                    <Card className="lg:col-span-2 border-0 shadow-md bg-gradient-card">
                        <CardHeader className="text-right pb-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                                        <Cpu className="w-5 h-5 text-primary animate-pulse" />
                                        <span>التوقعات والنمو بالذكاء الاصطناعي</span>
                                    </CardTitle>
                                    <CardDescription className="text-xs text-muted-foreground">التوقعات الرياضية والتنظيمية للشهر القادم بناءً على النماذج الخطية</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                            {/* Forecast metrics list */}
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="p-4 bg-muted/20 border border-border/60 rounded-2xl text-right">
                                    <span className="text-[10px] text-muted-foreground block mb-1">النمو المتوقع للمشتركين (الشهر القادم)</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl font-black font-sans text-primary">
                                            +{forecasts.clientGrowth?.[forecasts.clientGrowth.length - 1]?.forecast || 0}
                                        </span>
                                        <Badge variant="outline" className="text-[10px] font-sans border-emerald-200 text-emerald-600 dark:border-emerald-950 dark:text-emerald-400">
                                            توقع نمو خطي
                                        </Badge>
                                    </div>
                                    <p className="text-[9px] text-muted-foreground mt-2">
                                        استناداً إلى متوسط الزيادة الشهرية وسجل الأشهر الماضية.
                                    </p>
                                </div>

                                <div className="p-4 bg-muted/20 border border-border/60 rounded-2xl text-right">
                                    <span className="text-[10px] text-muted-foreground block mb-1">اللقاءات وجلسات التدريب المتوقعة</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl font-black font-sans text-purple-600">
                                            {forecasts.appointments?.[forecasts.appointments.length - 1]?.forecast || 0}
                                        </span>
                                        <Badge variant="outline" className="text-[10px] font-sans border-purple-200 text-purple-600 dark:border-purple-950 dark:text-purple-400">
                                            توقع SMA
                                        </Badge>
                                    </div>
                                    <p className="text-[9px] text-muted-foreground mt-2">
                                        توقع الحجوزات بناءً على معدل حجز الجلسات الأسبوعي.
                                    </p>
                                </div>
                            </div>

                            {/* Brief summary insights list */}
                            <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 text-xs leading-relaxed text-foreground">
                                <h4 className="font-bold flex items-center gap-1 text-primary mb-1">
                                    <TrendingUp className="w-4 h-4" />
                                    <span>توصية تحليلية ذكية:</span>
                                </h4>
                                تشير قراءة المنحنى الخطي إلى إمكانية ارتفاع المشتركين النشطين بنسبة تقارب 8% الشهر القادم. ينصح بزيادة تخصيص المدربين للمواعيد الصباحية لاستيعاب الضغط المتوقع.
                            </div>
                        </CardContent>
                    </Card>

                    {/* Leaderboard lists */}
                    <TopPerformersCard topPerformers={topPerformers} />
                </div>

                {/* Sprint 4.4 Analytics Collaboration: Comments & Timelines */}
                <div className="grid lg:grid-cols-3 gap-6 pt-6">
                    <Card className="lg:col-span-2 border border-border shadow-md bg-card">
                        <CardHeader className="text-right pb-2 border-b">
                            <CardTitle className="text-base font-bold text-foreground">النقاش والتعليقات حول تقارير BI</CardTitle>
                            <CardDescription className="text-xs text-muted-foreground">تبادل الملاحظات والتوصيات التحليلية بين أعضاء الإدارة والمدربين.</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <CommentEngine entityType="Analytics" entityId="dashboard" />
                        </CardContent>
                    </Card>
                    <Card className="border border-border shadow-md bg-card">
                        <CardHeader className="text-right pb-2 border-b">
                            <CardTitle className="text-base font-bold text-foreground flex items-center gap-2 justify-end">
                                <span>سجل النشاطات الفورية للتقارير</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <ActivityTimeline entityType="Analytics" entityId="dashboard" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
