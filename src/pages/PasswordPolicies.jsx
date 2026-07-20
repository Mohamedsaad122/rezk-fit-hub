import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';
import { toastService } from '@/services/toast.service';
import { ArrowLeft, Key, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import ROUTES from '@/constants/routes.constants';
import { SecurityService } from '@/services/security.service';

export const PasswordPolicies = () => {
    const [config, setConfig] = useState({
        passwordMinLength: 8,
        passwordRequireSpecialChar: true,
        passwordRequireNumbers: true,
        passwordRequireUppercase: true,
        passwordHistoryCount: 5,
        passwordExpirationDays: 90,
        maxFailedAttempts: 5,
        lockoutDurationMinutes: 15
    });

    const fetchConfig = async () => {
        try {
            const data = await SecurityService.getConfig();
            setConfig(data);
        } catch {
            // ignore
        }
    };

    useEffect(() => {
        fetchConfig();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await SecurityService.updateConfig(config);
            toastService.success('تم حفظ وتطبيق سياسات الأمان وكلمة المرور الجديدة بنجاح');
            fetchConfig();
        } catch {
            toastService.error('فشل حفظ إعدادات السياسة');
        }
    };

    const handleToggle = (key) => {
        setConfig(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleNumberChange = (key, val) => {
        setConfig(prev => ({ ...prev, [key]: Number(val) }));
    };

    return (
        <div className="container mx-auto p-6 space-y-6 text-right" dir="rtl">
            <SEO title="سياسات الأمان وكلمات المرور" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-red-500/10 via-primary/5 to-background p-6 rounded-xl border border-red-500/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <Key className="h-6 w-6 text-red-500" />
                        إدارة سياسات الأمان وقوة كلمات المرور (Password Policies)
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        تعيين قيود قوة الرموز، تكرار التاريخ، فترات الصلاحية، ومهل القفل التلقائي للحسابات.
                    </p>
                </div>
                <Button asChild variant="outline" size="sm">
                    <Link to={ROUTES.SECURITY_CENTER} className="gap-1">
                        <ArrowLeft className="h-4 w-4" />
                        العودة للمركز
                    </Link>
                </Button>
            </div>

            <Card className="border border-border max-w-3xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-base font-bold">تخصيص قواعد الأمان وحماية الهوية</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSave} className="space-y-6 text-xs text-right">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Password Length */}
                            <div className="space-y-1">
                                <label className="font-semibold block">الحد الأدنى لطول كلمة المرور (رموز):</label>
                                <input
                                    type="number"
                                    value={config.passwordMinLength}
                                    onChange={(e) => handleNumberChange('passwordMinLength', e.target.value)}
                                    className="w-full p-2 border bg-background text-foreground text-xs rounded"
                                    min={8}
                                    max={32}
                                    required
                                />
                            </div>

                            {/* Password Expiration */}
                            <div className="space-y-1">
                                <label className="font-semibold block">صلاحية كلمة المرور (أيام):</label>
                                <input
                                    type="number"
                                    value={config.passwordExpirationDays}
                                    onChange={(e) => handleNumberChange('passwordExpirationDays', e.target.value)}
                                    className="w-full p-2 border bg-background text-foreground text-xs rounded"
                                    min={0}
                                    required
                                />
                            </div>

                            {/* Max Failed attempts */}
                            <div className="space-y-1">
                                <label className="font-semibold block">الحد الأقصى لمحاولات الدخول الخاطئة:</label>
                                <input
                                    type="number"
                                    value={config.maxFailedAttempts}
                                    onChange={(e) => handleNumberChange('maxFailedAttempts', e.target.value)}
                                    className="w-full p-2 border bg-background text-foreground text-xs rounded"
                                    min={3}
                                    required
                                />
                            </div>

                            {/* Lockout duration */}
                            <div className="space-y-1">
                                <label className="font-semibold block">مدة القفل التلقائي للحساب (دقائق):</label>
                                <input
                                    type="number"
                                    value={config.lockoutDurationMinutes}
                                    onChange={(e) => handleNumberChange('lockoutDurationMinutes', e.target.value)}
                                    className="w-full p-2 border bg-background text-foreground text-xs rounded"
                                    min={1}
                                    required
                                />
                            </div>
                        </div>

                        {/* Complexity rules */}
                        <div className="border-t border-border pt-4 space-y-3 text-right">
                            <h4 className="font-bold text-foreground block">اشتراطات كتابة كلمة المرور:</h4>
                            
                            <label className="flex items-center gap-2 flex-row-reverse justify-end cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={config.passwordRequireSpecialChar}
                                    onChange={() => handleToggle('passwordRequireSpecialChar')}
                                    className="rounded border-border text-primary focus:ring-primary"
                                />
                                <span>يجب أن تحتوي على رمز خاص واحد على الأقل (!@#$)</span>
                            </label>

                            <label className="flex items-center gap-2 flex-row-reverse justify-end cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={config.passwordRequireNumbers}
                                    onChange={() => handleToggle('passwordRequireNumbers')}
                                    className="rounded border-border text-primary focus:ring-primary"
                                />
                                <span>يجب أن تحتوي على أرقام (0-9)</span>
                            </label>

                            <label className="flex items-center gap-2 flex-row-reverse justify-end cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={config.passwordRequireUppercase}
                                    onChange={() => handleToggle('passwordRequireUppercase')}
                                    className="rounded border-border text-primary focus:ring-primary"
                                />
                                <span>يجب أن تحتوي على أحرف كبيرة (A-Z)</span>
                            </label>
                        </div>

                        <Button type="submit" className="w-full gap-2 text-xs">
                            <Save className="h-4 w-4" />
                            حفظ وتطبيق سياسات الأمان
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default PasswordPolicies;
