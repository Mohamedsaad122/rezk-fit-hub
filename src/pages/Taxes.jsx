import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { toastService } from '@/services/toast.service';
import { Settings, Plus, Landmark } from 'lucide-react';

export const Taxes = () => {
    const [taxRules, setTaxRules] = useState([
        { id: 1, country: 'SA', name: 'VAT', rate: 15, status: 'Active' },
        { id: 2, country: 'AE', name: 'VAT', rate: 5, status: 'Active' },
        { id: 3, country: 'EG', name: 'VAT', rate: 14, status: 'Active' }
    ]);

    const [country, setCountry] = useState('');
    const [name, setName] = useState('');
    const [rate, setRate] = useState(15);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCreateRule = (e) => {
        e.preventDefault();
        if (!country.trim() || !name.trim()) {
            toastService.error('الرجاء تعبئة جميع الحقول المطلوبة');
            return;
        }

        setIsSubmitting(true);
        try {
            const newRule = {
                id: taxRules.length + 1,
                country: country.toUpperCase(),
                name,
                rate: Number(rate),
                status: 'Active'
            };
            setTaxRules([...taxRules, newRule]);
            toastService.success('تمت إضافة قاعدة احتساب الضريبة بنجاح');
            setCountry('');
            setName('');
        } catch (error) {
            console.error(error);
            toastService.error('فشل حفظ قاعدة الضريبة');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6 text-right" dir="rtl">
            <SEO title="إعدادات قواعد الضرائب والرسوم" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-primary/10 via-primary/5 to-background p-6 rounded-xl border border-primary/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <Settings className="h-6 w-6 text-primary" />
                        إعدادات الضريبة الإقليمية (VAT / GST)
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        رصد وتهيئة نسب الضرائب المطبقة حسب البلد المصدر ونوع النشاط لإرفاقها بالفواتير تلقائياً.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Create Tax Form */}
                <Card className="border border-border h-full">
                    <CardHeader className="text-right">
                        <CardTitle className="text-base font-bold flex items-center gap-1.5 flex-row-reverse justify-end">
                            <Plus className="h-4 w-4 text-primary" />
                            تعريف ضريبة دولة جديدة
                        </CardTitle>
                        <CardDescription>إدخال كود الدولة ونسب الاستقطاع المقررة.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreateRule} className="space-y-4 text-sm text-right">
                            <div className="space-y-1">
                                <label className="font-semibold block">كود الدولة (ISO 3166-1 alpha-2)</label>
                                <input
                                    type="text"
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    placeholder="مثال: SA"
                                    maxLength={2}
                                    className="w-full p-2 rounded border bg-background text-foreground uppercase"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="font-semibold block">مسمى الضريبة (مثال: VAT)</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="مثال: VAT"
                                    className="w-full p-2 rounded border bg-background text-foreground"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="font-semibold block">نسبة الضريبة المقررة (%)</label>
                                <input
                                    type="number"
                                    value={rate}
                                    onChange={(e) => setRate(e.target.value)}
                                    className="w-full p-2 rounded border bg-background text-foreground"
                                    required
                                />
                            </div>

                            <Button type="submit" disabled={isSubmitting} className="w-full gap-2">
                                <Plus className="h-4 w-4" />
                                {isSubmitting ? 'جاري الحفظ...' : 'تأكيد وحفظ القاعدة'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Tax Rules List */}
                <div className="lg:col-span-2 space-y-4">
                    {taxRules.map((rule) => (
                        <Card key={rule.id} className="border border-border">
                            <CardContent className="p-4 flex justify-between items-center gap-4 flex-row-reverse text-right">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 justify-start flex-row-reverse">
                                        <Badge variant="default" className="text-[10px]">
                                            {rule.status === 'Active' ? 'نشط' : 'معطل'}
                                        </Badge>
                                        <h3 className="font-bold text-base text-foreground flex items-center gap-1.5 flex-row-reverse">
                                            <Landmark className="h-4 w-4 text-primary shrink-0" />
                                            رمز الدولة: {rule.country}
                                        </h3>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        الضريبة المطبقة: {rule.name}
                                    </p>
                                </div>

                                <div className="text-base font-extrabold text-primary shrink-0">
                                    {rule.rate}%
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Taxes;
