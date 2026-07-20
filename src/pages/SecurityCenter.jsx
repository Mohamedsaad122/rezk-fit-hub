import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import ROUTES from '@/constants/routes.constants';
import { Shield, Key, Eye, Lock, Cpu, Globe, Activity, CheckSquare, Settings2, Trash2 } from 'lucide-react';
import { SecurityService } from '@/services/security.service';

export const SecurityCenter = () => {
    const [score, setScore] = useState(85);
    const [alertsCount, setAlertsCount] = useState(0);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const logs = await SecurityService.getLogs();
                setAlertsCount(logs.filter(l => l.riskScore > 40).length);
            } catch {
                // ignore
            }
        };
        fetchLogs();
    }, []);

    const links = [
        { title: 'لوحة التحكم الأمنية', desc: 'مراقبة التهديدات النشطة والعمليات والمخاطر', route: ROUTES.SECURITY_DASHBOARD, icon: Activity, color: 'text-primary' },
        { title: 'جلسات الولوج النشطة', desc: 'عرض الجلسات المفتوحة وإلغاء صلاحيتها عن بعد', route: ROUTES.ACTIVE_SESSIONS, icon: Eye, color: 'text-amber-500' },
        { title: 'الأجهزة الموثوقة', desc: 'إدارة أجهزة المتدربين والمدربين المعتمدة', route: ROUTES.TRUSTED_DEVICES, icon: Cpu, color: 'text-indigo-500' },
        { title: 'المصادقة الثنائية (MFA)', desc: 'تفعيل تطبيقات TOTP ورموز الاستعادة الاحتياطية', route: ROUTES.MFA_SETTINGS, icon: Lock, color: 'text-emerald-500' },
        { title: 'إعدادات SSO Federation', desc: 'ربط مزودي الهوية مثل Active Directory و Okta', route: ROUTES.SSO_SETTINGS, icon: Globe, color: 'text-sky-500' },
        { title: 'سياسات كلمة المرور', desc: 'تعيين طول الرمز وفترات التدوير الإجبارية', route: ROUTES.PASSWORD_POLICIES, icon: Key, color: 'text-pink-500' },
        { title: 'خزنة الأسرار المشفرة', desc: 'إدارة الرموز السرية ومفاتيح الربط بالمزودين', route: ROUTES.SECRETS_VAULT, icon: Shield, color: 'text-violet-500' },
        { title: 'مركز الامتثال والحوكمة', desc: 'تتبع مستندات الامتثال SOC2 و ISO 27001 و GDPR', route: ROUTES.COMPLIANCE_CENTER, icon: CheckSquare, color: 'text-rose-500' },
        { title: 'سجل المخاطر والتهديدات', desc: 'تحليلات Impossible Travel ومحاولات Brute Force', route: ROUTES.RISK_CENTER, icon: Shield, color: 'text-red-500' }
    ];

    return (
        <div className="container mx-auto p-6 space-y-6 text-right" dir="rtl">
            <SEO title="مركز الأمن السيبراني والحوكمة" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-red-500/10 via-primary/5 to-background p-6 rounded-xl border border-red-500/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <Shield className="h-6 w-6 text-red-500 animate-pulse" />
                        مركز الأمن السيبراني والحوكمة (Security Center)
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        نظام الحماية الموحد لإدارة سياسات التشفير، تتبع المخاطر، الامتثال للمعايير، والتحكم بالولوج الفيدرالي.
                    </p>
                </div>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-right">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground font-bold">مؤشر الأمن العام</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <h3 className="text-3xl font-bold text-emerald-500">{score}% - آمن جداً</h3>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground font-bold">تهديدات ومخاطر نشطة</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <h3 className="text-3xl font-bold text-rose-500">{alertsCount} تنبيهات</h3>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground font-bold">وضع الحماية المشفرة</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <h3 className="text-3xl font-bold text-primary">AES-256 نشط</h3>
                    </CardContent>
                </Card>
            </div>

            {/* Navigation links grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {links.map((link, idx) => {
                    const IconComponent = link.icon;
                    return (
                        <Card key={idx} className="hover:border-red-500/30 transition-all duration-200">
                            <CardHeader className="flex flex-row-reverse justify-between items-start pb-2">
                                <IconComponent className={`h-6 w-6 ${link.color}`} />
                                <CardTitle className="text-sm font-bold">{link.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-xs text-muted-foreground min-h-[40px]">{link.desc}</p>
                                <Button asChild className="w-full text-xs" size="sm" variant="outline">
                                    <Link to={link.route}>دخول وتخصيص</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default SecurityCenter;
