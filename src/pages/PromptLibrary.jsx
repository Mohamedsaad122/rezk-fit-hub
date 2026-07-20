import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AIRepository } from '@/repositories/ai.repository';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { toastService } from '@/services/toast.service';
import { Code, Plus, Tag } from 'lucide-react';

export const PromptLibrary = () => {
    const queryClient = useQueryClient();

    const { data: prompts = [], isLoading } = useQuery({
        queryKey: ['saas', 'ai', 'prompts'],
        queryFn: () => AIRepository.getPrompts()
    });

    const createPromptMutation = useMutation({
        mutationFn: (data) => AIRepository.createPrompt(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['saas', 'ai', 'prompts'] });
            toastService.success('تمت إضافة القالب الجديد بنجاح');
            setName('');
            setTemplateText('');
        }
    });

    const [name, setName] = useState('');
    const [category, setCategory] = useState('Workout');
    const [templateText, setTemplateText] = useState('');

    const handleCreatePrompt = (e) => {
        e.preventDefault();
        if (!name.trim() || !templateText.trim()) return;

        createPromptMutation.mutate({
            name,
            category,
            templateText,
            variables: ['name', 'goal']
        });
    };

    return (
        <div className="container mx-auto p-6 space-y-6 text-right" dir="rtl">
            <SEO title="مكتبة الأوامر والنماذج" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-primary/10 via-primary/5 to-background p-6 rounded-xl border border-primary/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <Code className="h-6 w-6 text-primary" />
                        مكتبة قوالب الأوامر والتعليمات (Prompts Library)
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        رصد وتخصيص نماذج التعليمات الرياضية والغذائية للمساعدين الأذكياء لتجنب التكرار.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Create Prompt Form */}
                <Card className="border border-border h-full">
                    <CardHeader className="text-right">
                        <CardTitle className="text-base font-bold flex items-center gap-1.5 flex-row-reverse justify-end">
                            <Plus className="h-4 w-4 text-primary" />
                            تخصيص قالب أمر جديد
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreatePrompt} className="space-y-4 text-sm text-right">
                            <div className="space-y-1">
                                <label className="font-semibold block">اسم القالب</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="مثال: مولد الوجبات النباتية"
                                    className="w-full p-2 rounded border bg-background text-foreground"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="font-semibold block">التصنيف</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full p-2 rounded border bg-background text-foreground"
                                >
                                    <option value="Workout">Workout (تمارين رياضية)</option>
                                    <option value="Nutrition">Nutrition (تغذية ووجبات)</option>
                                    <option value="Insights">Insights (تحليلات تنبؤية)</option>
                                    <option value="Coaching">Coaching (متابعة)</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="font-semibold block">نص التوجيه (Template Text)</label>
                                <textarea
                                    value={templateText}
                                    onChange={(e) => setTemplateText(e.target.value)}
                                    placeholder="استخدم المتغيرات بين أقواس مثل: صمم نظام وجبات لـ {name} بهدف {goal}."
                                    rows={4}
                                    className="w-full p-2 rounded border bg-background text-foreground text-xs"
                                    required
                                />
                            </div>

                            <Button type="submit" disabled={createPromptMutation.isPending} className="w-full gap-2">
                                <Plus className="h-4 w-4" />
                                {createPromptMutation.isPending ? 'جاري الحفظ...' : 'تأكيد وحفظ القالب'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Prompts list */}
                <div className="lg:col-span-2 space-y-4">
                    {isLoading ? (
                        <div className="text-center py-12 text-muted-foreground">جاري تحميل قوالب الأوامر...</div>
                    ) : (
                        prompts.map((prompt) => (
                            <Card key={prompt.id} className="border border-border">
                                <CardContent className="p-4 flex justify-between items-center gap-4 flex-row-reverse text-right">
                                    <div className="space-y-1 min-w-0 flex-1">
                                        <div className="flex items-center gap-2 justify-start flex-row-reverse">
                                            <Badge variant="secondary" className="text-[10px]">{prompt.category}</Badge>
                                            <h3 className="font-bold text-base text-foreground flex items-center gap-1.5 flex-row-reverse">
                                                <Tag className="h-4 w-4 text-primary shrink-0" />
                                                {prompt.name}
                                            </h3>
                                        </div>
                                        <div className="bg-muted/10 p-2 rounded border border-border text-xs font-mono text-foreground mt-2 leading-relaxed whitespace-pre-wrap">
                                            {prompt.templateText}
                                        </div>
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

export default PromptLibrary;
