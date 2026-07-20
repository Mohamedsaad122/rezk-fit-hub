import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { ArrowLeft, Clock, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import ROUTES from '@/constants/routes.constants';
import { toastService } from '@/services/toast.service';

export const Schedules = () => {
    const [schedules, setSchedules] = useState([
        { id: 1, name: 'فحص الحسابات اليومي', expression: '0 0 * * *', status: 'Active', lastRun: '2026-07-19T00:00:00Z' },
        { id: 2, name: 'إرسال ملخص النشاط الأسبوعي', expression: '0 9 * * 0', status: 'Active', lastRun: '2026-07-13T09:00:00Z' }
    ]);

    const handleCreate = (e) => {
        e.preventDefault();
        toastService.success('تمت إضافة الجدولة الزمنية بنجاح');
    };

    return (
        <div className="container mx-auto p-6 space-y-6 text-right" dir="rtl">
            <SEO title="جداول المواعيد والمهام (Schedules)" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-red-500/10 via-primary/5 to-background p-6 rounded-xl border border-red-500/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <Clock className="h-6 w-6 text-red-500" />
                        إدارة الجداول الزمنية الدورية (Cron Schedules)
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        إنشاء وضبط جدولة المهام المتكررة (صيانة دورية، إرسال فواتير تلقائية، تصدير تقارير نشاط العملاء).
                    </p>
                </div>
                <Button asChild variant="outline" size="sm">
                    <Link to={ROUTES.SECURITY_CENTER} className="gap-1">
                        <ArrowLeft className="h-4 w-4" />
                        العودة للمركز
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs text-right">
                {/* Form register cron */}
                <Card className="border border-border">
                    <CardHeader>
                        <CardTitle className="text-base font-bold">تسجيل جدولة زمنية جديدة</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="space-y-1">
                                <label className="font-semibold block">اسم الجدولة:</label>
                                <input
                                    type="text"
                                    placeholder="مثال: تحديث اشتراكات الأندية"
                                    className="w-full p-2 border bg-background text-foreground text-xs rounded"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="font-semibold block">تعبير الجدولة (Cron Expression):</label>
                                <input
                                    type="text"
                                    placeholder="*/5 * * * *"
                                    className="w-full p-2 border bg-background text-foreground text-xs rounded font-mono text-left"
                                    required
                                />
                            </div>

                            <Button type="submit" className="w-full text-xs gap-1">
                                <Plus className="h-4 w-4" />
                                إضافة الجدولة
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* List schedules */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border border-border">
                        <CardHeader>
                            <CardTitle className="text-base font-bold">المهام المجدولة النشطة</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {schedules.map(sc => (
                                <div key={sc.id} className="p-4 border border-border rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 flex-row-reverse text-right bg-muted/5 font-mono">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 flex-row-reverse justify-end">
                                            <strong className="text-foreground">{sc.name}</strong>
                                            <Badge variant="default" className="text-[9px]">{sc.status}</Badge>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground">التعبير: {sc.expression}</p>
                                    </div>
                                    <div className="text-left text-[9px] text-muted-foreground">
                                        <span>آخر تشغيل: {new Date(sc.lastRun).toLocaleString()}</span>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Schedules;
