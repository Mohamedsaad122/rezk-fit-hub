import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Users, Coins, CalendarCheck, Cpu, HardDrive, Hourglass, ZapOff } from 'lucide-react';

export const MonitoringWidgets = ({ metrics }) => {
    if (!metrics) return null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4" dir="rtl">
            {/* Widget 1: Users */}
            <Card className="border border-border">
                <CardContent className="p-4 flex items-center gap-4 flex-row-reverse text-right">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/20 text-blue-600 rounded-lg">
                        <Users className="h-6 w-6" />
                    </div>
                    <div className="space-y-0.5">
                        <p className="text-xs font-semibold text-muted-foreground">المستخدمين النشطين</p>
                        <h3 className="text-2xl font-bold text-foreground">{metrics.activeUsers}</h3>
                        <p className="text-[10px] text-muted-foreground">
                            {metrics.activeCoaches} مدربين | {metrics.onlineStaff} موظفين
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Widget 2: Today Revenue */}
            <Card className="border border-border">
                <CardContent className="p-4 flex items-center gap-4 flex-row-reverse text-right">
                    <div className="p-3 bg-green-100 dark:bg-green-900/20 text-green-600 rounded-lg">
                        <Coins className="h-6 w-6" />
                    </div>
                    <div className="space-y-0.5">
                        <p className="text-xs font-semibold text-muted-foreground">مبيعات اليوم</p>
                        <h3 className="text-2xl font-bold text-foreground">{metrics.todayRevenue} <span className="text-xs">SAR</span></h3>
                        <p className="text-[10px] text-muted-foreground">حسب بوابة الاشتراك الفوري</p>
                    </div>
                </CardContent>
            </Card>

            {/* Widget 3: Sessions */}
            <Card className="border border-border">
                <CardContent className="p-4 flex items-center gap-4 flex-row-reverse text-right">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900/20 text-purple-600 rounded-lg">
                        <CalendarCheck className="h-6 w-6" />
                    </div>
                    <div className="space-y-0.5">
                        <p className="text-xs font-semibold text-muted-foreground">الحجوزات القادمة اليوم</p>
                        <h3 className="text-2xl font-bold text-foreground">{metrics.upcomingSessions}</h3>
                        <p className="text-[10px] text-muted-foreground">حصص تدريب وتغذية مجدولة</p>
                    </div>
                </CardContent>
            </Card>

            {/* Widget 4: System Load */}
            <Card className="border border-border">
                <CardContent className="p-4 space-y-3 text-right">
                    <div className="flex items-center justify-between flex-row-reverse">
                        <span className="text-xs font-semibold text-muted-foreground">ضغط المعالج (CPU)</span>
                        <Cpu className="h-4 w-4 text-orange-500" />
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-end justify-between flex-row-reverse">
                            <span className="text-lg font-bold text-foreground">{metrics.systemLoad}%</span>
                            <span className="text-[10px] text-muted-foreground">سيرفر الإنتاج الرئيسي</span>
                        </div>
                        <Progress value={metrics.systemLoad} className="h-1.5 bg-muted" />
                    </div>
                </CardContent>
            </Card>

            {/* Widget 5: Storage */}
            <Card className="border border-border">
                <CardContent className="p-4 space-y-3 text-right">
                    <div className="flex items-center justify-between flex-row-reverse">
                        <span className="text-xs font-semibold text-muted-foreground">استخدام القرص (Storage)</span>
                        <HardDrive className="h-4 w-4 text-emerald-500" />
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-end justify-between flex-row-reverse">
                            <span className="text-lg font-bold text-foreground">{metrics.storageUsage}%</span>
                            <span className="text-[10px] text-muted-foreground">باقة التخزين السحابي</span>
                        </div>
                        <Progress value={metrics.storageUsage} className="h-1.5 bg-muted" />
                    </div>
                </CardContent>
            </Card>

            {/* Performance Indicators Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 col-span-1 sm:col-span-2 lg:col-span-5 border-t border-border pt-4">
                {/* Latency */}
                <div className="bg-muted/30 p-3 rounded-lg border border-border flex items-center justify-between flex-row-reverse text-right">
                    <div className="space-y-0.5">
                        <p className="text-[10px] text-muted-foreground">متوسط سرعة استجابة الخادم</p>
                        <h4 className="text-sm font-bold text-foreground">{metrics.apiResponseTime}ms</h4>
                    </div>
                    <Hourglass className="h-5 w-5 text-muted-foreground" />
                </div>

                {/* Queue */}
                <div className="bg-muted/30 p-3 rounded-lg border border-border flex items-center justify-between flex-row-reverse text-right">
                    <div className="space-y-0.5">
                        <p className="text-[10px] text-muted-foreground">المهام المنتظرة في الطابور</p>
                        <h4 className="text-sm font-bold text-foreground">{metrics.queueSize} مهام</h4>
                    </div>
                    <Hourglass className="h-5 w-5 text-muted-foreground" />
                </div>

                {/* Failed */}
                <div className="bg-muted/30 p-3 rounded-lg border border-border flex items-center justify-between flex-row-reverse text-right">
                    <div className="space-y-0.5">
                        <p className="text-[10px] text-muted-foreground">طلبات الخادم الفاشلة (اليوم)</p>
                        <h4 className="text-sm font-bold text-foreground text-red-500">{metrics.failedRequests} طلبات</h4>
                    </div>
                    <ZapOff className="h-5 w-5 text-red-500" />
                </div>
            </div>
        </div>
    );
};

export default MonitoringWidgets;
