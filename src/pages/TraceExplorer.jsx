import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import SEO from '@/components/SEO';
import { TracingService } from '@/services/tracing.service';
import TraceTree from '@/components/TraceTree';
import RequestTimeline from '@/components/RequestTimeline';
import { Eye, Clock } from 'lucide-react';

export const TraceExplorer = () => {
    const [traces, setTraces] = useState([]);

    useEffect(() => {
        const fetchTraces = async () => {
            const list = await TracingService.getTraces();
            setTraces(list);
        };
        fetchTraces();
    }, []);

    return (
        <div className="container mx-auto p-6 space-y-6 text-right" dir="rtl">
            <SEO title="مستكشف مسارات الربط" />

            <div className="space-y-1">
                <h1 className="text-2xl font-bold text-foreground">مستكشف مسارات الربط (Trace Explorer)</h1>
                <p className="text-sm text-muted-foreground">تحليل مسارات العمليات الموزعة وزمن المعالجة للبنية التحتية.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border border-border/40">
                    <CardHeader className="text-right">
                        <CardTitle className="text-base font-bold text-foreground flex items-center gap-2 justify-end">
                            <Eye className="h-4 w-4 text-primary" />
                            <span>شجرة مسار المعالجة الموزعة</span>
                        </CardTitle>
                        <CardDescription>الترابط الهيكلي والتبعية بين العمليات المختلفة</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TraceTree traces={traces} />
                    </CardContent>
                </Card>

                <Card className="border border-border/40">
                    <CardHeader className="text-right">
                        <CardTitle className="text-base font-bold text-foreground flex items-center gap-2 justify-end">
                            <Clock className="h-4 w-4 text-primary" />
                            <span>مخطط تسلسل الاستعلامات (Timeline)</span>
                        </CardTitle>
                        <CardDescription>التسلسل الزمني وفترات المعالجة النسبية للعمليات</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RequestTimeline traces={traces} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default TraceExplorer;
