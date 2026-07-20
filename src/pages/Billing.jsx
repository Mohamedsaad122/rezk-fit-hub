import React from 'react';
import { useBilling } from '@/hooks/use-billing';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { toastService } from '@/services/toast.service';
import { CreditCard, Calendar, HardDrive, Users, Check, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Billing = () => {
    const { subscription, isSubscriptionLoading, renewSubscription, cancelSubscription } = useBilling(1);

    const handleRenew = async () => {
        try {
            await renewSubscription();
            toastService.success('تم تجديد الاشتراك السنوي بنجاح');
        } catch (error) {
            console.error(error);
            toastService.error('فشل تجديد الاشتراك');
        }
    };

    const handleCancel = async () => {
        if (!window.confirm('هل أنت متأكد من رغبتك في إلغاء الاشتراك؟ ستفقد الوصول للميزات المتقدمة عند نهاية الفترة.')) return;
        try {
            await cancelSubscription();
            toastService.success('تم إلغاء الاشتراك بنجاح');
        } catch (error) {
            console.error(error);
            toastService.error('فشل إلغاء الاشتراك');
        }
    };

    if (isSubscriptionLoading) {
        return <div className="text-center py-12 text-muted-foreground">جاري تحميل بيانات الفوترة والاشتراك...</div>;
    }

    return (
        <div className="container mx-auto p-6 space-y-6" dir="rtl">
            <SEO title="إدارة الاشتراك والفوترة" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-primary/10 via-primary/5 to-background p-6 rounded-xl border border-primary/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <CreditCard className="h-6 w-6 text-primary" />
                        حساب الفوترة والاشتراكات السحابية
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        متابعة ترخيص نسختك، دورة تجديد الفواتير، استهلاك الموارد المتاحة وترقية الخطة.
                    </p>
                </div>
                <Button asChild className="shrink-0 bg-gradient-primary text-white">
                    <Link to="/billing/checkout">ترقية الخطة / دفع مستحق</Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Subscription Status Card */}
                <Card className="border border-border">
                    <CardHeader className="text-right">
                        <CardTitle className="text-base font-bold">حالة الاشتراك الحالي</CardTitle>
                        <CardDescription>الترخيص الحالي وخيارات التحكم.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm text-right">
                        <div className="flex justify-between items-center flex-row-reverse">
                            <span className="text-muted-foreground">الباقة:</span>
                            <Badge className="bg-primary text-white text-xs">{subscription?.planId || 'غير محدد'}</Badge>
                        </div>
                        <div className="flex justify-between items-center flex-row-reverse">
                            <span className="text-muted-foreground">الحالة:</span>
                            <Badge variant={subscription?.status === 'Active' ? 'default' : 'destructive'} className="text-xs">
                                {subscription?.status === 'Active' ? 'نشط ومفعل' : 
                                 subscription?.status === 'Trialing' ? 'فترة تجريبية' : 
                                 subscription?.status === 'PastDue' ? 'متأخر السداد' : 'معلق / ملغى'}
                            </Badge>
                        </div>
                        <div className="flex justify-between items-center flex-row-reverse">
                            <span className="text-muted-foreground">تاريخ البدء:</span>
                            <span className="font-semibold">{subscription?.startDate ? new Date(subscription.startDate).toLocaleDateString('ar-EG') : '-'}</span>
                        </div>
                        <div className="flex justify-between items-center flex-row-reverse">
                            <span className="text-muted-foreground">تاريخ انتهاء الصلاحية:</span>
                            <span className="font-semibold">{subscription?.endDate ? new Date(subscription.endDate).toLocaleDateString('ar-EG') : '-'}</span>
                        </div>

                        <div className="pt-4 border-t border-border flex gap-2 justify-end">
                            {subscription?.status !== 'Cancelled' && (
                                <Button onClick={handleCancel} variant="outline" size="sm" className="text-destructive border-destructive/20 hover:bg-destructive/10">
                                    إلغاء الاشتراك
                                </Button>
                            )}
                            <Button onClick={handleRenew} size="sm" className="gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                تجديد الاشتراك الشهري
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Plan Limits Card */}
                <Card className="lg:col-span-2 border border-border">
                    <CardHeader className="text-right">
                        <CardTitle className="text-base font-bold">حدود استهلاك الموارد المتاحة</CardTitle>
                        <CardDescription>الاستهلاك الفعلي للمساحة والمستخدمين وفق الترخيص.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-right">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 justify-start flex-row-reverse">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                    <Users className="h-5 w-5" />
                                </div>
                                <div className="space-y-0.5">
                                    <span className="text-xs text-muted-foreground block">عدد مقاعد المستخدمين (الموظفين):</span>
                                    <span className="font-bold text-foreground">الحد الأقصى المسموح: {subscription?.limits?.users || 10} مستخدم</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 justify-start flex-row-reverse">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                    <HardDrive className="h-5 w-5" />
                                </div>
                                <div className="space-y-0.5">
                                    <span className="text-xs text-muted-foreground block">مساحة التخزين السحابي للمستندات:</span>
                                    <span className="font-bold text-foreground">الحد الأقصى المسموح: {subscription?.limits?.storageGb || 20} جيجابايت</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 border-r border-border pr-6">
                            <h4 className="font-bold text-xs text-muted-foreground uppercase block mb-3">الميزات المفعلة في خطتك:</h4>
                            <div className="space-y-2 text-xs">
                                <div className="flex items-center gap-2 justify-start flex-row-reverse">
                                    {subscription?.limits?.reportsEnabled ? <Check className="h-4 w-4 text-emerald-500" /> : <AlertCircle className="h-4 w-4 text-muted-foreground" />}
                                    <span>التقارير التحليلية المتقدمة ومخططات الأداء</span>
                                </div>
                                <div className="flex items-center gap-2 justify-start flex-row-reverse">
                                    {subscription?.limits?.analyticsEnabled ? <Check className="h-4 w-4 text-emerald-500" /> : <AlertCircle className="h-4 w-4 text-muted-foreground" />}
                                    <span>محرك تحليلات الأعضاء والمتدربين</span>
                                </div>
                                <div className="flex items-center gap-2 justify-start flex-row-reverse">
                                    {subscription?.limits?.realtimeEnabled ? <Check className="h-4 w-4 text-emerald-500" /> : <AlertCircle className="h-4 w-4 text-muted-foreground" />}
                                    <span>التحديثات الفورية والاشعارات المتزامنة</span>
                                </div>
                                <div className="flex items-center gap-2 justify-start flex-row-reverse">
                                    {subscription?.limits?.apiAccessEnabled ? <Check className="h-4 w-4 text-emerald-500" /> : <AlertCircle className="h-4 w-4 text-muted-foreground" />}
                                    <span>الوصول البرمجي المباشر لواجهة برمجة التطبيقات (API)</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Billing;
