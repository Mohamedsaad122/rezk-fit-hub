import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { ArrowLeft, Settings, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';
import ROUTES from '@/constants/routes.constants';
import { AutomationRepository } from '@/repositories/automation.repository';

export const AutomationCenter = () => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const fetchLogs = async () => {
            const list = await AutomationRepository.getLogs();
            setLogs(list);
        };
        fetchLogs();
    }, []);

    return (
        <div className="container mx-auto p-6 space-y-6 text-right" dir="rtl">
            <SEO title="مركز الأتمتة والربط التلقائي" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-red-500/10 via-primary/5 to-background p-6 rounded-xl border border-red-500/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <Settings className="h-6 w-6 text-red-500" />
                        بوابة التحكم بالأتمتة والربط (Automation Center)
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        إعداد وإدارة قواعد الأتمتة المباشرة وسجلات ربط الأحداث بالإجراءات البرمجية.
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
                <CardHeader>
                    <CardTitle className="text-base font-bold">سجل عمليات الأتمتة الفوري ({logs.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-xs text-right">
                    {logs.length === 0 ? (
                        <div className="text-center py-16 text-muted-foreground">لا توجد سجلات أتمتة حالياً.</div>
                    ) : (
                        logs.map(log => (
                            <div key={log.id} className="p-4 border border-border rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 flex-row-reverse bg-muted/5 font-mono">
                                <div className="space-y-1 text-right">
                                    <div className="flex items-center gap-2 flex-row-reverse justify-end">
                                        <span className="font-bold text-foreground">{log.triggerEvent}</span>
                                        <Badge variant={log.status === 'Success' ? 'default' : 'destructive'} className="text-[9px]">
                                            {log.status}
                                        </Badge>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground">{log.details}</p>
                                </div>
                                <div className="text-left text-[9px] text-muted-foreground">
                                    <span>{new Date(log.timestamp).toLocaleString()}</span>
                                </div>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AutomationCenter;
