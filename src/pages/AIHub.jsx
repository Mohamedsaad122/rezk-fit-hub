import React, { useState } from 'react';
import { useAIStore } from '@/store/ai.store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { toastService } from '@/services/toast.service';
import { Bot, Cpu, Apple, Dumbbell, Shield, HelpCircle, Code, History, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AIHub = () => {
    const { activeProvider, setProvider, modelName, temperature, setModelConfig } = useAIStore();
    const [apiKey, setApiKey] = useState('');
    const [endpoint, setEndpoint] = useState('');
    const [tempVal, setTempVal] = useState(temperature);

    const handleSaveConfig = (e) => {
        e.preventDefault();
        setModelConfig(modelName, Number(tempVal));
        toastService.success('تم حفظ إعدادات المحرك وتحديث النموذج بنجاح');
    };

    const modules = [
        { title: 'مساعد المدرب الذكي', desc: 'تحليل ملفات المتدربين، اقتراح جداول مواعيد، وصياغة خطط رياضية مخصصة.', url: '/ai/coach', icon: Bot, badge: 'جاهز للاستخدام' },
        { title: 'مولد الأنظمة الغذائية', desc: 'توليد وجبات مخصصة بناء على الوزن والهدف وحساب السعرات والماكروز تلقائياً.', url: '/ai/nutrition', icon: Apple, badge: 'مطور' },
        { title: 'مولد التمارين والجداول', desc: 'توليد روتين رياضي متكامل يستهدف عضلات محددة ونسب راحة محسوبة.', url: '/ai/workout', icon: Dumbbell, badge: 'مطور' },
        { title: 'مكتبة النماذج والـ Prompts', desc: 'إدارة وتخصيص قوالب الأوامر والتوجيهات المعتمدة للمنصة.', url: '/ai/prompts', icon: Code, badge: 'مكتبة القوالب' },
        { title: 'سجل المحادثات الذكية', desc: 'مراجعة أرشيف جلسات الدعم والمحادثات المفتوحة مع الذكاء الاصطناعي.', url: '/ai/history', icon: History, badge: 'الأرشيف' }
    ];

    return (
        <div className="container mx-auto p-6 space-y-6 text-right" dir="rtl">
            <SEO title="بوابة الذكاء الاصطناعي" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-primary/10 via-primary/5 to-background p-6 rounded-xl border border-primary/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <Bot className="h-6 w-6 text-primary" />
                        منصة الذكاء الاصطناعي والمحرك الاستشاري
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        إعداد موفري الخدمة وتوجيه المساعدين الرياضيين والغذائيين الذكيين.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* AI Configuration Section */}
                <Card className="border border-border">
                    <CardHeader className="text-right">
                        <CardTitle className="text-base font-bold flex items-center gap-1.5 flex-row-reverse justify-end">
                            <Layers className="h-4 w-4 text-primary" />
                            تهيئة وتغيير موفر الخدمة (LLM)
                        </CardTitle>
                        <CardDescription>اختر مزود الذكاء الاصطناعي النشط وقم بضبط معاملات الاتصال.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSaveConfig} className="space-y-4 text-sm text-right">
                            <div className="space-y-1">
                                <label className="font-semibold block">المزود النشط</label>
                                <select
                                    value={activeProvider}
                                    onChange={(e) => setProvider(e.target.value)}
                                    className="w-full p-2 rounded border bg-background text-foreground"
                                >
                                    <option value="Mock">Mock Provider (محلي تجريبي)</option>
                                    <option value="OpenAI">OpenAI (ChatGPT)</option>
                                    <option value="Claude">Anthropic Claude</option>
                                    <option value="Gemini">Google Gemini</option>
                                    <option value="DeepSeek">DeepSeek AI</option>
                                    <option value="Ollama">Local LLM (Ollama)</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="font-semibold block">مفتاح واجهة التطبيق (API Key)</label>
                                <input
                                    type="password"
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    placeholder="أدخل مفتاح الـ API للتوثيق..."
                                    className="w-full p-2 rounded border bg-background text-foreground"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="font-semibold block">رابط الاتصال المخصص (Endpoint)</label>
                                <input
                                    type="text"
                                    value={endpoint}
                                    onChange={(e) => setEndpoint(e.target.value)}
                                    placeholder="اختياري (مثال: خادم محلي)"
                                    className="w-full p-2 rounded border bg-background text-foreground"
                                />
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between items-center mb-1 flex-row-reverse">
                                    <label className="font-semibold">درجة الإبداع (Temperature): {tempVal}</label>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="2"
                                    step="0.1"
                                    value={tempVal}
                                    onChange={(e) => setTempVal(e.target.value)}
                                    className="w-full accent-primary"
                                />
                            </div>

                            <Button type="submit" className="w-full">
                                حفظ الإعدادات
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Assistants Grid */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="font-bold text-lg text-foreground text-right mb-2">الأدوات والمساعدين المتاحين</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {modules.map((m, idx) => {
                            const IconComponent = m.icon;
                            return (
                                <Card key={idx} className="border border-border hover:shadow-md transition-shadow">
                                    <CardHeader className="p-4 text-right">
                                        <div className="flex justify-between items-start flex-row-reverse">
                                            <Badge variant="secondary" className="text-[10px]">{m.badge}</Badge>
                                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                                <IconComponent className="h-5 w-5" />
                                            </div>
                                        </div>
                                        <CardTitle className="text-sm font-bold mt-3 text-right">{m.title}</CardTitle>
                                        <CardDescription className="text-xs text-right mt-1">{m.desc}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-0 text-left">
                                        <Button asChild size="sm" variant="ghost" className="text-primary hover:text-primary-focus p-0">
                                            <Link to={m.url}>تشغيل المساعد ←</Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIHub;
