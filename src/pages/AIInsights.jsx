import React, { useState } from 'react';
import { useAIInsights } from '@/hooks/use-ai-insights';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { toastService } from '@/services/toast.service';
import { Cpu, AlertTriangle, CheckCircle, Sparkles, TrendingDown } from 'lucide-react';

export const AIInsights = () => {
    const { insights, assessRisk, isAssessingRisk } = useAIInsights();
    const [selectedClient, setSelectedClient] = useState('1');
    const [clientName, setClientName] = useState('محمد علي');
    const [attendanceRate, setAttendanceRate] = useState(45);
    const [completedTasksRate, setCompletedTasksRate] = useState(30);
    const [assessmentResult, setAssessmentResult] = useState(null);

    const handleAssessRisk = async (e) => {
        e.preventDefault();
        try {
            const result = await assessRisk({
                clientId: Number(selectedClient),
                clientName,
                attendanceRate: Number(attendanceRate),
                completedTasksRate: Number(completedTasksRate)
            });
            setAssessmentResult(result);
            toastService.success('تم الانتهاء من احتساب درجة مخاطر الانسحاب والالتزام');
        } catch (error) {
            console.error(error);
            toastService.error('فشل تقييم المخاطر');
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6 text-right" dir="rtl">
            <SEO title="التحليلات التنبؤية ومؤشرات المخاطر" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-primary/10 via-primary/5 to-background p-6 rounded-xl border border-primary/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <Cpu className="h-6 w-6 text-primary" />
                        التحليلات التنبؤية ورصد مخاطر المتدربين
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        رصد مؤشرات التزام الأعضاء بالحضور والتغذية، والتنبؤ بمخاطر التوقف المبكر عن التدريب.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form Assessment */}
                <Card className="border border-border h-full">
                    <CardHeader className="text-right">
                        <CardTitle className="text-base font-bold">حاسبة مخاطر التراجع والانسحاب</CardTitle>
                        <CardDescription>أدخل نسب التزام المتدرب لمعالجة المخاطر.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAssessRisk} className="space-y-4 text-sm text-right">
                            <div className="space-y-1">
                                <label className="font-semibold block">اسم المتدرب</label>
                                <input
                                    type="text"
                                    value={clientName}
                                    onChange={(e) => setClientName(e.target.value)}
                                    className="w-full p-2 rounded border bg-background text-foreground"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="font-semibold block">نسبة الحضور المسجلة (%)</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={attendanceRate}
                                    onChange={(e) => setAttendanceRate(Number(e.target.value))}
                                    className="w-full p-2 rounded border bg-background text-foreground"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="font-semibold block">نسبة إنجاز المهام والوجبات (%)</label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={completedTasksRate}
                                    onChange={(e) => setCompletedTasksRate(Number(e.target.value))}
                                    className="w-full p-2 rounded border bg-background text-foreground"
                                    required
                                />
                            </div>

                            <Button type="submit" disabled={isAssessingRisk} className="w-full gap-2">
                                <Sparkles className="h-4 w-4" />
                                {isAssessingRisk ? 'جاري احتساب المخاطر...' : 'تقييم حالة المتدرب'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Live Analysis Display */}
                <div className="lg:col-span-2 space-y-6">
                    {assessmentResult && (
                        <Card className="border border-border bg-gradient-to-l from-destructive/5 to-transparent">
                            <CardHeader className="text-right">
                                <div className="flex justify-between items-center flex-row-reverse">
                                    <Badge variant={assessmentResult.riskScore >= 50 ? 'destructive' : 'default'} className="text-xs font-bold">
                                        درجة الخطورة: {assessmentResult.riskLevel}
                                    </Badge>
                                    <CardTitle className="text-base font-bold text-foreground flex items-center gap-1.5 justify-start">
                                        <AlertTriangle className="h-5 w-5 text-destructive" />
                                        مؤشر الخطر المتوقع: {assessmentResult.riskScore}%
                                    </CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm text-right">
                                <div className="space-y-2">
                                    <h4 className="font-bold text-foreground">مؤشرات الخطر الحالية:</h4>
                                    <div className="space-y-1 text-xs text-muted-foreground pr-4">
                                        {assessmentResult.indicators.map((ind, idx) => (
                                            <li key={idx}>{ind}</li>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-border space-y-2">
                                    <h4 className="font-bold text-foreground">إجراءات الحد من التراجع (استراتيجية التدخل):</h4>
                                    <div className="bg-background p-3 rounded-lg border border-border text-xs text-zinc-600 leading-relaxed">
                                        {assessmentResult.mitigationStrategy}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Pre-calculated Insights List */}
                    <Card className="border border-border">
                        <CardHeader className="text-right">
                            <CardTitle className="text-base font-bold">التحليلات والمؤشرات التنبؤية المعتمدة</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm text-right">
                            {insights.map(ins => (
                                <div key={ins.id} className="p-4 rounded-xl border border-border flex flex-col justify-between gap-2 text-right">
                                    <div className="flex justify-between items-center flex-row-reverse">
                                        <Badge variant="secondary" className="text-[10px]">{ins.type}</Badge>
                                        <span className="font-bold text-foreground flex items-center gap-1.5 flex-row-reverse justify-end">
                                            <TrendingDown className="h-4 w-4 text-primary" />
                                            {ins.title}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed mt-1">{ins.content}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AIInsights;
