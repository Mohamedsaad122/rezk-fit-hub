import React, { useState } from 'react';
import { useIntegrationsStore } from '@/store/integrations.store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';
import { toastService } from '@/services/toast.service';
import { MessageSquare, Phone } from 'lucide-react';

export const SMSProviders = () => {
    const { smsProvider, setSmsProvider } = useIntegrationsStore();
    const [accountSid, setAccountSid] = useState('');
    const [authToken, setAuthToken] = useState('');
    const [fromNumber, setFromNumber] = useState('');

    const handleSave = (e) => {
        e.preventDefault();
        toastService.success('تم ربط وحفظ إعدادات خادم الرسائل القصيرة SMS');
    };

    return (
        <div className="container mx-auto p-6 space-y-6 text-right" dir="rtl">
            <SEO title="إعدادات رسائل SMS" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-primary/10 via-primary/5 to-background p-6 rounded-xl border border-primary/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <MessageSquare className="h-6 w-6 text-primary" />
                        بوابات الرسائل القصيرة والتحقق (SMS Gateways)
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        إرسال رسائل التحقق (OTP) والتذكير اليومي بالتمارين والاشتراكات المقتربة من الانتهاء.
                    </p>
                </div>
            </div>

            <Card className="border border-border max-w-xl mx-auto">
                <CardHeader className="text-right">
                    <CardTitle className="text-base font-bold flex items-center gap-1.5 flex-row-reverse justify-end">
                        <Phone className="h-5 w-5 text-primary" />
                        إعداد بوابة رسائل SMS
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSave} className="space-y-4 text-sm text-right">
                        <div className="space-y-1">
                            <label className="font-semibold block">المزود النشط (SMS Provider)</label>
                            <select
                                value={smsProvider}
                                onChange={(e) => setSmsProvider(e.target.value)}
                                className="w-full p-2 rounded border bg-background text-foreground"
                            >
                                <option value="Twilio">Twilio Service</option>
                                <option value="FirebaseSMS">Firebase SMS Gateway</option>
                                <option value="Mock">Mock SMS Gateway</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="font-semibold block">معرف الحساب (Account SID)</label>
                            <input
                                type="text"
                                value={accountSid}
                                onChange={(e) => setAccountSid(e.target.value)}
                                placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                                className="w-full p-2 rounded border bg-background text-foreground text-xs"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="font-semibold block">رمز التوثيق (Auth Token)</label>
                            <input
                                type="password"
                                value={authToken}
                                onChange={(e) => setAuthToken(e.target.value)}
                                placeholder="أدخل رمز التوثيق..."
                                className="w-full p-2 rounded border bg-background text-foreground text-xs"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="font-semibold block">رقم المرسل المعتمد (Sender Number / Sender ID)</label>
                            <input
                                type="text"
                                value={fromNumber}
                                onChange={(e) => setFromNumber(e.target.value)}
                                placeholder="+1234567890"
                                className="w-full p-2 rounded border bg-background text-foreground text-xs"
                            />
                        </div>

                        <Button type="submit" className="w-full">
                            حفظ وتفعيل بوابة الرسائل
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default SMSProviders;
