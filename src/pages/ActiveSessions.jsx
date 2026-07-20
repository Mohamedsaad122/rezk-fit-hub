import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { toastService } from '@/services/toast.service';
import { ArrowLeft, Trash2, Shield, Monitor } from 'lucide-react';
import { Link } from 'react-router-dom';
import ROUTES from '@/constants/routes.constants';
import { SessionService } from '@/services/session.service';

export const ActiveSessions = () => {
    const [sessions, setSessions] = useState([]);

    const fetchSessions = async () => {
        try {
            const list = await SessionService.getSessions();
            setSessions(list);
        } catch {
            // ignore
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    const handleRevoke = async (id) => {
        try {
            await SessionService.revokeSession(id);
            toastService.success('تم إنهاء صلاحية الجلسة المحددة عن بعد بنجاح');
            fetchSessions();
        } catch {
            toastService.error('فشل إنهاء صلاحية الجلسة');
        }
    };

    const handleRevokeOthers = async () => {
        try {
            // Find current session id (or simulate mock fallback id)
            const currentSession = sessions.find(s => s.isCurrent) || sessions[0];
            if (currentSession) {
                await SessionService.revokeAllOtherSessions(currentSession.id);
                toastService.success('تم تسجيل الخروج من كافة الأجهزة الأخرى بنجاح');
                fetchSessions();
            }
        } catch {
            toastService.error('فشل تسجيل الخروج من الأجهزة الأخرى');
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6 text-right" dir="rtl">
            <SEO title="جلسات الولوج النشطة (Active Sessions)" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-red-500/10 via-primary/5 to-background p-6 rounded-xl border border-red-500/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <Monitor className="h-6 w-6 text-red-500" />
                        إدارة جلسات الدخول والولوج النشطة (Active Sessions)
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        مراقبة وإدارة كافة اتصالات الأجهزة النشطة لحسابك وإنهاء صلاحياتها عن بعد لحماية حسابك.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                        <Link to={ROUTES.SECURITY_CENTER} className="gap-1">
                            <ArrowLeft className="h-4 w-4" />
                            العودة للمركز
                        </Link>
                    </Button>
                    {sessions.length > 1 && (
                        <Button onClick={handleRevokeOthers} size="sm" variant="destructive" className="text-xs gap-1">
                            <Trash2 className="h-4 w-4" />
                            إنهاء صلاحية الجلسات الأخرى
                        </Button>
                    )}
                </div>
            </div>

            <Card className="border border-border">
                <CardHeader className="text-right">
                    <CardTitle className="text-base font-bold">جلسات الأجهزة النشطة ({sessions.length})</CardTitle>
                    <CardDescription className="text-xs">تصفح قائمة الأجهزة والمتصفحات المتصلة حالياً بريزك فيت هب.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {sessions.length === 0 ? (
                        <div className="text-center py-16 text-muted-foreground text-xs">لا توجد جلسات نشطة حالياً.</div>
                    ) : (
                        sessions.map(s => (
                            <div key={s.id} className="p-4 border border-border rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 flex-row-reverse text-right text-xs bg-muted/5">
                                <div className="space-y-2 w-full md:w-auto">
                                    <div className="flex items-center gap-2 flex-row-reverse justify-end">
                                        <strong className="text-foreground font-bold">{s.userAgent.split(' ')[0] || 'Unknown Browser'}</strong>
                                        {s.isCurrent ? (
                                            <Badge variant="default" className="text-[9px]">هذا الجهاز حالياً</Badge>
                                        ) : (
                                            <Badge variant="secondary" className="text-[9px]">نشط عن بعد</Badge>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-primary justify-end">
                                        <span>IP Address: {s.ipAddress}</span>
                                    </div>
                                    <div className="text-[10px] text-muted-foreground">
                                        <span>تاريخ الولوج: {new Date(s.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                {!s.isCurrent && (
                                    <Button size="xs" variant="destructive" onClick={() => handleRevoke(s.id)} className="w-full md:w-auto gap-1">
                                        <Trash2 className="h-3.5 w-3.5" />
                                        تسجيل الخروج عن بعد
                                    </Button>
                                )}
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ActiveSessions;
