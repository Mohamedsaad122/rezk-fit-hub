import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { ArrowLeft, CheckCircle2, XCircle, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ROUTES from '@/constants/routes.constants';
import { ApprovalService } from '@/services/approval.service';

export const Approvals = () => {
    const [approvals, setApprovals] = useState([]);

    const fetchApprovals = async () => {
        try {
            const list = await ApprovalService.getApprovals();
            setApprovals(list);
        } catch {
            // ignore
        }
    };

    useEffect(() => {
        fetchApprovals();
    }, []);

    return (
        <div className="container mx-auto p-6 space-y-6 text-right" dir="rtl">
            <SEO title="مركز الموافقات والاعتمادات" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-red-500/10 via-primary/5 to-background p-6 rounded-xl border border-red-500/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <CheckCircle2 className="h-6 w-6 text-red-500" />
                        بوابة الموافقات والاعتمادات الرسمية (Approvals Center)
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        مراجعة وإصدار القرارات للملفات وطلبات الأتمتة الموقوفة بانتظار التصديق الإداري.
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
                    <CardTitle className="text-base font-bold">طلبات الاعتماد الحالية ({approvals.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-xs text-right">
                    {approvals.length === 0 ? (
                        <div className="text-center py-16 text-muted-foreground">لا توجد طلبات معلقة بانتظار موافقتك.</div>
                    ) : (
                        approvals.map(app => (
                            <div key={app.id} className="p-4 border border-border rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 flex-row-reverse bg-muted/5 font-mono">
                                <div className="space-y-2 text-right w-full md:w-auto">
                                    <div className="flex items-center gap-2 flex-row-reverse justify-end">
                                        <strong className="text-foreground text-sm">{app.title}</strong>
                                        <Badge variant={app.status === 'Approved' ? 'default' : app.status === 'Rejected' ? 'destructive' : 'outline'} className="text-[9px]">
                                            {app.status}
                                        </Badge>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground">{app.description}</p>
                                    <span className="block text-[9px] text-primary">المستوى الحالي: {app.currentLevel} / {app.maxLevels}</span>
                                </div>
                                <Button asChild size="xs" variant="outline" className="w-full md:w-auto gap-1">
                                    <Link to={`/security-center/approvals/${app.id}`}>
                                        <ArrowUpRight className="h-3.5 w-3.5" />
                                        عرض التفاصيل والاعتماد
                                    </Link>
                                </Button>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Approvals;
