import React, { useState } from 'react';
import { useAICoach } from '@/hooks/use-ai-coach';
import { useAIInsights } from '@/hooks/use-ai-insights';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { toastService } from '@/services/toast.service';
import { Bot, Sparkles, Check, Send, AlertTriangle } from 'lucide-react';

export const CoachAssistant = () => {
    const { summarizeClient, isSummarizingClient } = useAICoach();
    const { suggestAppointments, isSuggestingAppointments } = useAIInsights();

    const [selectedClient, setSelectedClient] = useState('سارة أحمد');
    const [summaryResult, setSummaryResult] = useState(null);
    const [appointmentResult, setAppointmentResult] = useState(null);

    const handleSummarize = async () => {
        try {
            const metrics = { attendance: 85, taskCompletion: 90 };
            const result = await summarizeClient({ clientName: selectedClient, historyMetrics: metrics });
            setSummaryResult(result);
            toastService.success('تم توليد كشف التحليل والفرص بنجاح');
        } catch (error) {
            console.error(error);
            toastService.error('فشل معالجة التلخيص');
        }
    };

    const handleSuggestAppointments = async () => {
        try {
            const result = await suggestAppointments({ clientId: 1, historyLogs: ['حصص مسائية مسبقة'] });
            setAppointmentResult(result);
            toastService.success('تم توليد توصيات المواعيد بنجاح');
        } catch (error) {
            console.error(error);
            toastService.error('فشل اقتراح المواعيد');
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6 text-right" dir="rtl">
            <SEO title="مساعد التدريب الرياضي الذكي" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-primary/10 via-primary/5 to-background p-6 rounded-xl border border-primary/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <Bot className="h-6 w-6 text-primary" />
                        مساعد المدرب الرياضي الاستشاري
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        رصد تقدم المتدربين، اقتراح جداول مواعيد للحصص، وتحديد التعديلات المطلوبة.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Client Selector & Action Triggers */}
                <Card className="border border-border">
                    <CardHeader className="text-right">
                        <CardTitle className="text-base font-bold">تحديد المتدرب والعمليات</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm text-right">
                        <div className="space-y-1">
                            <label className="font-semibold block">المتدرب المستهدف</label>
                            <select
                                value={selectedClient}
                                onChange={(e) => setSelectedClient(e.target.value)}
                                className="w-full p-2 rounded border bg-background text-foreground"
                            >
                                <option value="سارة أحمد">سارة أحمد (نشطة)</option>
                                <option value="محمد علي">محمد علي (غياب متكرر)</option>
                            </select>
                        </div>

                        <Button onClick={handleSummarize} disabled={isSummarizingClient} className="w-full gap-2">
                            <Sparkles className="h-4 w-4" />
                            {isSummarizingClient ? 'جاري التحليل...' : 'تحليل حالة المتدرب وتلخيصها'}
                        </Button>

                        <Button onClick={handleSuggestAppointments} disabled={isSuggestingAppointments} variant="outline" className="w-full gap-2">
                            <Bot className="h-4 w-4" />
                            {isSuggestingAppointments ? 'جاري التوليد...' : 'اقتراح مواعيد الحصص القادمة'}
                        </Button>
                    </CardContent>
                </Card>

                {/* Results Screen */}
                <div className="lg:col-span-2 space-y-6">
                    {summaryResult && (
                        <Card className="border border-border">
                            <CardHeader className="text-right">
                                <CardTitle className="text-base font-bold text-primary flex items-center gap-1.5 flex-row-reverse justify-end">
                                    <Sparkles className="h-4 w-4" />
                                    نتائج كشف الحالة للمتدرب: {selectedClient}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm text-right">
                                <div className="bg-muted/20 p-4 rounded-xl leading-relaxed text-foreground">
                                    {summaryResult.analysis || 'تم إجراء التحليل بنجاح بناءً على مستويات النشاط والحضور المقيدة.'}
                                </div>
                                <div className="space-y-2">
                                    <h4 className="font-bold text-foreground">التوصيات المقترحة:</h4>
                                    <div className="space-y-1.5">
                                        {(summaryResult.suggestions || ['جدولة تمرين مقاومة إضافي للصدر', 'مراجعة أوزان الرفع القادمة']).map((s, idx) => (
                                            <div key={idx} className="flex items-center gap-2 justify-start flex-row-reverse text-xs text-muted-foreground">
                                                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                                                <span>{s}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {appointmentResult && (
                        <Card className="border border-border">
                            <CardHeader className="text-right">
                                <CardTitle className="text-base font-bold flex items-center gap-1.5 flex-row-reverse justify-end">
                                    <Bot className="h-4 w-4" />
                                    مواعيد الحصص الموصى بها
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm text-right">
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    {appointmentResult.reason}
                                </p>
                                <div className="grid grid-cols-2 gap-3 text-center">
                                    {appointmentResult.suggestedSlots.map((slot, idx) => (
                                        <div key={idx} className="p-3 bg-primary/5 rounded-xl border border-primary/20 font-bold text-primary text-xs">
                                            {slot}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CoachAssistant;
