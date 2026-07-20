import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { toastService } from '@/services/toast.service';
import { ArrowLeft, Lock, CheckCircle, ShieldAlert, Key } from 'lucide-react';
import { Link } from 'react-router-dom';
import ROUTES from '@/constants/routes.constants';
import { MfaService } from '@/services/mfa.service';

export const MFASettings = () => {
    const [settings, setSettings] = useState(null);
    const [verificationCode, setVerificationCode] = useState('');
    const [userId] = useState(1); // Mock active logged in user id

    const fetchMfa = async () => {
        try {
            const data = await MfaService.getSettings(userId);
            setSettings(data);
        } catch {
            // ignore
        }
    };

    useEffect(() => {
        fetchMfa();
    }, []);

    const handleSetup = async () => {
        try {
            const data = await MfaService.setupMfa(userId);
            setSettings(data);
            toastService.success('تم إنشاء إعدادات المصادقة الثنائية بنجاح. يرجى مسح رمز الـ QR لتأكيد التفعيل.');
        } catch {
            toastService.error('فشل إعداد المصادقة ثنائية العامل');
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            await MfaService.verifyAndEnableMfa(userId, verificationCode);
            toastService.success('تهانينا! تم تفعيل المصادقة ثنائية العامل بنجاح');
            setVerificationCode('');
            fetchMfa();
        } catch (err) {
            toastService.error(err.message || 'رمز التحقق غير صحيح');
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6 text-right" dir="rtl">
            <SEO title="إعدادات المصادقة الثنائية (MFA)" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-red-500/10 via-primary/5 to-background p-6 rounded-xl border border-red-500/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <Lock className="h-6 w-6 text-red-500" />
                        إعدادات المصادقة ثنائية العامل وحماية الهوية (MFA TOTP)
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        تأمين الدخول بحماية إضافية عن طريق تطبيقات الهواتف الذكية (Google Authenticator / Authy).
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
                {/* Information Status Card */}
                <Card className="border border-border">
                    <CardHeader>
                        <CardTitle className="text-base font-bold">حالة الحماية الحالية</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {settings && settings.enabled ? (
                            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-2">
                                <div className="flex items-center gap-2 flex-row-reverse justify-end font-bold text-emerald-500">
                                    <CheckCircle className="h-5 w-5" />
                                    <span>المصادقة الثنائية مفعلة ونشطة</span>
                                </div>
                                <p className="text-[10px] text-muted-foreground">تتطلب عمليات تسجيل الدخول القادمة إدخال الرمز من تطبيق الجوال.</p>
                            </div>
                        ) : (
                            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-2">
                                <div className="flex items-center gap-2 flex-row-reverse justify-end font-bold text-amber-500">
                                    <ShieldAlert className="h-5 w-5 animate-pulse" />
                                    <span>الحماية الثنائية معطلة حالياً</span>
                                </div>
                                <p className="text-[10px] text-muted-foreground">حسابك عرضة للاختراق بمجرد تسريب كلمة المرور. يوصى بتفعيلها فوراً.</p>
                                <Button onClick={handleSetup} className="w-full text-xs gap-1.5 mt-2">
                                    <Key className="h-4 w-4" />
                                    بدء إعداد المصادقة
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Setup Steps if configured but not yet active */}
                {settings && (
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border border-border">
                            <CardHeader>
                                <CardTitle className="text-base font-bold">خطوات الإعداد والربط</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* QR Code and Secret */}
                                    <div className="space-y-4 border-l border-border pl-6 flex flex-col items-center">
                                        <span className="font-semibold block w-full text-right">1. مسح الرمز المكتوب (QR Code):</span>
                                        <div className="border border-border p-2 bg-white rounded-lg">
                                            <img src={settings.qrCodeUrl} alt="MFA QR Code" className="h-32 w-32" />
                                        </div>
                                        <div className="text-center space-y-1">
                                            <span className="text-muted-foreground text-[10px] block">المفتاح اليدوي:</span>
                                            <code className="bg-muted p-1 text-[10px] rounded font-mono text-primary font-bold">{settings.secret}</code>
                                        </div>
                                    </div>

                                    {/* Verification Form */}
                                    <div className="space-y-4">
                                        <span className="font-semibold block">2. إدخال رمز التحقق لتفعيل الخدمة:</span>
                                        <form onSubmit={handleVerify} className="space-y-4">
                                            <div className="space-y-1">
                                                <input
                                                    type="text"
                                                    value={verificationCode}
                                                    onChange={(e) => setVerificationCode(e.target.value)}
                                                    placeholder="رمز التحقق (مثال: 123456)"
                                                    maxLength={6}
                                                    className="w-full p-2 border bg-background text-foreground font-mono text-xs rounded text-center"
                                                    required
                                                />
                                                <span className="text-[10px] text-muted-foreground block text-right">استخدم الرمز &ldquo;123456&rdquo; لمحاكاة التفعيل الناجح.</span>
                                            </div>
                                            <Button type="submit" className="w-full text-xs">تفعيل المصادقة</Button>
                                        </form>

                                        {/* Recovery codes */}
                                        <div className="space-y-1.5 border-t border-border pt-4 text-right">
                                            <strong className="text-rose-500 font-bold block">رموز الطوارئ الاحتياطية (Recovery Codes):</strong>
                                            <p className="text-[9px] text-muted-foreground pb-2">احتفظ بهذه الأكواد في مكان آمن لاستعادة حسابك في حال فقدان هاتفك المحمول.</p>
                                            <div className="grid grid-cols-2 gap-2 bg-muted/10 p-3 rounded-lg border font-mono text-[9px] text-primary">
                                                {settings.recoveryCodes.map((code, idx) => (
                                                    <span key={idx} className="block text-center">{code}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MFASettings;
