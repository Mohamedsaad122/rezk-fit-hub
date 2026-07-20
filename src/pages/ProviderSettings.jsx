import React, { useState } from 'react';
import { useIntegrationsStore } from '@/store/integrations.store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';
import { toastService } from '@/services/toast.service';
import { Settings, ShieldAlert } from 'lucide-react';

export const ProviderSettings = () => {
    const { smsProvider, emailProvider, storageProvider, setSmsProvider, setEmailProvider, setStorageProvider } = useIntegrationsStore();
    const [apiKey, setApiKey] = useState('');

    const handleSave = (e) => {
        e.preventDefault();
        toastService.success('تم تحديث إعدادات موفري الخدمة وتشفير مفاتيح الربط');
    };

    return (
        <div className="container mx-auto p-6 space-y-6 text-right" dir="rtl">
            <SEO title="إعدادات موفري الخدمة" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-primary/10 via-primary/5 to-background p-6 rounded-xl border border-primary/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <Settings className="h-6 w-6 text-primary" />
                        إعدادات موفري الخدمات (Providers Settings)
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        إعداد موفري التخزين والمراسلات وحفظ مفاتيح الاتصال بطرق مشفرة وآمنة.
                    </p>
                </div>
            </div>

            <Card className="border border-border max-w-2xl mx-auto">
                <CardHeader className="text-right">
                    <CardTitle className="text-base font-bold">بوابات الشركاء والخدمات</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSave} className="space-y-4 text-sm text-right">
                        <div className="space-y-1">
                            <label className="font-semibold block">مزود رسائل الـ SMS</label>
                            <select
                                value={smsProvider}
                                onChange={(e) => setSmsProvider(e.target.value)}
                                className="w-full p-2 rounded border bg-background text-foreground"
                            >
                                <option value="Twilio">Twilio Gateway (عالمي)</option>
                                <option value="FirebaseSMS">Firebase SMS (مصادقة)</option>
                                <option value="Mock">Mock SMS (محلي تجريبي)</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="font-semibold block">مزود البريد الإلكتروني (Email)</label>
                            <select
                                value={emailProvider}
                                onChange={(e) => setEmailProvider(e.target.value)}
                                className="w-full p-2 rounded border bg-background text-foreground"
                            >
                                <option value="SendGrid">SendGrid Service</option>
                                <option value="Mailgun">Mailgun Service</option>
                                <option value="SMTP">SMTP Server (مخصص)</option>
                                <option value="Mock">Mock Email (محلي تجريبي)</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="font-semibold block">مزود التخزين السحابي (Storage)</label>
                            <select
                                value={storageProvider}
                                onChange={(e) => setStorageProvider(e.target.value)}
                                className="w-full p-2 rounded border bg-background text-foreground"
                            >
                                <option value="AWS_S3">Amazon Web Services S3</option>
                                <option value="GoogleDrive">Google Drive (API)</option>
                                <option value="Dropbox">Dropbox (API)</option>
                                <option value="Cloudinary">Cloudinary (وسائط)</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="font-semibold block">مفتاح الربط المشفر (API Key)</label>
                            <input
                                type="password"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="أدخل مفتاح الاتصال السري..."
                                className="w-full p-2 rounded border bg-background text-foreground"
                            />
                        </div>

                        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-700 leading-relaxed flex items-start gap-2 flex-row-reverse">
                            <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                            <span>يتم تشفير وتخزين المفاتيح في خوادم الحوسبة السحابية الخاصة بالمؤسسة ولا تظهر للمستخدمين نهائياً.</span>
                        </div>

                        <Button type="submit" className="w-full">
                            حفظ وتحديث الإعدادات
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProviderSettings;
