import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { toastService } from '@/services/toast.service';
import { ArrowLeft, Key, Plus, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import ROUTES from '@/constants/routes.constants';
import { SecretService } from '@/services/secret.service';

export const SecretsVault = () => {
    const [secrets, setSecrets] = useState([]);
    const [key, setKey] = useState('');
    const [value, setValue] = useState('');
    const [env, setEnv] = useState('Production');
    const [visibleSecrets, setVisibleSecrets] = useState({});

    const fetchSecrets = async () => {
        try {
            const list = await SecretService.getSecrets();
            setSecrets(list);
        } catch {
            // ignore
        }
    };

    useEffect(() => {
        fetchSecrets();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!key || !value) return;

        try {
            await SecretService.createSecret(key, value, env);
            setKey('');
            setValue('');
            toastService.success('تم حفظ وتأمين السر الجديد في الخزنة بنجاح');
            fetchSecrets();
        } catch {
            toastService.error('فشل حفظ الرمز المشفر');
        }
    };

    const handleRotate = async (id) => {
        const newValue = `rotated_val_${Math.random().toString(36).substring(2, 10)}`;
        try {
            await SecretService.rotateSecret(id, newValue);
            toastService.success('تم تدوير قيمة السر وتحديث رقم النسخة بنجاح');
            fetchSecrets();
        } catch {
            toastService.error('فشل تدوير قيمة السر');
        }
    };

    const toggleVisibility = (id) => {
        setVisibleSecrets(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <div className="container mx-auto p-6 space-y-6 text-right" dir="rtl">
            <SEO title="خزنة المفاتيح والأسرار المشفرة" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-red-500/10 via-primary/5 to-background p-6 rounded-xl border border-red-500/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <Key className="h-6 w-6 text-red-500" />
                        خزنة الأسرار ومفاتيح البيئة المشفرة (Secrets Vault)
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        إدارة وتخزين المتغيرات الحساسة ومفاتيح الربط البرمجية بشكل آمن وتشفير البيانات أثناء الحفظ.
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
                {/* Secret register form */}
                <Card className="border border-border">
                    <CardHeader>
                        <CardTitle className="text-base font-bold">تسجيل سر جديد</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="space-y-1">
                                <label className="font-semibold block">اسم متغير البيئة (KEY):</label>
                                <input
                                    type="text"
                                    value={key}
                                    onChange={(e) => setKey(e.target.value)}
                                    placeholder="مثال: STRIPE_SECRET_KEY"
                                    className="w-full p-2 border bg-background text-foreground text-xs rounded font-mono"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="font-semibold block">قيمة المتغير (VALUE):</label>
                                <input
                                    type="text"
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    placeholder="أدخل السر المراد تشفيره"
                                    className="w-full p-2 border bg-background text-foreground text-xs rounded font-mono"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="font-semibold block">الملف التعريفي للبيئة:</label>
                                <select
                                    value={env}
                                    onChange={(e) => setEnv(e.target.value)}
                                    className="w-full p-2 border bg-background text-foreground text-xs rounded"
                                >
                                    <option value="Production">Production Profile</option>
                                    <option value="Staging">Staging Profile</option>
                                    <option value="Development">Development Profile</option>
                                </select>
                            </div>

                            <Button type="submit" className="w-full text-xs gap-1">
                                <Plus className="h-4 w-4" />
                                تأمين السر
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Vault listing */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border border-border">
                        <CardHeader>
                            <CardTitle className="text-base font-bold">أسرار البيئة الموثقة</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {secrets.length === 0 ? (
                                <div className="text-center py-16 text-muted-foreground text-xs">لا توجد متغيرات مسجلة في الخزنة حالياً.</div>
                            ) : (
                                secrets.map(sec => (
                                    <div key={sec.id} className="p-4 border border-border rounded-xl flex flex-col gap-4 text-right bg-muted/5 font-mono">
                                        <div className="flex justify-between items-center flex-row-reverse">
                                            <div className="flex items-center gap-2 flex-row-reverse">
                                                <strong className="text-base text-foreground font-bold">{sec.key}</strong>
                                                <Badge variant="default" className="text-[9px]">{sec.environment}</Badge>
                                                <Badge variant="outline" className="text-[9px]">v{sec.version}</Badge>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => toggleVisibility(sec.id)}>
                                                    {visibleSecrets[sec.id] ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                                                </Button>
                                                <Button size="xs" variant="outline" onClick={() => handleRotate(sec.id)} className="gap-1 text-xs">
                                                    <RefreshCw className="h-3 w-3" />
                                                    تدوير
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="border-t border-border pt-4 text-right flex justify-between items-center flex-row-reverse">
                                            <span className="text-muted-foreground text-[10px]">قيمة المتغير المشفرة:</span>
                                            <span className="text-primary text-[11px] font-bold">
                                                {visibleSecrets[sec.id] ? sec.value : '••••••••••••••••••••••••••••••••'}
                                            </span>
                                        </div>

                                        <div className="text-[9px] text-muted-foreground text-left">
                                            <span>آخر تدوير: {new Date(sec.lastRotatedAt).toLocaleDateString()}</span>
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

export default SecretsVault;
