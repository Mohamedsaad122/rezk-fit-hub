import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import ROUTES from '@/constants/routes.constants';
import { Key, Code, Terminal, BarChart2, Shield, Settings, Zap, ArrowLeftRight } from 'lucide-react';
import { DeveloperService } from '@/services/developer.service';
import { ApiKeyService } from '@/services/api-key.service';
import { RateLimitService } from '@/services/rate-limit.service';

export const DeveloperPortal = () => {
    const [appsCount, setAppsCount] = useState(0);
    const [keysCount, setKeysCount] = useState(0);
    const [logsCount, setLogsCount] = useState(0);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const apps = await DeveloperService.getApps();
                const keys = await ApiKeyService.getKeys();
                const logs = await RateLimitService.getApiLogs();
                setAppsCount(apps.length);
                setKeysCount(keys.length);
                setLogsCount(logs.length);
            } catch {
                // ignore
            }
        };
        fetchCounts();
    }, []);

    const links = [
        { title: 'مفاتيح API Keys', desc: 'إدارة وتوليد مفاتيح الوصول اللحظي للبيانات', route: ROUTES.API_KEYS, icon: Key, color: 'text-primary' },
        { title: 'تطبيقات OAuth Apps', desc: 'تسجيل تطبيقات الطرف الثالث وإدارة صلاحيات Scopes', route: ROUTES.OAUTH_APPS, icon: ArrowLeftRight, color: 'text-amber-500' },
        { title: 'بوابة GraphQL Playground', desc: 'استعراض الهيكل البرمجي الموحد وتشغيل الاستعلامات الفورية', route: ROUTES.GRAPHQL_PLAYGROUND, icon: Terminal, color: 'text-emerald-500' },
        { title: 'لوحة استهلاك التحليلات', desc: 'مراقبة عدد طلبات المرور ومتوسط Latency للـ Gateway', route: ROUTES.USAGE_DASHBOARD, icon: BarChart2, color: 'text-indigo-500' },
        { title: 'سجلات طلبات API Logs', desc: 'تحليل تفاصيل الطلبات الواردة وتتبع الأخطاء بالشبكة', route: ROUTES.API_LOGS, icon: Code, color: 'text-pink-500' },
        { title: 'سياسات حدود الاستهلاك Rate Limits', desc: 'مراجعة قيود المرور اللحظية وعناوين IP المتصلة', route: ROUTES.RATE_LIMITS, icon: Shield, color: 'text-rose-500' },
        { title: 'تنزيل حزم SDK Packages', desc: 'توليد boilerplate متكامل بأكثر من 9 لغات برمجية مختلفة', route: ROUTES.SDK_DOWNLOADS, icon: Zap, color: 'text-sky-500' }
    ];

    return (
        <div className="container mx-auto p-6 space-y-6 text-right" dir="rtl">
            <SEO title="بوابة المطورين (Developer Portal)" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-primary/10 via-primary/5 to-background p-6 rounded-xl border border-primary/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <Terminal className="h-6 w-6 text-primary" />
                        بوابة المطورين والمنصة البرمجية (Developer Portal)
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        مركز التحكم لربط ريزك فيت هب بتطبيقاتك الخارجية، بناء التكاملات البرمجية، وتتبع استهلاك الـ Web Gateway.
                    </p>
                </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="pb-2 text-right">
                        <CardTitle className="text-sm font-bold text-muted-foreground">تطبيقات المطورين</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <h3 className="text-2xl font-bold text-foreground">{appsCount} تطبيق مسجل</h3>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2 text-right">
                        <CardTitle className="text-sm font-bold text-muted-foreground">مفاتيح API Keys النشطة</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <h3 className="text-2xl font-bold text-foreground">{keysCount} مفتاح وصول</h3>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2 text-right">
                        <CardTitle className="text-sm font-bold text-muted-foreground">إجمالي الطلبات المستلمة (Logs)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <h3 className="text-2xl font-bold text-foreground">{logsCount} طلب مرور</h3>
                    </CardContent>
                </Card>
            </div>

            {/* Navigation links grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {links.map((link, idx) => {
                    const IconComponent = link.icon;
                    return (
                        <Card key={idx} className="hover:border-primary/40 transition-colors duration-200">
                            <CardHeader className="flex flex-row-reverse justify-between items-start pb-2">
                                <IconComponent className={`h-6 w-6 ${link.color}`} />
                                <CardTitle className="text-sm font-bold">{link.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-xs text-muted-foreground min-h-[40px]">{link.desc}</p>
                                <Button asChild className="w-full text-xs" size="sm" variant="outline">
                                    <Link to={link.route}>استعراض ودخول</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default DeveloperPortal;
