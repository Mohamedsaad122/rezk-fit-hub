import React, { useState } from 'react';
import { useAICoach } from '@/hooks/use-ai-coach';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { toastService } from '@/services/toast.service';
import { Apple, Sparkles, Check } from 'lucide-react';

export const NutritionAssistant = () => {
    const { generateNutrition, isNutritionGenerating } = useAICoach();
    const [name, setName] = useState('سارة أحمد');
    const [age, setAge] = useState(25);
    const [weight, setWeight] = useState(65);
    const [goal, setGoal] = useState('إنقاص الوزن (Weight Loss)');
    const [result, setResult] = useState(null);

    const handleGenerate = async (e) => {
        e.preventDefault();
        try {
            const data = await generateNutrition({
                clientDetails: { name, age, weight },
                goal
            });
            setResult(data);
            toastService.success('تم توليد النظام الغذائي الموصى به بنجاح');
        } catch (error) {
            console.error(error);
            toastService.error('فشل توليد النظام الغذائي');
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6 text-right" dir="rtl">
            <SEO title="مساعد التغذية وتخطيط الوجبات الذكي" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-primary/10 via-primary/5 to-background p-6 rounded-xl border border-primary/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <Apple className="h-6 w-6 text-primary" />
                        مساعد التغذية وتخطيط الوجبات بالذكاء الاصطناعي
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        توليد وجبات مخصصة بناءً على الأوزان المستهدفة ونسب الماكروز وتقليل مخاطر السمنة.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form Inputs */}
                <Card className="border border-border h-full">
                    <CardHeader className="text-right">
                        <CardTitle className="text-base font-bold">معلومات المتدرب الحالية</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleGenerate} className="space-y-4 text-sm text-right">
                            <div className="space-y-1">
                                <label className="font-semibold block">الاسم</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full p-2 rounded border bg-background text-foreground"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="font-semibold block">العمر (سنة)</label>
                                    <input
                                        type="number"
                                        value={age}
                                        onChange={(e) => setAge(Number(e.target.value))}
                                        className="w-full p-2 rounded border bg-background text-foreground"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="font-semibold block">الوزن (كجم)</label>
                                    <input
                                        type="number"
                                        value={weight}
                                        onChange={(e) => setWeight(Number(e.target.value))}
                                        className="w-full p-2 rounded border bg-background text-foreground"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="font-semibold block">الهدف الرئيسي</label>
                                <select
                                    value={goal}
                                    onChange={(e) => setGoal(e.target.value)}
                                    className="w-full p-2 rounded border bg-background text-foreground"
                                >
                                    <option value="إنقاص الوزن (Weight Loss)">إنقاص الوزن (Weight Loss)</option>
                                    <option value="زيادة الكتلة العضلية (Muscle Gain)">زيادة الكتلة العضلية (Muscle Gain)</option>
                                    <option value="المحافظة على الوزن (Maintenance)">المحافظة على الوزن (Maintenance)</option>
                                </select>
                            </div>

                            <Button type="submit" disabled={isNutritionGenerating} className="w-full gap-2">
                                <Sparkles className="h-4 w-4" />
                                {isNutritionGenerating ? 'جاري توليد الخطة التغذوية...' : 'تأكيد وتوليد النظام'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Outputs Panel */}
                <div className="lg:col-span-2 space-y-6">
                    {result && (
                        <div className="space-y-6">
                            {/* Targets Card */}
                            <Card className="border border-border">
                                <CardHeader className="text-right">
                                    <CardTitle className="text-base font-bold text-primary">الأهداف اليومية للماكروز والسعرات</CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                                    <div className="bg-primary/5 p-3 rounded-xl border border-primary/20">
                                        <span className="text-[10px] text-muted-foreground block">السعرات (Calories)</span>
                                        <strong className="text-base text-primary">{result.dailyTarget.calories} سعرة</strong>
                                    </div>
                                    <div className="bg-primary/5 p-3 rounded-xl border border-primary/20">
                                        <span className="text-[10px] text-muted-foreground block">البروتين (Protein)</span>
                                        <strong className="text-base text-primary">{result.dailyTarget.protein} جم</strong>
                                    </div>
                                    <div className="bg-primary/5 p-3 rounded-xl border border-primary/20">
                                        <span className="text-[10px] text-muted-foreground block">الكربوهيدرات (Carbs)</span>
                                        <strong className="text-base text-primary">{result.dailyTarget.carbs} جم</strong>
                                    </div>
                                    <div className="bg-primary/5 p-3 rounded-xl border border-primary/20">
                                        <span className="text-[10px] text-muted-foreground block">الدهون (Fats)</span>
                                        <strong className="text-base text-primary">{result.dailyTarget.fats} جم</strong>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Meals Card */}
                            <Card className="border border-border">
                                <CardHeader className="text-right">
                                    <CardTitle className="text-base font-bold">الوجبات الموصى بها يومياً</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 text-sm text-right">
                                    <div className="divide-y divide-border">
                                        {result.meals.map((meal, idx) => (
                                            <div key={idx} className="py-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 flex-row-reverse">
                                                <div className="space-y-1">
                                                    <h4 className="font-bold text-foreground">{meal.name}</h4>
                                                    <p className="text-xs text-muted-foreground">
                                                        المكونات: {meal.ingredients.join('، ')}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Badge variant="outline" className="text-[10px]">{meal.calories} سعرة</Badge>
                                                    <Badge variant="secondary" className="text-[10px]">{meal.macros.protein} جم بروتين</Badge>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-4 border-t border-border space-y-1 text-xs text-muted-foreground">
                                        <strong className="text-foreground text-sm block mb-1">نصيحة الأخصائي الرياضي:</strong>
                                        <p className="leading-relaxed">{result.advice}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NutritionAssistant;
