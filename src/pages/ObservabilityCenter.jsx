import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import ROUTES from '@/constants/routes.constants';
import { BarChart3, AlertTriangle, ShieldCheck, Cpu, GitBranch, Terminal, Eye, HeartPulse, Sparkles } from 'lucide-react';
import useHealth from '@/hooks/use-health';
import useAlerts from '@/hooks/use-alerts';

export const ObservabilityCenter = () => {
    const { systemHealth } = useHealth();
    const { alerts } = useAlerts();

    const activeAlerts = alerts.filter(a => a.status === 'Active');

    const links = [
        { title: 'لوحة قياس المؤشرات (Metrics)', desc: 'عرض رسومية حية لمعدل استهلاك المعالج وتدفقات الطلبات.', to: ROUTES.METRICS_DASHBOARD, icon: BarChart3, color: 'text-primary bg-primary/10' },
        { title: 'مستكشف سجل الأحداث (Logs)', desc: 'سجلات أحداث الأمان، الفواتير، والأخطاء الفورية.', to: ROUTES.LOGS_EXPLORER, icon: Terminal, color: 'text-emerald-500 bg-emerald-500/10' },
        { title: 'مستكشف مسارات الربط (Traces)', desc: 'تحليل الأداء الفردي وتتبع مسارات الاستعلام وقواعد البيانات.', to: ROUTES.TRACE_EXPLORER, icon: Eye, color: 'text-indigo-500 bg-indigo-500/10' },
        { title: 'مركز إدارة التنبيهات (Alerts)', desc: 'إدارة التنبيهات الفورية وإرسال إشعارات SMS والبريد.', to: ROUTES.ALERTS_CENTER, icon: AlertTriangle, color: 'text-rose-500 bg-rose-500/10' },
        { title: 'حالة البنية التحتية (Health)', desc: 'مراقبة فورية للاتصال بقواعد البيانات وقنوات البث.', to: ROUTES.HEALTH_DASHBOARD, icon: HeartPulse, color: 'text-sky-500 bg-sky-500/10' },
        { title: 'إطلاق الإصدارات (Release Manager)', desc: 'إدارة أوزان Canary وبيئات إطلاق النشر الأزرق/الأخضر.', to: ROUTES.RELEASE_MANAGER, icon: GitBranch, color: 'text-amber-500 bg-amber-500/10' },
        { title: 'محلل الموارد والنظام (Profiler)', desc: 'أخذ عينات من الذاكرة وأداء محرك الاستعلام.', to: ROUTES.SYSTEM_PROFILER, icon: Cpu, color: 'text-purple-500 bg-purple-500/10' },
        { title: 'لوحة Telemetry للعميل', desc: 'مؤشرات تجربة المتصفح وسرعة استجابة واجهات الويب.', to: ROUTES.TELEMETRY_DASHBOARD, icon: Sparkles, color: 'text-pink-500 bg-pink-500/10' }
    ];

    return (
        <div className="container mx-auto p-6 space-y-6 text-right" dir="rtl">
            <SEO title="مركز عمليات المنصة والتحليل" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-primary/10 via-primary/5 to-background p-6 rounded-xl border border-primary/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-end">
                        <span>مركز العمليات والمراقبة الموحد</span>
                        <ShieldCheck className="h-6 w-6 text-primary" />
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        مراقبة حالة البنية التحتية، أداء محرك الذكاء الاصطناعي، وسجلات أتمتة تدفقات العمل.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {links.map((link, idx) => {
                    const Icon = link.icon;
                    return (
                        <Card key={idx} className="border border-border/40 hover:border-primary/40 transition-colors">
                            <CardHeader className="pb-3 text-right">
                                <div className="flex justify-between items-center flex-row-reverse mb-2">
                                    <span className={`p-2 rounded-xl ${link.color}`}>
                                        <Icon className="h-5 w-5" />
                                    </span>
                                </div>
                                <CardTitle className="text-base font-bold text-foreground">{link.title}</CardTitle>
                                <CardDescription className="text-xs leading-relaxed mt-2">{link.desc}</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-2 text-left">
                                <Link to={link.to}>
                                    <Button variant="ghost" size="sm" className="text-xs hover:bg-primary/10">استكشف الآن</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default ObservabilityCenter;
