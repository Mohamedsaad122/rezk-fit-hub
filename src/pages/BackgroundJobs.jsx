import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { ArrowLeft, Cpu, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import ROUTES from '@/constants/routes.constants';
import { BackgroundWorkerService } from '@/services/background-worker.service';
import { mockDatabase } from '@/mocks/mockDatabase';
import { toastService } from '@/services/toast.service';

export const BackgroundJobs = () => {
    const [jobs, setJobs] = useState([]);

    const fetchJobs = async () => {
        try {
            const list = await mockDatabase.saas.backgroundJobs.getAll();
            setJobs(list);
        } catch {
            // ignore
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleProcess = async () => {
        try {
            const processed = await BackgroundWorkerService.processNextJob();
            if (processed) {
                toastService.success(`تمت معالجة وظيفة بنجاح: ID #${processed.id}`);
                fetchJobs();
            } else {
                toastService.info('لا توجد وظائف معلقة في قائمة الانتظار حالياً');
            }
        } catch {
            toastService.error('فشل معالجة الوظائف');
        }
    };

    const handleCreateJob = async () => {
        try {
            await BackgroundWorkerService.enqueueJob('ExportAnalyticsReport', { format: 'PDF' });
            toastService.success('تمت جدولة وظيفة ترحيل البيانات التلقائية في الخلفية');
            fetchJobs();
        } catch {
            toastService.error('فشل جدولة الوظيفة');
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6 text-right" dir="rtl">
            <SEO title="إدارة وظائف الخلفية والعمال" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-red-500/10 via-primary/5 to-background p-6 rounded-xl border border-red-500/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <Cpu className="h-6 w-6 text-red-500" />
                        طابور وظائف وعمال الخلفية (Background Workers)
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        مراقبة وإدارة طوابير المهام الثقيلة التي يتم تشغيلها في الخلفية بشكل غير متزامن.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={handleCreateJob} variant="outline" size="sm">إضافة مهمة تجريبية</Button>
                    <Button asChild variant="outline" size="sm">
                        <Link to={ROUTES.SECURITY_CENTER} className="gap-1">
                            <ArrowLeft className="h-4 w-4" />
                            العودة للمركز
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs text-right">
                <Card className="border border-border">
                    <CardHeader>
                        <CardTitle className="text-base font-bold">لوحة تحكم معالجة المهام</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-muted-foreground">تتيح لك تشغيل معالج المهام يدوياً لسحب المهام المعلقة ومعالجتها بالترتيب.</p>
                        <Button onClick={handleProcess} className="w-full gap-2">
                            <RefreshCw className="h-4 w-4" />
                            تشغيل معالج المهام الآن (Process Worker)
                        </Button>
                    </CardContent>
                </Card>

                <div className="lg:col-span-2">
                    <Card className="border border-border">
                        <CardHeader>
                            <CardTitle className="text-base font-bold">قائمة طابور المهام الجاري أو المعلق ({jobs.length})</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 font-mono text-[10px]">
                            {jobs.length === 0 ? (
                                <div className="text-center py-16 text-muted-foreground text-xs font-sans">لا توجد مهام في طابور الخلفية حالياً.</div>
                            ) : (
                                jobs.map(job => (
                                    <div key={job.id} className="p-4 border border-border rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 flex-row-reverse text-right bg-muted/5">
                                        <div className="space-y-1 text-right">
                                            <div className="flex items-center gap-2 flex-row-reverse justify-end">
                                                <strong className="text-foreground text-[11px]">{job.jobType} (ID #{job.id})</strong>
                                                <Badge variant={job.status === 'Completed' ? 'default' : job.status === 'Failed' ? 'destructive' : 'outline'}>
                                                    {job.status}
                                                </Badge>
                                            </div>
                                            <p className="text-muted-foreground text-[9px]">عدد المحاولات: {job.attempts} / {job.maxRetries}</p>
                                            {job.error && <p className="text-red-500 text-[9px]">Error: {job.error}</p>}
                                        </div>
                                        <div className="text-left text-[9px] text-muted-foreground">
                                            <span>تمت الجدولة: {new Date(job.createdAt).toLocaleTimeString()}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default BackgroundJobs;
