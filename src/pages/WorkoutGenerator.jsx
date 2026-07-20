import React, { useState } from 'react';
import { useAICoach } from '@/hooks/use-ai-coach';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { toastService } from '@/services/toast.service';
import { Dumbbell, Sparkles, Clock, Check } from 'lucide-react';

export const WorkoutGenerator = () => {
    const { generateWorkout, isWorkoutGenerating } = useAICoach();
    const [clientName, setClientName] = useState('سارة أحمد');
    const [targetMuscle, setTargetMuscle] = useState('Chest (الصدر)');
    const [fitnessLevel, setFitnessLevel] = useState('Beginner (مبتدئ)');
    const [result, setResult] = useState(null);

    const handleGenerate = async (e) => {
        e.preventDefault();
        try {
            const data = await generateWorkout({
                clientName,
                targetMuscle,
                fitnessLevel
            });
            setResult(data);
            toastService.success('تم توليد خطة التمارين المخصصة بنجاح');
        } catch (error) {
            console.error(error);
            toastService.error('فشل توليد خطة التمارين');
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6 text-right" dir="rtl">
            <SEO title="مولد التمارين والجداول الرياضية الذكي" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-primary/10 via-primary/5 to-background p-6 rounded-xl border border-primary/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <Dumbbell className="h-6 w-6 text-primary" />
                        مولد التمارين والجداول الرياضية بالذكاء الاصطناعي
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        بناء روتين رياضي متكامل يستهدف عضلات محددة ونسب تكرار وجولات محسوبة علمياً.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form Inputs */}
                <Card className="border border-border h-full">
                    <CardHeader className="text-right">
                        <CardTitle className="text-base font-bold">إعدادات جدول التمارين</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleGenerate} className="space-y-4 text-sm text-right">
                            <div className="space-y-1">
                                <label className="font-semibold block">المتدرب</label>
                                <input
                                    type="text"
                                    value={clientName}
                                    onChange={(e) => setClientName(e.target.value)}
                                    className="w-full p-2 rounded border bg-background text-foreground"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="font-semibold block">العضلة المستهدفة</label>
                                <select
                                    value={targetMuscle}
                                    onChange={(e) => setTargetMuscle(e.target.value)}
                                    className="w-full p-2 rounded border bg-background text-foreground"
                                >
                                    <option value="Chest (الصدر)">Chest (الصدر)</option>
                                    <option value="Back (الظهر)">Back (الظهر)</option>
                                    <option value="Legs (الأرجل)">Legs (الأرجل)</option>
                                    <option value="Shoulders (الأكتاف)">Shoulders (الأكتاف)</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="font-semibold block">المستوى الرياضي</label>
                                <select
                                    value={fitnessLevel}
                                    onChange={(e) => setFitnessLevel(e.target.value)}
                                    className="w-full p-2 rounded border bg-background text-foreground"
                                >
                                    <option value="Beginner (مبتدئ)">Beginner (مبتدئ)</option>
                                    <option value="Intermediate (متوسط)">Intermediate (متوسط)</option>
                                    <option value="Advanced (متقدم)">Advanced (متقدم)</option>
                                </select>
                            </div>

                            <Button type="submit" disabled={isWorkoutGenerating} className="w-full gap-2">
                                <Sparkles className="h-4 w-4" />
                                {isWorkoutGenerating ? 'جاري توليد التمرين...' : 'تأكيد وتوليد خطة التمارين'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Workout routine outputs */}
                <div className="lg:col-span-2 space-y-6">
                    {result && (
                        <Card className="border border-border">
                            <CardHeader className="text-right">
                                <div className="flex justify-between items-center flex-row-reverse">
                                    <Badge variant="secondary" className="gap-1 text-xs">
                                        <Clock className="h-3 w-3" />
                                        مدة الجلسة: {result.durationMinutes} دقيقة
                                    </Badge>
                                    <CardTitle className="text-base font-bold text-primary">{result.name}</CardTitle>
                                </div>
                                <CardDescription className="text-xs mt-1">المجموعة العضلية المستهدفة: {result.targetMuscleGroup}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm text-right">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-right">
                                        <thead>
                                            <tr className="border-b border-border bg-muted/20 text-muted-foreground font-semibold">
                                                <th className="p-3 text-right">اسم التمرين</th>
                                                <th className="p-3 text-center">الجولات</th>
                                                <th className="p-3 text-center">التكرارات</th>
                                                <th className="p-3 text-left">فترة الراحة</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {result.exercises.map((ex, idx) => (
                                                <tr key={idx} className="hover:bg-muted/10">
                                                    <td className="p-3 font-semibold text-right">{ex.name}</td>
                                                    <td className="p-3 text-center">{ex.sets}</td>
                                                    <td className="p-3 text-center">{ex.reps}</td>
                                                    <td className="p-3 text-left">{ex.restSeconds} ثانية</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="pt-4 border-t border-border space-y-1 text-xs text-muted-foreground">
                                    <strong className="text-foreground text-sm block mb-1">تعليمات وتوصيات المدرب الذكي:</strong>
                                    <p className="leading-relaxed">{result.notes}</p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WorkoutGenerator;
