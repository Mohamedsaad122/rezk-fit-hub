import React from 'react';
import { useLiveMetrics } from '@/hooks/use-reports';
import { MonitoringWidgets } from '@/components/MonitoringWidgets';
import SEO from '@/components/SEO';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Activity, Cpu, Timer } from 'lucide-react';

export const Monitoring = () => {
    const { metrics, history } = useLiveMetrics();

    return (
        <div className="container mx-auto p-6 space-y-6" dir="rtl">
            <SEO title="لوحة مراقبة الأداء الفوري" description="لوحة أداء المراقبة الفورية لخوادم Rezk Fit Hub." />

            {/* Header banner */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-primary/10 via-primary/5 to-background p-6 rounded-xl border border-primary/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <Activity className="h-6 w-6 text-primary" />
                        لوحة المراقبة وتحليل أداء الخوادم
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        متابعة حية للمستخدمين المتصلين، أزمنة استجابة خادم الويب، حركة مرور البيانات، وحجم طابور المعالجة.
                    </p>
                </div>
            </div>

            {/* Widgets dashboard */}
            {metrics ? (
                <MonitoringWidgets metrics={metrics} />
            ) : (
                <div className="h-32 flex items-center justify-center text-muted-foreground">
                    جاري تحميل مؤشرات الأداء...
                </div>
            )}

            {/* Analytical charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chart 1: System Load */}
                <Card className="border border-border">
                    <CardHeader className="text-right pb-2">
                        <CardTitle className="text-base font-bold flex items-center gap-2 flex-row-reverse justify-end text-foreground">
                            <Cpu className="h-4 w-4 text-orange-500" />
                            معدل استخدام المعالج الـ CPU (%)
                        </CardTitle>
                        <CardDescription>مخطط بياني فوري يوضح نسبة استهلاك الخادم للثواني الماضية.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={history} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="loadGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/40" />
                                <XAxis dataKey="timestamp" className="text-[10px] fill-muted-foreground" />
                                <YAxis domain={[0, 100]} className="text-[10px] fill-muted-foreground" />
                                <Tooltip contentStyle={{ direction: 'rtl', textAlign: 'right' }} />
                                <Area type="monotone" dataKey="systemLoad" stroke="#f97316" strokeWidth={2} fillOpacity={1} fill="url(#loadGrad)" name="استهلاك المعالج (%)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Chart 2: Latency */}
                <Card className="border border-border">
                    <CardHeader className="text-right pb-2">
                        <CardTitle className="text-base font-bold flex items-center gap-2 flex-row-reverse justify-end text-foreground">
                            <Timer className="h-4 w-4 text-primary" />
                            سرعة استجابة الـ API (ملي ثانية - ms)
                        </CardTitle>
                        <CardDescription>معدل زمن استجابة خوادم بوابة التطبيقات للطلبات الواردة.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={history} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="latencyGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/40" />
                                <XAxis dataKey="timestamp" className="text-[10px] fill-muted-foreground" />
                                <YAxis domain={[30, 200]} className="text-[10px] fill-muted-foreground" />
                                <Tooltip contentStyle={{ direction: 'rtl', textAlign: 'right' }} />
                                <Area type="monotone" dataKey="apiResponseTime" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#latencyGrad)" name="زمن الاستجابة (ms)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Monitoring;
