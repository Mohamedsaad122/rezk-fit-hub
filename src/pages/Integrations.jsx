import React from 'react';
import { useIntegrations } from '@/hooks/use-integrations';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { toastService } from '@/services/toast.service';
import { Plug, Calendar, HardDrive, Mail, MessageSquare, ShieldCheck, HeartPulse, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Integrations = () => {
    const { integrations, isIntegrationsLoading, toggleStatus } = useIntegrations();

    const handleToggle = async (id, currentStatus) => {
        try {
            await toggleStatus({ id, currentStatus });
            toastService.success('تم تحديث حالة تفعيل البوابة بنجاح');
        } catch (e) {
            toastService.error('فشل تبديل حالة الاتصال');
        }
    };

    const modules = [
        { title: 'مزامنة التقاويم', url: '/integrations/calendar', icon: Calendar, desc: 'ربط Google Calendar و Outlook لجدولة مواعيد الحصص.' },
        { title: 'التخزين السحابي', url: '/integrations/storage', icon: HardDrive, desc: 'ربط AWS S3 و Google Drive و Dropbox لملفات المتدربين.' },
        { title: 'مزودي البريد الإلكتروني', url: '/integrations/email', icon: Mail, desc: 'إعداد SMTP و SendGrid و Mailgun لإرسال التقارير التغذوية.' },
        { title: 'بوابات رسائل SMS', url: '/integrations/sms', icon: MessageSquare, desc: 'ربط Twilio لتذكير المتدربين بحصصهم اليومية.' },
        { title: 'صحة ومؤشرات الاتصال', url: '/integrations/health', icon: HeartPulse, desc: 'مراقبة زمن الاستجابة، الفشل، ونسبة توافر الخدمات.' },
        { title: 'سجلات الويب هوكس (Webhooks)', url: '/integrations/webhooks', icon: ShieldCheck, desc: 'متابعة نداءات الويب هوكس وإعادة تشغيل الطلبات الفاشلة.' }
    ];

    return (
        <div className="container mx-auto p-6 space-y-6 text-right" dir="rtl">
            <SEO title="بوابة الربط والتكامل" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-primary/10 via-primary/5 to-background p-6 rounded-xl border border-primary/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <Plug className="h-6 w-6 text-primary" />
                        بوابة الربط والتكامل والشركاء
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        إعداد البوابات الخارجية، الويب هوكس، التخزين السحابي ومزامنة التقاويم مع المنصة.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Active connection lists */}
                <Card className="border border-border lg:col-span-1">
                    <CardHeader className="text-right">
                        <CardTitle className="text-base font-bold">بوابات الاتصال النشطة</CardTitle>
                        <CardDescription>الربط الخارجي النشط حالياً للمؤسسة</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 text-xs">
                        {isIntegrationsLoading ? (
                            <div className="text-center text-muted-foreground py-6">جاري تحميل البوابات...</div>
                        ) : (
                            integrations.map((item) => (
                                <div key={item.id} className="p-3 border border-border rounded-lg flex justify-between items-center flex-row-reverse text-right">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 flex-row-reverse">
                                            <strong className="text-foreground font-bold">{item.provider}</strong>
                                            <Badge variant={item.status === 'Connected' ? 'default' : 'secondary'} className="text-[9px]">
                                                {item.status === 'Connected' ? 'متصل' : 'معطل'}
                                            </Badge>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground">مستوى الكفاءة: {item.healthScore}%</p>
                                    </div>
                                    <Button
                                        size="xs"
                                        variant="outline"
                                        onClick={() => handleToggle(item.id, item.status)}
                                    >
                                        {item.status === 'Connected' ? 'تعطيل' : 'تفعيل'}
                                    </Button>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>

                {/* Integration Tools */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="font-bold text-lg text-foreground text-right mb-2">أدوات إعداد الربط والخدمات</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {modules.map((m, idx) => {
                            const IconComponent = m.icon;
                            return (
                                <Card key={idx} className="border border-border hover:shadow-md transition-shadow">
                                    <CardHeader className="p-4 text-right">
                                        <div className="flex justify-between items-start flex-row-reverse">
                                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                                <IconComponent className="h-5 w-5" />
                                            </div>
                                        </div>
                                        <CardTitle className="text-sm font-bold mt-3 text-right">{m.title}</CardTitle>
                                        <CardDescription className="text-xs text-right mt-1">{m.desc}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0 text-left">
                                        <Button asChild size="sm" variant="ghost" className="text-primary hover:text-primary-focus p-0">
                                            <Link to={m.url}>فتح الإعدادات ←</Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Integrations;
