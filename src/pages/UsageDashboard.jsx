import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';
import { BarChart3, ArrowLeft, RefreshCw, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';
import ROUTES from '@/constants/routes.constants';
import { RateLimitService } from '@/services/rate-limit.service';

export const UsageDashboard = () => {
    const [stats, setStats] = useState({
        totalRequests: 0,
        successCount: 0,
        failCount: 0,
        averageLatency: 0
    });

    const calculateStats = async () => {
        try {
            const logs = await RateLimitService.getApiLogs();
            const total = logs.length;
            const success = logs.filter(l => l.status >= 200 && l.status < 300).length;
            const fail = logs.filter(l => l.status >= 400).length;
            const avgLat = total > 0 ? Math.round(logs.reduce((acc, l) => acc + l.latencyMs, 0) / total) : 0;

            setStats({
                totalRequests: total,
                successCount: success,
                failCount: fail,
                averageLatency: avgLat
            });
        } catch {
            // ignore
        }
    };

    useEffect(() => {
        calculateStats();
    }, []);

    return (
        <div className="container mx-auto p-6 space-y-6 text-right" dir="rtl">
            <SEO title="لوحة الاستهلاك (Usage Dashboard)" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-primary/10 via-primary/5 to-background p-6 rounded-xl border border-primary/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <BarChart3 className="h-6 w-6 text-primary" />
                        لوحة تحليلات واستهلاك المنصة الموحدة (Usage Dashboard)
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        متابعة حجم حركة البيانات، معدلات استجابة البوابات، وحساب الأخطاء اللحظية.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                        <Link to={ROUTES.DEVELOPER_PORTAL} className="gap-1">
                            <ArrowLeft className="h-4 w-4" />
                            العودة للبوابة
                        </Link>
                    </Button>
                    <Button onClick={calculateStats} size="icon" variant="ghost">
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="pb-2 text-right">
                        <CardTitle className="text-xs font-bold text-muted-foreground">إجمالي طلبات المرور</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <h3 className="text-2xl font-bold text-foreground">{stats.totalRequests} طلب</h3>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2 text-right">
                        <CardTitle className="text-xs font-bold text-muted-foreground">الطلبات الناجحة (2xx)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <h3 className="text-2xl font-bold text-emerald-500">{stats.successCount} طلب</h3>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2 text-right">
                        <CardTitle className="text-xs font-bold text-muted-foreground">الطلبات الفاشلة (4xx/5xx)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <h3 className="text-2xl font-bold text-destructive">{stats.failCount} طلب</h3>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2 text-right">
                        <CardTitle className="text-xs font-bold text-muted-foreground">متوسط زمن الاستجابة</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <h3 className="text-2xl font-bold text-primary font-mono">{stats.averageLatency}ms</h3>
                    </CardContent>
                </Card>
            </div>

            {/* Simulated Chart Container */}
            <Card className="border border-border">
                <CardHeader className="text-right">
                    <CardTitle className="text-base font-bold flex items-center gap-1.5 flex-row-reverse justify-end">
                        <Layers className="h-5 w-5 text-primary" />
                        توزيع حركة البيانات اللحظية (Simulated Volume distribution)
                    </CardTitle>
                </CardHeader>
                <CardContent className="h-[250px] flex items-end justify-between gap-2 p-6 bg-muted/10 rounded-xl">
                    {[35, 45, 60, 50, 75, 90, 85, 120, 95, 110, 130, 140].map((val, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                            <span className="text-[10px] text-muted-foreground font-mono">{val}</span>
                            <div
                                style={{ height: `${(val / 150) * 180}px` }}
                                className="w-full bg-primary/20 hover:bg-primary rounded-t transition-colors duration-150 cursor-pointer"
                            />
                            <span className="text-[10px] text-muted-foreground">{idx + 1}h</span>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
};

export default UsageDashboard;
