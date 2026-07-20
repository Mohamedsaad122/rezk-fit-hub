import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { Link } from 'react-router-dom';
import ROUTES from '@/constants/routes.constants';
import { ArrowLeft, ShieldAlert, Heart, Activity, AlertCircle } from 'lucide-react';
import { SecurityService } from '@/services/security.service';

export const SecurityDashboard = () => {
    const [logs, setLogs] = useState([]);
    const [threats, setThreats] = useState([]);

    const fetchLogs = async () => {
        try {
            const list = await SecurityService.getLogs();
            setLogs(list);
            setThreats(list.filter(l => l.riskScore >= 50));
        } catch {
            // ignore
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    return (
        <div className="container mx-auto p-6 space-y-6 text-right" dir="rtl">
            <SEO title="لوحة التحكم الأمنية (Security Dashboard)" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-red-500/10 via-primary/5 to-background p-6 rounded-xl border border-red-500/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <Activity className="h-6 w-6 text-red-500" />
                        لوحة التحكم والتهديدات الأمنية (Security Dashboard)
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        متابعة حية لمحاولات الدخول الفاشلة والمخاطر السيبرانية المكتشفة من جدار الحماية.
                    </p>
                </div>
                <Button asChild variant="outline" size="sm">
                    <Link to={ROUTES.SECURITY_CENTER} className="gap-1">
                        <ArrowLeft className="h-4 w-4" />
                        العودة للمركز
                    </Link>
                </Button>
            </div>

            {/* Simulated Threats Alert Banner */}
            {threats.length > 0 && (
                <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl flex items-center gap-3 text-right flex-row-reverse justify-between text-xs">
                    <div className="flex items-center gap-2 flex-row-reverse">
                        <AlertCircle className="h-5 w-5 text-rose-500" />
                        <span className="font-bold text-rose-500">تحذير أمني نشط: تم رصد محاولات تسجيل دخول مشبوهة أو اختراق سياسات المرور!</span>
                    </div>
                    <Badge variant="destructive">مستوى الخطر مرتفع</Badge>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Active Threats list */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border border-border">
                        <CardHeader className="text-right pb-2">
                            <CardTitle className="text-base font-bold">آخر الأحداث والتهديدات الأمنية المكتشفة</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-xs">
                            {logs.length === 0 ? (
                                <div className="text-center py-16 text-muted-foreground">لا توجد عمليات مسجلة حالياً.</div>
                            ) : (
                                logs.map(l => (
                                    <div key={l.id} className="p-3 border border-border rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 flex-row-reverse bg-muted/5 text-right">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 flex-row-reverse justify-end">
                                                <strong className="text-foreground">{l.eventType}</strong>
                                                <Badge variant={l.riskScore >= 50 ? 'destructive' : 'default'} className="text-[9px]">
                                                    مخاطر {l.riskScore}%
                                                </Badge>
                                            </div>
                                            <p className="text-[10px] text-muted-foreground">{l.details}</p>
                                        </div>
                                        <div className="text-left">
                                            <span className="font-mono block text-[9px] text-muted-foreground">{l.ipAddress}</span>
                                            <span className="block text-[9px] text-muted-foreground">{new Date(l.timestamp).toLocaleTimeString()}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Recommendations */}
                <Card className="border border-border h-full">
                    <CardHeader className="text-right">
                        <CardTitle className="text-base font-bold">التوصيات الأمنية والامتثال</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-xs text-right">
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg space-y-1">
                            <strong className="text-emerald-500 block font-bold">تمكين المصادقة الثنائية (MFA)</strong>
                            <p className="text-[10px] text-muted-foreground">تفعيل تطبيقات الـ Authenticator لجميع الحسابات لحماية البيانات.</p>
                        </div>
                        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg space-y-1">
                            <strong className="text-amber-500 block font-bold">تدوير كلمات المرور للشركاء</strong>
                            <p className="text-[10px] text-muted-foreground">يوصى بتحديث كلمات المرور وتفعيل فترات التدوير الإجبارية كل 90 يوماً.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SecurityDashboard;
