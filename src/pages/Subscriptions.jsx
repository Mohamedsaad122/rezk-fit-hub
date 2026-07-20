import React from 'react';
import { useSubscription } from '@/hooks/use-subscriptions';
import { useTenantStore } from '@/store/tenant.store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { toastService } from '@/services/toast.service';
import { CreditCard, Check, ShieldAlert, Cpu } from 'lucide-react';
import { PLAN_LIMITS } from '@/services/subscription.service';

export const Subscriptions = () => {
    const { activeTenantId, tenants } = useTenantStore();
    const { subscription, updateSubscription, isLoading } = useSubscription(activeTenantId);

    const activeTenantName = tenants.find(t => t.id === activeTenantId)?.name || 'المؤسسة الافتراضية';

    const handleUpgradePlan = async (planId) => {
        try {
            await updateSubscription({
                data: {
                    planId,
                    limits: PLAN_LIMITS[planId]
                }
            });
            toastService.success(`تم تغيير الباقة بنجاح إلى: ${planId}`);
        } catch (error) {
            console.error(error);
            toastService.error('فشل ترقية وتحديث الباقة');
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6" dir="rtl">
            <SEO title="إدارة الاشتراكات والخطط السحابية" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-violet-500/10 via-violet-500/5 to-background p-6 rounded-xl border border-violet-500/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <CreditCard className="h-6 w-6 text-violet-500" />
                        باقات واشتراكات المؤسسة: <span className="text-violet-600">{activeTenantName}</span>
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        تتبع حدود الحصص، والمستندات التخزينية، وتحديد الباقات والخدمات السحابية.
                    </p>
                </div>
            </div>

            {/* Current plan detail */}
            {isLoading ? (
                <div className="text-center py-6 text-muted-foreground">جاري تحميل الاشتراك...</div>
            ) : subscription ? (
                <Card className="border-border">
                    <CardHeader className="text-right">
                        <div className="flex items-center justify-between flex-row-reverse">
                            <Badge className="bg-violet-500 text-white font-bold">{subscription.planId}</Badge>
                            <CardTitle className="text-lg font-bold">الخطة الحالية المطبقة</CardTitle>
                        </div>
                        <CardDescription>
                            تاريخ الصلاحية: من {new Date(subscription.startDate).toLocaleDateString('ar-EG')} إلى {new Date(subscription.endDate).toLocaleDateString('ar-EG')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-right">
                        <div className="bg-muted/30 p-3 rounded-lg border border-border">
                            <span className="text-muted-foreground block mb-0.5">عدد الحسابات المسموح</span>
                            <span className="text-base font-bold text-foreground">{subscription.limits.users} مستخدمين</span>
                        </div>
                        <div className="bg-muted/30 p-3 rounded-lg border border-border">
                            <span className="text-muted-foreground block mb-0.5">مساحة التخزين السحابي</span>
                            <span className="text-base font-bold text-foreground">{subscription.limits.storageGb} GB</span>
                        </div>
                        <div className="bg-muted/30 p-3 rounded-lg border border-border">
                            <span className="text-muted-foreground block mb-0.5">استخراج التقارير والتحليلات</span>
                            <span className="text-base font-bold text-foreground">
                                {subscription.limits.reportsEnabled ? 'مفعلة' : 'غير متوفرة'}
                            </span>
                        </div>
                        <div className="bg-muted/30 p-3 rounded-lg border border-border">
                            <span className="text-muted-foreground block mb-0.5">الربط الفوري API</span>
                            <span className="text-base font-bold text-foreground">
                                {subscription.limits.apiAccessEnabled ? 'متاح' : 'غير متوفر'}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="text-center py-6 text-red-500 font-semibold border border-red-500/20 bg-red-500/5 rounded-lg">
                    لا تتوفر اشتراكات مسجلة لهذه المؤسسة حالياً.
                </div>
            )}

            {/* Pricing Grid cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {Object.keys(PLAN_LIMITS).map((planId) => {
                    const limits = PLAN_LIMITS[planId];
                    const isActive = subscription?.planId === planId;
                    
                    return (
                        <Card key={planId} className={`border ${isActive ? 'border-violet-500 shadow-md ring-1 ring-violet-500/30' : 'border-border'} flex flex-col justify-between`}>
                            <CardHeader className="text-right pb-3">
                                <CardTitle className="text-base font-bold text-foreground">{planId}</CardTitle>
                                <CardDescription className="text-xs">حدود تشغيل باقة {planId}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 text-xs text-right flex-1 flex flex-col justify-between">
                                <ul className="space-y-2 text-muted-foreground">
                                    <li className="flex items-center gap-1.5 justify-start">
                                        <Check className="h-4 w-4 text-violet-500 shrink-0" />
                                        <span>حتى {limits.users} مستخدم</span>
                                    </li>
                                    <li className="flex items-center gap-1.5 justify-start">
                                        <Check className="h-4 w-4 text-violet-500 shrink-0" />
                                        <span>تخزين سعة {limits.storageGb} GB</span>
                                    </li>
                                    <li className="flex items-center gap-1.5 justify-start">
                                        <Check className="h-4 w-4 text-violet-500 shrink-0" />
                                        <span>التقارير: {limits.reportsEnabled ? 'نعم' : 'لا'}</span>
                                    </li>
                                    <li className="flex items-center gap-1.5 justify-start">
                                        <Check className="h-4 w-4 text-violet-500 shrink-0" />
                                        <span>الربط API: {limits.apiAccessEnabled ? 'نعم' : 'لا'}</span>
                                    </li>
                                </ul>

                                <div className="pt-4 border-t border-border mt-4">
                                    {isActive ? (
                                        <Button disabled className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold">
                                            الباقة النشطة
                                        </Button>
                                    ) : (
                                        <Button variant="outline" className="w-full text-violet-600 border-violet-500/30 hover:bg-violet-500/10" onClick={() => handleUpgradePlan(planId)}>
                                            تغيير الباقة
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default Subscriptions;
