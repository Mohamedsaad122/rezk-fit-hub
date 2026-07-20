import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { HeartPulse, CheckCircle2, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';

export const IntegrationHealth = () => {
    const stats = {
        uptime: 99.85,
        avgLatencyMs: 145,
        totalFailedWebhooks: 3,
        retriesCompleted: 24
    };

    const providers = [
        { name: 'Google Calendar Sync', latency: '120ms', status: 'Online', uptime: '99.9%' },
        { name: 'Amazon S3 Storage', latency: '98ms', status: 'Online', uptime: '100%' },
        { name: 'Twilio SMS Server', latency: '185ms', status: 'Online', uptime: '99.7%' },
        { name: 'SendGrid Mail Service', latency: '210ms', status: 'Online', uptime: '99.8%' }
    ];

    return (
        <div className="container mx-auto p-6 space-y-6 text-right" dir="rtl">
            <SEO title="صحة الاتصالات والشركاء" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-primary/10 via-primary/5 to-background p-6 rounded-xl border border-primary/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <HeartPulse className="h-6 w-6 text-primary" />
                        صحة ومؤشرات الاتصال بالشركاء (Integrations Health)
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        متابعة حية لسرعة استجابة الخوادم الشريكة، نسبة توافر الخدمات، وسجلات محاولات الإرسال.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                <Card className="border border-border">
                    <CardHeader className="p-4 text-center">
                        <CardDescription className="text-xs">نسبة التوافر الكلية (Uptime)</CardDescription>
                        <CardTitle className="text-xl font-bold text-emerald-600 mt-2">{stats.uptime}%</CardTitle>
                    </CardHeader>
                </Card>

                <Card className="border border-border">
                    <CardHeader className="p-4 text-center">
                        <CardDescription className="text-xs">متوسط زمن الاستجابة (Latency)</CardDescription>
                        <CardTitle className="text-xl font-bold text-primary mt-2">{stats.avgLatencyMs}ms</CardTitle>
                    </CardHeader>
                </Card>

                <Card className="border border-border">
                    <CardHeader className="p-4 text-center">
                        <CardDescription className="text-xs">إجمالي المحاولات الفاشلة (DLQ)</CardDescription>
                        <CardTitle className="text-xl font-bold text-destructive mt-2">{stats.totalFailedWebhooks}</CardTitle>
                    </CardHeader>
                </Card>

                <Card className="border border-border">
                    <CardHeader className="p-4 text-center">
                        <CardDescription className="text-xs">عمليات إعادة المحاولة (Retries)</CardDescription>
                        <CardTitle className="text-xl font-bold text-amber-600 mt-2">{stats.retriesCompleted}</CardTitle>
                    </CardHeader>
                </Card>
            </div>

            {/* List providers status */}
            <Card className="border border-border">
                <CardHeader className="text-right">
                    <CardTitle className="text-base font-bold flex items-center gap-1.5 flex-row-reverse justify-end">
                        <Activity className="h-5 w-5 text-primary" />
                        حالة المزودين اللحظية (Real-time Status)
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-right text-xs">
                            <thead>
                                <tr className="border-b border-border bg-muted/20 text-muted-foreground font-semibold">
                                    <th className="p-3 text-right">المزود</th>
                                    <th className="p-3 text-center">سرعة الاستجابة (Latency)</th>
                                    <th className="p-3 text-center">نسبة التوافر (Uptime)</th>
                                    <th className="p-3 text-left">الحالة</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {providers.map((p, idx) => (
                                    <tr key={idx} className="hover:bg-muted/10">
                                        <td className="p-3 font-semibold text-right">{p.name}</td>
                                        <td className="p-3 text-center font-mono">{p.latency}</td>
                                        <td className="p-3 text-center font-mono">{p.uptime}</td>
                                        <td className="p-3 text-left">
                                            <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600 text-[10px]">
                                                متصل
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default IntegrationHealth;
