import React, { useState } from 'react';
import { useCheckoutStore } from '@/store/checkout.store';
import { useCoupons } from '@/hooks/use-coupons';
import { usePayments } from '@/hooks/use-payments';
import { useBilling } from '@/hooks/use-billing';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { toastService } from '@/services/toast.service';
import { CreditCard, Tag, Landmark, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Checkout = () => {
    const navigate = useNavigate();
    const { selectedPlan, setSelectedPlan, totals, couponCode, setCouponDetails, taxCountry, setTaxCountry, recalculate } = useCheckoutStore();
    const { validateCoupon } = useCoupons();
    const { processPayment } = usePayments();
    const { renewSubscription } = useBilling(1);

    const [enteredCode, setEnteredCode] = useState('');
    const [gateway, setGateway] = useState('Stripe');
    const [isProcessing, setIsProcessing] = useState(false);

    const plansList = [
        { id: 'Starter', name: 'الباقة المبتدئة (Starter)', price: 300 },
        { id: 'Professional', name: 'الباقة الاحترافية (Professional)', price: 1000 },
        { id: 'Business', name: 'باقة الأعمال (Business)', price: 3000 }
    ];

    const countriesTax = [
        { code: 'SA', name: 'المملكة العربية السعودية (15% VAT)', rate: 15 },
        { code: 'AE', name: 'الإمارات العربية المتحدة (5% VAT)', rate: 5 },
        { code: 'EG', name: 'جمهورية مصر العربية (14% VAT)', rate: 14 },
        { code: 'US', name: 'الولايات المتحدة (0% Sales Tax)', rate: 0 }
    ];

    const handleApplyCoupon = async (e) => {
        e.preventDefault();
        if (!enteredCode.trim()) return;

        try {
            const coupon = await validateCoupon({ code: enteredCode, organizationId: 1 });
            setCouponDetails(coupon);
            toastService.success(`تم تطبيق كود الخصم: ${coupon.code} بنجاح`);
        } catch (error) {
            console.error(error);
            toastService.error(error.message || 'كود الخصم غير صالح أو منتهي الصلاحية');
        }
    };

    const handleCompleteCheckout = async () => {
        setIsProcessing(true);
        try {
            // 1. Process payment (mock)
            const paymentResult = await processPayment({
                invoiceId: 2, // mock invoice target
                amount: totals.total,
                method: gateway === 'Stripe' || gateway === 'PayPal' ? 'CreditCard' : 'BankTransfer',
                gateway
            });

            if (paymentResult.status === 'Success') {
                // 2. Renew / upgrade subscription plan limits
                await renewSubscription();
                toastService.success('تمت تسوية المدفوعات وتجديد الاشتراك بنجاح');
                navigate('/billing');
            } else {
                toastService.error('فشلت عملية الدفع الإلكتروني');
            }
        } catch (error) {
            console.error(error);
            toastService.error('حدث خطأ أثناء إتمام عملية الشراء');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6 text-right" dir="rtl">
            <SEO title="إتمام الدفع والاشتراك" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-primary/10 via-primary/5 to-background p-6 rounded-xl border border-primary/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <Sparkles className="h-6 w-6 text-primary" />
                        بوابة إتمام الدفع والترقية الفورية
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        تخصيص اشتراكك، وتطبيق قسائم الترويج، وتحديد خيارات تحصيل الضريبة وبوابات السداد.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Plans and Tax Settings */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Plan Selector */}
                    <Card className="border border-border">
                        <CardHeader className="text-right">
                            <CardTitle className="text-base font-bold">1. اختر باقة الاشتراك المستهدفة</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {plansList.map(plan => (
                                    <button
                                        key={plan.id}
                                        onClick={() => setSelectedPlan(plan)}
                                        className={`p-4 rounded-xl border text-right transition-all flex flex-col justify-between h-32
                                            ${selectedPlan.id === plan.id 
                                                ? 'border-primary bg-primary/5 shadow-md' 
                                                : 'border-border hover:bg-muted/10'
                                            }
                                        `}
                                    >
                                        <span className="font-bold text-sm">{plan.name}</span>
                                        <span className="text-base font-extrabold text-primary">{plan.price} SAR / شهر</span>
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tax Settings */}
                    <Card className="border border-border">
                        <CardHeader className="text-right">
                            <CardTitle className="text-base font-bold">2. اختيار جهة احتساب الضرائب والرسوم</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {countriesTax.map(country => (
                                    <button
                                        key={country.code}
                                        onClick={() => setTaxCountry(country.code, country.rate)}
                                        className={`p-3 rounded-lg border text-right transition-all text-xs font-semibold
                                            ${taxCountry === country.code 
                                                ? 'border-primary bg-primary/5 font-bold' 
                                                : 'border-border hover:bg-muted/10'
                                            }
                                        `}
                                    >
                                        {country.name}
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Gateways */}
                    <Card className="border border-border">
                        <CardHeader className="text-right">
                            <CardTitle className="text-base font-bold">3. اختيار بوابة وطريقة الدفع</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold">
                            {['Stripe', 'PayPal', 'Moyasar', 'MyFatoorah'].map(gw => (
                                <button
                                    key={gw}
                                    onClick={() => setGateway(gw)}
                                    className={`p-3 rounded-lg border text-center transition-all
                                        ${gateway === gw 
                                            ? 'border-primary bg-primary/5 font-bold' 
                                            : 'border-border hover:bg-muted/10'
                                        }
                                    `}
                                >
                                    {gw === 'Stripe' && <CreditCard className="h-4 w-4 mx-auto mb-1.5" />}
                                    {gw !== 'Stripe' && <Landmark className="h-4 w-4 mx-auto mb-1.5" />}
                                    {gw}
                                </button>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Summary Panel */}
                <Card className="border border-border h-full flex flex-col justify-between">
                    <CardHeader className="text-right">
                        <CardTitle className="text-base font-bold">ملخص الفاتورة وإتمام الطلب</CardTitle>
                        <CardDescription>مراجعة التكاليف الإجمالية للطلب.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 text-sm text-right flex-1">
                        <div className="space-y-2 border-b border-border pb-4">
                            <div className="flex justify-between flex-row-reverse text-muted-foreground">
                                <span>الباقة المحددة:</span>
                                <span className="font-bold text-foreground">{selectedPlan.name}</span>
                            </div>
                            <div className="flex justify-between flex-row-reverse text-muted-foreground">
                                <span>القيمة الأساسية:</span>
                                <span>{totals.subtotal} SAR</span>
                            </div>
                            <div className="flex justify-between flex-row-reverse text-muted-foreground">
                                <span>الخصومات المطبقة:</span>
                                <span className="text-emerald-600">-{totals.discount} SAR</span>
                            </div>
                            <div className="flex justify-between flex-row-reverse text-muted-foreground">
                                <span>الضرائب والرسوم:</span>
                                <span>+{totals.tax} SAR</span>
                            </div>
                        </div>

                        {/* Apply Coupon Form */}
                        <form onSubmit={handleApplyCoupon} className="flex gap-2">
                            <input
                                type="text"
                                value={enteredCode}
                                onChange={(e) => setEnteredCode(e.target.value)}
                                placeholder="كود الخصم (مثال: PROMO10)"
                                className="flex-1 p-2 rounded border bg-background text-xs"
                            />
                            <Button type="submit" size="sm" variant="outline" className="gap-1 text-xs">
                                <Tag className="h-3 w-3" />
                                تطبيق
                            </Button>
                        </form>

                        <div className="flex justify-between flex-row-reverse border-t border-border pt-4 text-base font-bold text-foreground">
                            <span>إجمالي مبلغ الدفع:</span>
                            <span className="text-primary">{totals.total} SAR</span>
                        </div>
                    </CardContent>

                    <div className="p-6 border-t border-border bg-muted/20">
                        <Button
                            onClick={handleCompleteCheckout}
                            disabled={isProcessing}
                            className="w-full bg-gradient-primary text-white h-10"
                        >
                            {isProcessing ? 'جاري تحصيل المدفوعات...' : 'إتمام السداد والترقية الآن'}
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Checkout;
