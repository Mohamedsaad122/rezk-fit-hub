import React, { useState } from 'react';
import { useIntegrations } from '@/hooks/use-integrations';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { toastService } from '@/services/toast.service';
import { Calendar, RefreshCw, CheckCircle2 } from 'lucide-react';

export const CalendarSync = () => {
    const { syncLogs, isSyncLogsLoading, triggerCalendarSync } = useIntegrations();
    const [provider, setProvider] = useState('Google Calendar');

    const handleSync = async () => {
        try {
            await triggerCalendarSync(provider);
            toastService.success('تمت مزامنة الحصص والتمارين بنجاح');
        } catch (err) {
            toastService.error('فشل مزامنة المواعيد');
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6 text-right" dir="rtl">
            <SEO title="مزامنة التقاويم الخارجية" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-primary/10 via-primary/5 to-background p-6 rounded-xl border border-primary/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <Calendar className="h-6 w-6 text-primary" />
                        مزامنة التقاويم الخارجية (Google & Outlook Calendar)
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        مزامنة حصص التدريب الشخصية للمدربين والعملاء لتجنب التعارض في الأوقات.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form to trigger sync */}
                <Card className="border border-border h-full">
                    <CardHeader className="text-right">
                        <CardTitle className="text-base font-bold">تشغيل المزامنة يدوياً</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm text-right">
                        <div className="space-y-1">
                            <label className="font-semibold block">المزود المستهدف</label>
                            <select
                                value={provider}
                                onChange={(e) => setProvider(e.target.value)}
                                className="w-full p-2 rounded border bg-background text-foreground text-xs"
                            >
                                <option value="Google Calendar">Google Calendar</option>
                                <option value="Microsoft Outlook">Microsoft Outlook Calendar</option>
                                <option value="FailedProvider">Failed Provider (محاكاة فشل الاتصال)</option>
                            </select>
                        </div>

                        <Button onClick={handleSync} className="w-full gap-2">
                            <RefreshCw className="h-4 w-4" />
                            مزامنة المواعيد الآن
                        </Button>
                    </CardContent>
                </Card>

                {/* History Logs */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border border-border">
                        <CardHeader className="text-right">
                            <CardTitle className="text-base font-bold">سجلات المزامنة الأخيرة</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {isSyncLogsLoading ? (
                                <div className="text-center py-6 text-muted-foreground text-xs">جاري تحميل السجلات...</div>
                            ) : syncLogs.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground text-xs">لا يوجد سجلات مزامنة سابقة للمؤسسة حالياً.</div>
                            ) : (
                                syncLogs.map(log => (
                                    <div key={log.id} className="p-3 border border-border rounded-xl flex justify-between items-center flex-row-reverse text-right text-xs">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 flex-row-reverse">
                                                <strong className="text-foreground font-bold">{log.provider}</strong>
                                                <Badge variant={log.status === 'Success' ? 'default' : 'destructive'} className="text-[9px]">
                                                    {log.status === 'Success' ? 'ناجح' : 'فاشل'}
                                                </Badge>
                                            </div>
                                            <p className="text-[10px] text-muted-foreground">التوقيت: {log.timestamp}</p>
                                            {log.errorMessage && <p className="text-[10px] text-destructive">{log.errorMessage}</p>}
                                        </div>
                                        <div className="text-primary font-bold">
                                            {log.syncedItemsCount} موعد مزامن
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

export default CalendarSync;
