import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrganization } from '@/hooks/use-organizations';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toastService } from '@/services/toast.service';
import SEO from '@/components/SEO';
import { Building, Settings, Save, ArrowRight, Palette, Globe } from 'lucide-react';

export const OrganizationDetails = () => {
    const { organizationId } = useParams();
    const { organization, updateSettings, isLoading } = useOrganization(organizationId);

    const [timezone, setTimezone] = useState('Asia/Riyadh');
    const [currency, setCurrency] = useState('SAR');
    const [primaryColor, setPrimaryColor] = useState('#0ea5e9');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (organization?.settings) {
            setTimezone(organization.settings.timezone || 'Asia/Riyadh');
            setCurrency(organization.settings.currency || 'SAR');
            setPrimaryColor(organization.settings.primaryColor || '#0ea5e9');
        }
    }, [organization]);

    const handleSaveSettings = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await updateSettings({
                timezone,
                currency,
                primaryColor,
                logoUrl: organization?.settings?.logoUrl || null
            });
            toastService.success('تم حفظ إعدادات المنظمة بنجاح');
        } catch (error) {
            console.error(error);
            toastService.error('فشل حفظ إعدادات المنظمة');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="text-center py-12 text-muted-foreground">جاري تحميل تفاصيل المنظمة...</div>;
    }

    if (!organization) {
        return (
            <div className="container mx-auto p-6 space-y-6 text-center rtl" dir="rtl">
                <h1 className="text-xl font-bold">المنظمة المطلوبة غير موجودة</h1>
                <Button asChild className="mt-4">
                    <Link to="/organizations">العودة إلى المنظمات</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6" dir="rtl">
            <SEO title={`تفاصيل وإعدادات ${organization.name}`} />

            <div className="flex flex-col sm:flex-row items-center gap-4 text-right">
                <Button asChild variant="ghost" size="icon" className="shrink-0">
                    <Link to="/organizations">
                        <ArrowRight className="h-5 w-5" />
                    </Link>
                </Button>
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <Building className="h-6 w-6 text-primary" />
                        إعدادات المنظمة: {organization.name}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        تخصيص الخيارات اللوجستية، العملات، النطاقات الزمنية وهوية الألوان الفرعية للفرع.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Details Card */}
                <Card className="border border-border">
                    <CardHeader className="text-right">
                        <CardTitle className="text-base font-bold">معلومات المنظمة العامة</CardTitle>
                        <CardDescription>البيانات الأساسية المسجلة إدارياً.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm text-right">
                        <div className="space-y-1">
                            <span className="text-xs text-muted-foreground block">اسم المنظمة:</span>
                            <span className="font-semibold text-foreground">{organization.name}</span>
                        </div>
                        <div className="space-y-1">
                            <span className="text-xs text-muted-foreground block">تاريخ التأسيس والربط:</span>
                            <span className="font-semibold text-foreground">
                                {new Date(organization.createdAt).toLocaleString('ar-EG')}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <span className="text-xs text-muted-foreground block">حالة الحساب:</span>
                            <span className="font-semibold text-foreground">{organization.status === 'Active' ? 'نشط ومفعل' : 'معلق'}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Settings Form Card */}
                <Card className="lg:col-span-2 border border-border">
                    <CardHeader className="text-right">
                        <CardTitle className="text-base font-bold flex items-center gap-1.5 flex-row-reverse justify-end">
                            <Settings className="h-4 w-4 text-primary" />
                            تخصيص الإعدادات اللوجستية والهوية البصرية
                        </CardTitle>
                        <CardDescription>هذه الإعدادات تطبق على مستوى أعضاء وتطبيقات هذه المنظمة الفرعية.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSaveSettings} className="space-y-4 text-sm text-right">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="font-semibold block flex items-center gap-1 justify-start">
                                        <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                                        المنطقة الزمنية (Timezone)
                                    </label>
                                    <select
                                        value={timezone}
                                        onChange={(e) => setTimezone(e.target.value)}
                                        className="w-full p-2 rounded border bg-background"
                                    >
                                        <option value="Asia/Riyadh">Asia/Riyadh (الرياض)</option>
                                        <option value="Asia/Dubai">Asia/Dubai (دبي)</option>
                                        <option value="Asia/Cairo">Asia/Cairo (القاهرة)</option>
                                        <option value="UTC">UTC (غرينتش)</option>
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="font-semibold block flex items-center gap-1 justify-start">
                                        <span className="font-bold text-muted-foreground">$</span>
                                        العملة الافتراضية
                                    </label>
                                    <select
                                        value={currency}
                                        onChange={(e) => setCurrency(e.target.value)}
                                        className="w-full p-2 rounded border bg-background"
                                    >
                                        <option value="SAR">SAR (ريال سعودي)</option>
                                        <option value="AED">AED (درهم إماراتي)</option>
                                        <option value="EGP">EGP (جنيه مصري)</option>
                                        <option value="USD">USD (دولار أمريكي)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="font-semibold block flex items-center gap-1 justify-start">
                                    <Palette className="h-3.5 w-3.5 text-muted-foreground" />
                                    اللون الأساسي للعلامة التجارية للهوية (Color Theme)
                                </label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={primaryColor}
                                        onChange={(e) => setPrimaryColor(e.target.value)}
                                        className="h-10 w-12 rounded border p-0 cursor-pointer"
                                    />
                                    <span className="font-mono text-xs">{primaryColor}</span>
                                </div>
                            </div>

                            <div className="flex justify-end pt-2">
                                <Button type="submit" disabled={isSaving} className="gap-2">
                                    <Save className="h-4 w-4" />
                                    {isSaving ? 'جاري الحفظ...' : 'حفظ الإعدادات والتحديث'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default OrganizationDetails;
