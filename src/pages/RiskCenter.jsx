import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { ArrowLeft, Shield, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import ROUTES from '@/constants/routes.constants';
import { SecurityService } from '@/services/security.service';

export const RiskCenter = () => {
    const [logs, setLogs] = useState([]);

    const fetchLogs = async () => {
        try {
            const list = await SecurityService.getLogs();
            setLogs(list);
        } catch {
            // ignore
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    return (
        <div className="container mx-auto p-6 space-y-6 text-right" dir="rtl">
            <SEO title="سجل المخاطر والتهديدات (Risk Center)" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-red-500/10 via-primary/5 to-background p-6 rounded-xl border border-red-500/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <AlertTriangle className="h-6 w-6 text-red-500 animate-bounce" />
                        بوابة رصد المخاطر والتنبيهات السيبرانية (Risk Center)
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        تحليل تفصيلي لمصادر التهديدات النشطة، محاولات الدخول المشبوهة، ومخالفات السياسة الجغرافية.
                    </p>
                </div>
                <Button asChild variant="outline" size="sm">
                    <Link to={ROUTES.SECURITY_CENTER} className="gap-1">
                        <ArrowLeft className="h-4 w-4" />
                        العودة للمركز
                    </Link>
                </Button>
            </div>

            <Card className="border border-border">
                <CardHeader className="text-right">
                    <CardTitle className="text-base font-bold">سجلات التنبيهات الأمنية والمخاطر المكتشفة ({logs.length})</CardTitle>
                    <CardDescription className="text-xs">تنبيهات فورية مرسلة من محرك المخاطر وجدار حماية البوابة.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-xs text-right">
                    {logs.length === 0 ? (
                        <div className="text-center py-16 text-muted-foreground">لا توجد تنبيهات أمنية حالياً.</div>
                    ) : (
                        logs.map(log => (
                            <div key={log.id} className="p-4 border border-border rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 flex-row-reverse bg-muted/5">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 flex-row-reverse justify-end">
                                        <span className="font-bold text-foreground">{log.eventType}</span>
                                        <Badge variant={log.riskScore >= 50 ? 'destructive' : 'default'} className="text-[9px]">
                                            مستوى الخطر {log.riskScore}%
                                        </Badge>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground leading-relaxed">{log.details}</p>
                                </div>
                                <div className="text-left">
                                    <span className="font-mono block text-[9px] text-primary">{log.ipAddress}</span>
                                    <span className="block text-[9px] text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</span>
                                </div>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default RiskCenter;
