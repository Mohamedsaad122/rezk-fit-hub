import React, { useState } from 'react';
import { useLicense } from '@/hooks/use-license';
import { useTenantStore } from '@/store/tenant.store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { toastService } from '@/services/toast.service';
import { ShieldCheck, Plus, Key, Terminal, ShieldAlert } from 'lucide-react';
import { LicenseService } from '@/services/license.service';

export const Licenses = () => {
    const { activeTenantId, tenants } = useTenantStore();
    const { license, updateLicense, validateLicense, isLoading } = useLicense(activeTenantId);
    
    const [licenseKey, setLicenseKey] = useState('');
    const [offlineBlock, setOfflineBlock] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const activeTenantName = tenants.find(t => t.id === activeTenantId)?.name || 'المؤسسة الافتراضية';

    const handleUpdateKey = async (e) => {
        e.preventDefault();
        if (!licenseKey.trim()) {
            toastService.error('الرجاء إدخال مفتاح الترخيص');
            return;
        }

        setIsSaving(true);
        try {
            await updateLicense({
                id: license.id,
                data: {
                    licenseKey: licenseKey.trim(),
                    status: 'Active',
                    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // Extend 1 year
                }
            });
            toastService.success('تم تحديث مفتاح الترخيص بنجاح');
            setLicenseKey('');
            await validateLicense();
        } catch (error) {
            console.error(error);
            toastService.error('فشل تحديث الترخيص');
        } finally {
            setIsSaving(false);
        }
    };

    const handleOfflineActivation = async (e) => {
        e.preventDefault();
        if (!offlineBlock.trim()) {
            toastService.error('الرجاء إدخال كود التفعيل دون اتصال');
            return;
        }

        setIsSaving(true);
        try {
            const parsed = LicenseService.parseOfflineLicense(offlineBlock.trim());
            await updateLicense({
                id: license.id,
                data: parsed
            });
            toastService.success('تم التفعيل دون اتصال بنجاح');
            setOfflineBlock('');
            await validateLicense();
        } catch (error) {
            console.error(error);
            toastService.error(error.message || 'فشل التفعيل دون اتصال');
        } finally {
            setIsSaving(false);
        }
    };

    const handlePingCheck = async () => {
        try {
            const res = await validateLicense();
            toastService.success(res.message || 'اكتمل فحص صلاحية الترخيص');
        } catch (error) {
            console.error(error);
            toastService.error('فشل تشخيص حالة الترخيص');
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6" dir="rtl">
            <SEO title="إدارة التراخيص والتفعيلات الرقمية" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-emerald-500/10 via-emerald-500/5 to-background p-6 rounded-xl border border-emerald-500/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <ShieldCheck className="h-6 w-6 text-emerald-500" />
                        حالة وتراخيص المؤسسة: <span className="text-emerald-600">{activeTenantName}</span>
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        التحقق من صحة التفعيلات، مقاعد المدربين والأجهزة المفعلة، وإعداد التراخيص دون اتصال.
                    </p>
                </div>
                <Button variant="outline" onClick={handlePingCheck} className="border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10">
                    تشخيص الترخيص الآن
                </Button>
            </div>

            {/* License details */}
            {isLoading ? (
                <div className="text-center py-6 text-muted-foreground">جاري تحميل الترخيص...</div>
            ) : license ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2 border-border text-right">
                        <CardHeader className="pb-3 text-right">
                            <div className="flex items-center justify-between flex-row-reverse">
                                <Badge variant={license.status === 'Active' ? 'default' : 'destructive'}>
                                    {license.status === 'Active' ? 'نشط (Active)' : license.status === 'GracePeriod' ? 'فترة سماح' : 'منتهي'}
                                </Badge>
                                <CardTitle className="text-base font-bold flex items-center gap-1.5 justify-start">
                                    <Key className="h-4 w-4 text-primary" />
                                    مفتاح الترخيص المسجل
                                </CardTitle>
                            </div>
                            <CardDescription className="font-mono text-xs break-all pt-2 select-all bg-muted/20 p-2 rounded">
                                {license.licenseKey}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4 text-xs">
                            <div className="bg-muted/20 p-3 rounded border">
                                <span className="text-muted-foreground block mb-0.5">تاريخ إصدار التفعيل</span>
                                <span className="font-semibold text-foreground">{new Date(license.issuedAt).toLocaleDateString('ar-EG')}</span>
                            </div>
                            <div className="bg-muted/20 p-3 rounded border">
                                <span className="text-muted-foreground block mb-0.5">تاريخ انتهاء الترخيص</span>
                                <span className="font-semibold text-foreground">{new Date(license.expiresAt).toLocaleDateString('ar-EG')}</span>
                            </div>
                            <div className="bg-muted/20 p-3 rounded border">
                                <span className="text-muted-foreground block mb-0.5">حصة المقاعد المتاحة (Seats Count)</span>
                                <span className="font-semibold text-foreground">{license.seatsCount} مدرب / موظف</span>
                            </div>
                            <div className="bg-muted/20 p-3 rounded border">
                                <span className="text-muted-foreground block mb-0.5">حصة الأجهزة النشطة (Devices Limit)</span>
                                <span className="font-semibold text-foreground">{license.deviceCount} أجهزة تابلت / شاشات</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Offline Activation Card */}
                    <Card className="border-border">
                        <CardHeader className="text-right">
                            <CardTitle className="text-base font-bold flex items-center gap-1.5 flex-row-reverse justify-end">
                                <Terminal className="h-4 w-4 text-primary" />
                                التفعيل دون اتصال (Offline Activation)
                            </CardTitle>
                            <CardDescription>ألصق كود الترخيص المشفر بصيغة Base64 لتفعيل البيئة دون اتصال بالإنترنت.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleOfflineActivation} className="space-y-3">
                                <textarea
                                    value={offlineBlock}
                                    onChange={(e) => setOfflineBlock(e.target.value)}
                                    placeholder="ألصق كود التفعيل الرقمي هنا..."
                                    rows={4}
                                    className="w-full p-2.5 rounded border border-input bg-background font-mono text-xs text-right"
                                    required
                                />
                                <Button type="submit" disabled={isSaving} className="w-full">
                                    {isSaving ? 'جاري التحقق...' : 'تفعيل الترخيص دون اتصال'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <div className="text-center py-6 text-red-500 font-semibold border border-red-500/20 bg-red-500/5 rounded-lg">
                    لا يتوفر تفعيل مسجل لهذه المؤسسة.
                </div>
            )}
        </div>
    );
};

export default Licenses;
