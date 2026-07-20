import React, { useState } from 'react';
import { useIntegrations } from '@/hooks/use-integrations';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { toastService } from '@/services/toast.service';
import { ShieldCheck, Plus, RefreshCw, Trash2, CheckCircle, AlertTriangle } from 'lucide-react';

export const WebhookLogs = () => {
    const { webhooks, webhookLogs, isWebhooksLoading, isWebhookLogsLoading, createWebhook, deleteWebhook, replayWebhookEvent } = useIntegrations();
    const [newUrl, setNewUrl] = useState('');
    const [newEvents, setNewEvents] = useState('INVOICE_PAID');

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newUrl) return;

        try {
            await createWebhook({
                url: newUrl,
                events: [newEvents]
            });
            setNewUrl('');
            toastService.success('تم تسجيل عنوان الويب هوك الجديد بنجاح');
        } catch (err) {
            toastService.error('فشل تسجيل الويب هوك');
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteWebhook(id);
            toastService.success('تم إلغاء تسجيل الويب هوك');
        } catch (err) {
            toastService.error('فشل الحذف');
        }
    };

    const handleReplay = async (logId) => {
        try {
            await replayWebhookEvent(logId);
            toastService.success('تمت إعادة إرسال نداء الويب هوك بنجاح');
        } catch (err) {
            toastService.error('فشل إرسال الإشعار');
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6 text-right" dir="rtl">
            <SEO title="سجلات الويب هوكس والربط" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-primary/10 via-primary/5 to-background p-6 rounded-xl border border-primary/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <ShieldCheck className="h-6 w-6 text-primary" />
                        سجلات وتنبيهات الويب هوكس (Webhooks Engine)
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        رصد نداءات الويب هوكس الخارجية للمشتركين وإعادة تجربة الحزم التالفة أو المعلقة.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form to add endpoint */}
                <Card className="border border-border h-full">
                    <CardHeader className="text-right">
                        <CardTitle className="text-base font-bold">تسجيل رابط نداء جديد</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreate} className="space-y-4 text-sm text-right">
                            <div className="space-y-1">
                                <label className="font-semibold block">عنوان الرابط المستهدف (URL)</label>
                                <input
                                    type="url"
                                    value={newUrl}
                                    onChange={(e) => setNewUrl(e.target.value)}
                                    placeholder="https://api.external.com/webhook"
                                    className="w-full p-2 rounded border bg-background text-foreground text-xs"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="font-semibold block">الحدث المراد الاستماع له</label>
                                <select
                                    value={newEvents}
                                    onChange={(e) => setNewEvents(e.target.value)}
                                    className="w-full p-2 rounded border bg-background text-foreground text-xs"
                                >
                                    <option value="INVOICE_PAID">INVOICE_PAID (دفع الفاتورة)</option>
                                    <option value="INVOICE_GENERATED">INVOICE_GENERATED (إصدار فاتورة)</option>
                                    <option value="MEMBER_JOINED">MEMBER_JOINED (انضمام مشترك)</option>
                                </select>
                            </div>

                            <Button type="submit" className="w-full gap-2">
                                <Plus className="h-4 w-4" />
                                تسجيل الرابط المستهدف
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* List endpoints */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border border-border">
                        <CardHeader className="text-right">
                            <CardTitle className="text-base font-bold">العناوين المسجلة حالياً</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {isWebhooksLoading ? (
                                <div className="text-center py-6 text-muted-foreground text-xs">جاري تحميل العناوين...</div>
                            ) : (
                                webhooks.map(w => (
                                    <div key={w.id} className="p-3 border border-border rounded-xl flex justify-between items-center flex-row-reverse text-right text-xs">
                                        <div className="space-y-1">
                                            <div className="font-mono text-foreground font-bold">{w.url}</div>
                                            <div className="text-[10px] text-muted-foreground">
                                                الأحداث: {w.events.join('، ')}
                                            </div>
                                        </div>
                                        <Button size="xs" variant="destructive" onClick={() => handleDelete(w.id)}>
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Delivery Logs */}
            <Card className="border border-border mt-6">
                <CardHeader className="text-right">
                    <CardTitle className="text-base font-bold">تاريخ الإرسال والمحاولات الفاشلة (DLQ)</CardTitle>
                    <CardDescription>تفاصيل استجابة الخوادم وإعادة التشغيل اليدوي</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-right text-xs">
                            <thead>
                                <tr className="border-b border-border bg-muted/20 text-muted-foreground font-semibold">
                                    <th className="p-3 text-right">الحدث</th>
                                    <th className="p-3 text-center">الرقم التعريفي للويب هوك</th>
                                    <th className="p-3 text-center">الحالة</th>
                                    <th className="p-3 text-center">كود الاستجابة</th>
                                    <th className="p-3 text-center">المحاولات</th>
                                    <th className="p-3 text-left">إجراءات</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {isWebhookLogsLoading ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-12 text-muted-foreground">جاري تحميل سجلات الإرسال...</td>
                                    </tr>
                                ) : (
                                    webhookLogs.map(log => (
                                        <tr key={log.id} className="hover:bg-muted/10">
                                            <td className="p-3 font-semibold text-right">{log.event}</td>
                                            <td className="p-3 text-center font-mono">{log.webhookId}</td>
                                            <td className="p-3 text-center">
                                                <Badge variant={log.status === 'Success' ? 'default' : 'destructive'} className="text-[10px]">
                                                    {log.status === 'Success' ? 'ناجح' : 'فشل'}
                                                </Badge>
                                            </td>
                                            <td className="p-3 text-center font-mono font-bold">{log.statusCode}</td>
                                            <td className="p-3 text-center">{log.attempts}</td>
                                            <td className="p-3 text-left">
                                                <Button size="xs" variant="outline" className="gap-1" onClick={() => handleReplay(log.id)}>
                                                    <RefreshCw className="h-3 w-3" />
                                                    إعادة إرسال
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default WebhookLogs;
