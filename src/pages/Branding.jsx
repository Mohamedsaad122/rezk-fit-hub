import React, { useState, useEffect } from 'react';
import { useTenantSettings } from '@/hooks/use-tenants';
import { useTenantStore } from '@/store/tenant.store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';
import { toastService } from '@/services/toast.service';
import { Paintbrush, Save, Layout, Type, Palette } from 'lucide-react';

export const Branding = () => {
    const { activeTenantId, tenants } = useTenantStore();
    const { settings, updateSettings, isLoading } = useTenantSettings(activeTenantId);

    const [companyName, setCompanyName] = useState('');
    const [primaryColor, setPrimaryColor] = useState('#0ea5e9');
    const [secondaryColor, setSecondaryColor] = useState('#64748b');
    const [logo, setLogo] = useState('');
    const [darkLogo, setDarkLogo] = useState('');
    const [favicon, setFavicon] = useState('');
    const [typography, setTypography] = useState('Inter');
    const [isSaving, setIsSaving] = useState(false);

    const activeTenantName = tenants.find(t => t.id === activeTenantId)?.name || 'المؤسسة الافتراضية';

    useEffect(() => {
        if (settings) {
            setCompanyName(settings.companyName || '');
            setPrimaryColor(settings.primaryColor || '#0ea5e9');
            setSecondaryColor(settings.secondaryColor || '#64748b');
            setLogo(settings.logo || '');
            setDarkLogo(settings.darkLogo || '');
            setFavicon(settings.favicon || '');
            setTypography(settings.typography || 'Inter');
        }
    }, [settings]);

    const handleSave = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!companyName.trim() || !logo.trim() || !favicon.trim()) {
            toastService.error('الرجاء ملء جميع الحقول الإلزامية');
            return;
        }

        const hexRegex = /^#([0-9a-fA-F]{3}){1,2}$/;
        if (!hexRegex.test(primaryColor) || !hexRegex.test(secondaryColor)) {
            toastService.error('صيغة اللون الست عشرية غير صحيحة (مثال: #0ea5e9)');
            return;
        }

        setIsSaving(true);
        try {
            await updateSettings({
                companyName,
                primaryColor,
                secondaryColor,
                logo,
                darkLogo,
                favicon,
                typography,
                reportBranding: true,
                invoiceBranding: true
            });
            toastService.success('تم حفظ إعدادات الهوية والبث المباشر بنجاح');
        } catch (error) {
            console.error(error);
            toastService.error('فشل في حفظ إعدادات الهوية');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6" dir="rtl">
            <SEO title="تخصيص الهوية والبراندنج للشركاء" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-primary/10 via-primary/5 to-background p-6 rounded-xl border border-primary/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <Paintbrush className="h-6 w-6 text-primary" />
                        تخصيص الهوية المرئية (Branding) لـ: <span className="text-primary">{activeTenantName}</span>
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        تعديل الشعارات، لوحات الألوان الأساسية، خطوط النظام والمستندات لملائمة هوية النادي الخاص بك.
                    </p>
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-6 text-muted-foreground">جاري تحميل الهوية...</div>
            ) : (
                <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* General Settings Card */}
                    <Card className="border border-border text-right lg:col-span-2">
                        <CardHeader className="text-right">
                            <CardTitle className="text-base font-bold flex items-center gap-1.5 flex-row-reverse justify-end">
                                <Layout className="h-4 w-4 text-primary" />
                                إعدادات الهوية العامة والشعارات
                            </CardTitle>
                            <CardDescription>الاسم الإداري وعناوين الشعارات.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="space-y-1">
                                <label className="font-semibold block">اسم العلامة التجارية (Company Name)</label>
                                <input
                                    type="text"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    placeholder="مثال: نادي ريزك للرشاقة"
                                    className="w-full p-2.5 rounded border bg-background"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="font-semibold block">رابط الشعار الرئيسي (Logo URL)</label>
                                    <input
                                        type="text"
                                        value={logo}
                                        onChange={(e) => setLogo(e.target.value)}
                                        placeholder="مثال: /logo.png"
                                        className="w-full p-2.5 rounded border bg-background"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="font-semibold block">رابط الشعار المظلم (Dark Logo)</label>
                                    <input
                                        type="text"
                                        value={darkLogo}
                                        onChange={(e) => setDarkLogo(e.target.value)}
                                        placeholder="مثال: /logo-dark.png"
                                        className="w-full p-2.5 rounded border bg-background"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="font-semibold block">أيقونة التبويب (Favicon URL)</label>
                                <input
                                    type="text"
                                    value={favicon}
                                    onChange={(e) => setFavicon(e.target.value)}
                                    placeholder="مثال: /favicon.ico"
                                    className="w-full p-2.5 rounded border bg-background"
                                    required
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Colors & Fonts Card */}
                    <div className="space-y-6">
                        <Card className="border border-border text-right">
                            <CardHeader className="text-right">
                                <CardTitle className="text-base font-bold flex items-center gap-1.5 flex-row-reverse justify-end">
                                    <Palette className="h-4 w-4 text-primary" />
                                    الألوان والخطوط (CSS Theme)
                                </CardTitle>
                                <CardDescription>تنسيق أنماط المظهر الفوري.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="font-semibold block">اللون الأساسي</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="color"
                                                value={primaryColor}
                                                onChange={(e) => setPrimaryColor(e.target.value)}
                                                className="w-10 h-10 p-0 border rounded cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={primaryColor}
                                                onChange={(e) => setPrimaryColor(e.target.value)}
                                                className="flex-1 p-2 border rounded font-mono text-center"
                                                maxLength={7}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="font-semibold block">اللون الفرعي</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="color"
                                                value={secondaryColor}
                                                onChange={(e) => setSecondaryColor(e.target.value)}
                                                className="w-10 h-10 p-0 border rounded cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={secondaryColor}
                                                onChange={(e) => setSecondaryColor(e.target.value)}
                                                className="flex-1 p-2 border rounded font-mono text-center"
                                                maxLength={7}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="font-semibold block flex items-center gap-1 justify-start flex-row-reverse">
                                        <Type className="h-4 w-4 text-primary" />
                                        نوع الخط الرقمي (Typography)
                                    </label>
                                    <select
                                        value={typography}
                                        onChange={(e) => setTypography(e.target.value)}
                                        className="w-full p-2.5 rounded border bg-background"
                                    >
                                        <option value="Inter">Inter (الافتراضي)</option>
                                        <option value="Outfit">Outfit</option>
                                        <option value="Roboto">Roboto</option>
                                    </select>
                                </div>
                            </CardContent>
                        </Card>

                        <Button type="submit" disabled={isSaving} className="w-full flex items-center justify-center gap-2">
                            <Save className="h-4 w-4" />
                            {isSaving ? 'جاري الحفظ...' : 'حفظ وإرسال الهوية الفورية'}
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default Branding;
