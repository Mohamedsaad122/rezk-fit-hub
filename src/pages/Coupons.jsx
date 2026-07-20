import React, { useState } from 'react';
import { useCoupons } from '@/hooks/use-coupons';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { toastService } from '@/services/toast.service';
import { Percent, Plus, Calendar, Tag } from 'lucide-react';

export const Coupons = () => {
    const { coupons, createCoupon, isLoading } = useCoupons();
    const [code, setCode] = useState('');
    const [type, setType] = useState('Percentage');
    const [value, setValue] = useState(10);
    const [maxUses, setMaxUses] = useState(100);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCreateCoupon = async (e) => {
        e.preventDefault();
        if (!code.trim()) {
            toastService.error('الرجاء إدخال كود الخصم');
            return;
        }

        setIsSubmitting(true);
        try {
            await createCoupon({
                code: code.toUpperCase(),
                type,
                value: Number(value),
                maxUses: Number(maxUses),
                expirationDate: '2026-12-31T00:00:00Z',
                organizationId: null
            });
            toastService.success('تم إنشاء كوبون الخصم بنجاح وتفعيله');
            setCode('');
        } catch (error) {
            console.error(error);
            toastService.error('فشل إنشاء كوبون الخصم');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6 text-right" dir="rtl">
            <SEO title="إدارة العروض وكوبونات الخصم" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-primary/10 via-primary/5 to-background p-6 rounded-xl border border-primary/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <Percent className="h-6 w-6 text-primary" />
                        حملات الترويج وكوبونات الخصم للمؤسسات
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        إنشاء عروض ترويجية للعملاء، وتحديد قيم خصومات ثابتة أو نسب مئوية مع قيود على الصلاحية والحد الأقصى للاستخدام.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Create Coupon Form */}
                <Card className="border border-border h-full">
                    <CardHeader className="text-right">
                        <CardTitle className="text-base font-bold flex items-center gap-1.5 flex-row-reverse justify-end">
                            <Plus className="h-4 w-4 text-primary" />
                            توليد كوبون خصم جديد
                        </CardTitle>
                        <CardDescription>أدخل الكود وقيم التخفيض المعتمدة.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreateCoupon} className="space-y-4 text-sm text-right">
                            <div className="space-y-1">
                                <label className="font-semibold block">كود الخصم (رمز ترويجي)</label>
                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    placeholder="مثال: SAVE20"
                                    className="w-full p-2 rounded border bg-background text-foreground"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="font-semibold block">نوع الخصم</label>
                                <select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    className="w-full p-2 rounded border bg-background text-foreground"
                                    required
                                >
                                    <option value="Percentage">نسبة مئوية (%)</option>
                                    <option value="Fixed">مبلغ ثابت (SAR)</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="font-semibold block">قيمة الخصم</label>
                                <input
                                    type="number"
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                    className="w-full p-2 rounded border bg-background text-foreground"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="font-semibold block">الحد الأقصى لمرات الاستخدام</label>
                                <input
                                    type="number"
                                    value={maxUses}
                                    onChange={(e) => setMaxUses(e.target.value)}
                                    className="w-full p-2 rounded border bg-background text-foreground"
                                    required
                                />
                            </div>

                            <Button type="submit" disabled={isSubmitting} className="w-full gap-2">
                                <Plus className="h-4 w-4" />
                                {isSubmitting ? 'جاري التوليد...' : 'تأكيد إنشاء الكوبون'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Coupons List */}
                <div className="lg:col-span-2 space-y-4">
                    {isLoading ? (
                        <div className="text-center py-12 text-muted-foreground">جاري تحميل العروض...</div>
                    ) : (
                        coupons.map((coupon) => (
                            <Card key={coupon.id} className="border border-border">
                                <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="space-y-1 text-right flex-1 min-w-0">
                                        <div className="flex items-center gap-2 justify-start flex-row-reverse">
                                            <Badge variant={coupon.status === 'Active' ? 'default' : 'destructive'} className="text-[10px]">
                                                {coupon.status === 'Active' ? 'نشط ومتاح' : 
                                                 coupon.status === 'Expired' ? 'منتهي الصلاحية' : 'مكتمل الاستخدام'}
                                            </Badge>
                                            <h3 className="font-bold text-base text-foreground flex items-center gap-1.5 flex-row-reverse">
                                                <Tag className="h-4 w-4 text-primary shrink-0" />
                                                {coupon.code}
                                            </h3>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            النوع: {coupon.type === 'Percentage' ? 'نسبة مئوية' : 'مبلغ ثابت'} | 
                                            القيمة: {coupon.value} {coupon.type === 'Percentage' ? '%' : 'SAR'}
                                        </p>
                                        <div className="text-xs text-muted-foreground">
                                            الاستخدام: {coupon.usedCount} من أصل {coupon.maxUses} مرات
                                        </div>
                                    </div>

                                    <div className="text-xs text-muted-foreground flex items-center gap-1.5 justify-start shrink-0">
                                        <Calendar className="h-4 w-4" />
                                        تنتهي في: {coupon.expirationDate ? new Date(coupon.expirationDate).toLocaleDateString('ar-EG') : 'غير محدد'}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Coupons;
