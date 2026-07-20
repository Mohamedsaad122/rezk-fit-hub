import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import SEO from '@/components/SEO';
import { useMetrics } from '@/hooks/use-metrics';
import MetricCard from '@/components/MetricCard';
import MetricsChart from '@/components/MetricsChart';
import { Cpu, HardDrive, Network, Zap } from 'lucide-react';

export const MetricsDashboard = () => {
    const { metrics } = useMetrics();

    const cpuUsage = metrics.find(m => m.key === 'system.cpu.usage')?.value || 12.5;
    const memoryUsed = metrics.find(m => m.key === 'system.memory.used')?.value || 2048;
    const latency = metrics.find(m => m.key === 'system.network.latency')?.value || 15;

    return (
        <div className="container mx-auto p-6 space-y-6 text-right" dir="rtl">
            <SEO title="لوحة قياس المؤشرات" />

            <div className="space-y-1">
                <h1 className="text-2xl font-bold text-foreground">لوحة قياس المؤشرات (Metrics Dashboard)</h1>
                <p className="text-sm text-muted-foreground">مراقبة فورية لأداء النظام والعمليات البينية.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard title="استهلاك المعالج (CPU)" value={cpuUsage} unit="%" icon={Cpu} description="معدل استهلاك المعالج الفوري" />
                <MetricCard title="استهلاك الذاكرة" value={memoryUsed} unit="MB" icon={HardDrive} description="حجم الذاكرة المستهلكة حالياً" />
                <MetricCard title="زمن استجابة الشبكة" value={latency} unit="ms" icon={Network} description="متوسط زمن استجابة خوادم البث المباشر" />
            </div>

            <Card className="border border-border/40">
                <CardHeader className="text-right">
                    <CardTitle className="text-base font-bold text-foreground flex items-center gap-2 justify-end">
                        <Zap className="h-4 w-4 text-primary" />
                        <span>منحنى الحمل والأداء الفوري</span>
                    </CardTitle>
                    <CardDescription>عرض رسومي تاريخي لمتغيرات الأداء والنظام</CardDescription>
                </CardHeader>
                <CardContent>
                    <MetricsChart data={metrics} strokeColor="#0ea5e9" fillColor="#0ea5e9" />
                </CardContent>
            </Card>
        </div>
    );
};

export default MetricsDashboard;
