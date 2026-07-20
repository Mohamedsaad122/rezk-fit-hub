import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { ArrowLeft, CheckSquare, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import ROUTES from '@/constants/routes.constants';
import { ComplianceService } from '@/services/compliance.service';

export const ComplianceCenter = () => {
    const [status, setStatus] = useState(null);

    useEffect(() => {
        const fetchStatus = async () => {
            const data = await ComplianceService.getComplianceStatus();
            setStatus(data);
        };
        fetchStatus();
    }, []);

    return (
        <div className="container mx-auto p-6 space-y-6 text-right" dir="rtl">
            <SEO title="مركز الامتثال والحوكمة (Compliance Center)" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-red-500/10 via-primary/5 to-background p-6 rounded-xl border border-red-500/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <CheckSquare className="h-6 w-6 text-red-500" />
                        مركز الامتثال والحوكمة والمطابقة (Compliance Center)
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        متابعة دورية ومراجعة فورية لتوافق ريزك فيت هب مع معايير الامتثال العالمية (SOC2 / ISO 27001 / GDPR).
                    </p>
                </div>
                <Button asChild variant="outline" size="sm">
                    <Link to={ROUTES.SECURITY_CENTER} className="gap-1">
                        <ArrowLeft className="h-4 w-4" />
                        العودة للمركز
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-right">
                {status && Object.entries(status).map(([key, value]) => (
                    <Card key={key} className="border border-border flex flex-col justify-between">
                        <CardHeader className="pb-2 text-right">
                            <div className="flex justify-between items-center flex-row-reverse">
                                <Badge variant="default" className="text-[10px] bg-emerald-500">{value.status}</Badge>
                                <CardTitle className="text-base font-bold uppercase text-primary">{key}</CardTitle>
                            </div>
                            <CardDescription className="text-[10px]">معدل المطابقة التراكمية: {value.score}%</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-2">
                            <div className="space-y-2 border-t border-border pt-4">
                                {value.checks.map((c, i) => (
                                    <div key={i} className="flex items-center gap-2 flex-row-reverse justify-end py-1">
                                        <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                                        <span className="text-muted-foreground text-[10px] text-right">{c.title}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default ComplianceCenter;
