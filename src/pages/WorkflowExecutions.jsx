import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { ArrowLeft, Play, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';
import ROUTES from '@/constants/routes.constants';
import { WorkflowService } from '@/services/workflow.service';

export const WorkflowExecutions = () => {
    const [runs, setRuns] = useState([]);

    const fetchRuns = async () => {
        try {
            const list = await WorkflowService.getWorkflowRuns();
            setRuns(list);
        } catch {
            // ignore
        }
    };

    useEffect(() => {
        fetchRuns();
    }, []);

    return (
        <div className="container mx-auto p-6 space-y-6 text-right" dir="rtl">
            <SEO title="لوحة التشغيل والتدفقات الفورية" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-red-500/10 via-primary/5 to-background p-6 rounded-xl border border-red-500/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <Cpu className="h-6 w-6 text-red-500 animate-pulse" />
                        لوحة التشغيل والتدفقات الفورية (Workflow Runs)
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        متابعة حية لحالة تنفيذ مسارات الأتمتة الجارية والتحقق من الخطوات المنفذة بنجاح أو الأخطاء.
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
                    <CardTitle className="text-base font-bold">طابور التنفيذ الجاري ({runs.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-xs text-right">
                    {runs.length === 0 ? (
                        <div className="text-center py-16 text-muted-foreground">لا توجد عمليات جارية حالياً.</div>
                    ) : (
                        runs.map(run => (
                            <div key={run.id} className="p-4 border border-border rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 flex-row-reverse bg-muted/5 font-mono">
                                <div className="space-y-1 text-right">
                                    <div className="flex items-center gap-2 flex-row-reverse justify-end">
                                        <strong className="text-foreground">Run #{run.id}</strong>
                                        <Badge variant={run.status === 'Completed' ? 'default' : run.status === 'Failed' ? 'destructive' : 'outline'}>
                                            {run.status}
                                        </Badge>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground">
                                        تاريخ البداية: {new Date(run.startTime).toLocaleString()}
                                    </p>
                                    {run.error && <p className="text-red-500 text-[10px]">Error: {run.error}</p>}
                                </div>
                                <div className="text-left text-[10px] text-muted-foreground">
                                    <span>مراحل منجزة: {run.executedNodes?.length || 0} خطوة</span>
                                </div>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default WorkflowExecutions;
