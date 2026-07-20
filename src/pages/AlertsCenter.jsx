import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import SEO from '@/components/SEO';
import { useAlerts } from '@/hooks/use-alerts';
import AlertCard from '@/components/AlertCard';
import AlertTimeline from '@/components/AlertTimeline';
import { AlertTriangle, Clock } from 'lucide-react';

export const AlertsCenter = () => {
    const { alerts, resolveAlert } = useAlerts();

    const activeAlerts = alerts.filter(a => a.status === 'Active');

    return (
        <div className="container mx-auto p-6 space-y-6 text-right" dir="rtl">
            <SEO title="مركز إدارة التنبيهات" />

            <div className="space-y-1">
                <h1 className="text-2xl font-bold text-foreground">مركز إدارة التنبيهات (Alerts Center)</h1>
                <p className="text-sm text-muted-foreground">مراقبة وحل مشاكل وتنبيهات الخوادم والاتصالات بشكل فوري.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border border-border/40">
                        <CardHeader className="text-right">
                            <CardTitle className="text-base font-bold text-foreground flex items-center gap-2 justify-end">
                                <AlertTriangle className="h-4 w-4 text-rose-500 animate-pulse" />
                                <span>التنبيهات النشطة الفورية ({activeAlerts.length})</span>
                            </CardTitle>
                            <CardDescription>التنبيهات الفنية التي تحتاج لتدخل سريع لحل مشكلات المنصة</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {activeAlerts.length === 0 ? (
                                <div className="text-center py-6 text-xs text-zinc-500">لا توجد تنبيهات نشطة حالياً. جميع الأنظمة مستقرة.</div>
                            ) : (
                                activeAlerts.map(alert => (
                                    <AlertCard key={alert.id} alert={alert} onResolve={resolveAlert} />
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="border border-border/40">
                        <CardHeader className="text-right">
                            <CardTitle className="text-base font-bold text-foreground flex items-center gap-2 justify-end">
                                <Clock className="h-4 w-4 text-primary" />
                                <span>سجل تاريخ التنبيهات المنجزة</span>
                            </CardTitle>
                            <CardDescription>أحدث الإخطارات التي تم إطلاقها وحلها</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AlertTimeline alerts={alerts} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AlertsCenter;
