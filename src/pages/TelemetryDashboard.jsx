import React, { useState, useEffect } from 'react';
import SEO from '@/components/SEO';
import { TelemetryService } from '@/services/telemetry.service';
import MetricCard from '@/components/MetricCard';
import { Button } from '@/components/ui/button';
import { Sparkles, Gauge, Compass, Zap } from 'lucide-react';

export const TelemetryDashboard = () => {
    const [stats, setStats] = useState({
        fid: 12,
        cls: 0.02,
        lcp: 1.2
    });

    useEffect(() => {
        TelemetryService.trackPageView('/observability-center/telemetry');
    }, []);

    const handleSimulate = () => {
        const newStats = {
            fid: Math.floor(Math.random() * 15) + 5,
            cls: Number((Math.random() * 0.05).toFixed(3)),
            lcp: Number((Math.random() * 1.5 + 0.5).toFixed(2))
        };
        setStats(newStats);
        TelemetryService.trackPerformance('web.vitals.lcp', newStats.lcp * 1000);
    };

    return (
        <div className="container mx-auto p-6 space-y-6 text-right" dir="rtl">
            <SEO title="لوحة قياس تجربة العميل والـ Telemetry" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-border pb-4 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-end">
                        <span>لوحة قياس تجربة العميل (Telemetry Dashboard)</span>
                        <Sparkles className="h-6 w-6 text-pink-500" />
                    </h1>
                    <p className="text-sm text-muted-foreground">تتبع مؤشرات تجربة العميل وسرعة استجابة واجهات الويب (Web Vitals).</p>
                </div>
                <Button size="sm" onClick={handleSimulate} className="text-xs gap-1.5 flex items-center justify-center">
                    <Zap className="h-4 w-4" />
                    <span>محاكاة تجربة مستخدم جديدة</span>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard title="First Input Delay (FID)" value={stats.fid} unit="ms" icon={Gauge} description="سرعة استجابة عناصر الواجهة للمدخلات" />
                <MetricCard title="Cumulative Layout Shift (CLS)" value={stats.cls} unit="score" icon={Compass} description="معدل استقرار عناصر واجهة الويب" />
                <MetricCard title="Largest Contentful Paint (LCP)" value={stats.lcp} unit="s" icon={Sparkles} description="زمن تحميل العنصر الرئيسي الأكبر في الصفحة" />
            </div>
        </div>
    );
};

export default TelemetryDashboard;
