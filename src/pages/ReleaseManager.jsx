import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import SEO from '@/components/SEO';
import { useRelease } from '@/hooks/use-release';
import ReleaseTimeline from '@/components/ReleaseTimeline';
import { Button } from '@/components/ui/button';
import { GitBranch, Rocket, Plus } from 'lucide-react';

export const ReleaseManager = () => {
    const { releases, deployRelease, rollbackRelease } = useRelease();
    const [version, setVersion] = useState('');
    const [desc, setDesc] = useState('');
    const [channel, setChannel] = useState('Canary');
    const [weight, setWeight] = useState(10);

    const handleDeploy = async (e) => {
        e.preventDefault();
        if (!version || !desc) return;
        await deployRelease({
            version,
            channel,
            description: desc,
            canaryWeight: channel === 'Canary' ? Number(weight) : null
        });
        setVersion('');
        setDesc('');
    };

    return (
        <div className="container mx-auto p-6 space-y-6 text-right" dir="rtl">
            <SEO title="مدير إصدارات البنية التحتية" />

            <div className="space-y-1">
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-end">
                    <span>إدارة إطلاقات وإصدارات النظام</span>
                    <GitBranch className="h-6 w-6 text-amber-500" />
                </h1>
                <p className="text-sm text-muted-foreground">تتبع إصدارات المنصة الحية، والتحكم بأوزان Canary والنشر الموجه.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border border-border/40">
                        <CardHeader className="text-right">
                            <CardTitle className="text-base font-bold text-foreground">سجل عمليات إطلاق الإصدارات</CardTitle>
                            <CardDescription>الجدول الزمني للإطلاقات وحالات الاسترجاع التاريخية</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ReleaseTimeline releases={releases} onRollback={rollbackRelease} />
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="border border-border/40">
                        <CardHeader className="text-right">
                            <CardTitle className="text-base font-bold text-foreground flex items-center gap-1.5 justify-end">
                                <Rocket className="h-4 w-4 text-primary" />
                                <span>نشر إصدار جديد</span>
                            </CardTitle>
                            <CardDescription>إطلاق إصدار جديد عبر بيئات Canary أو Blue/Green</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleDeploy} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] text-zinc-400 block text-right">رقم الإصدار</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-2 border bg-background text-foreground text-xs rounded text-right" 
                                        placeholder="مثال: 1.3.0"
                                        value={version}
                                        onChange={(e) => setVersion(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] text-zinc-400 block text-right">بيئة الإطلاق</label>
                                    <select 
                                        className="w-full p-2 border bg-background text-foreground text-xs rounded text-right"
                                        value={channel}
                                        onChange={(e) => setChannel(e.target.value)}
                                    >
                                        <option value="Canary">Canary (إطلاق تدريجي ميزاني)</option>
                                        <option value="Production">Production (بيئة الإنتاج الكاملة)</option>
                                        <option value="Staging">Staging (بيئة الفحص التجريبية)</option>
                                    </select>
                                </div>
                                {channel === 'Canary' && (
                                    <div className="space-y-1">
                                        <label className="text-[10px] text-zinc-400 block text-right">وزن التحويل (Canary Weight %)</label>
                                        <input 
                                            type="number" 
                                            className="w-full p-2 border bg-background text-foreground text-xs rounded text-right font-mono" 
                                            min={1} 
                                            max={100} 
                                            value={weight}
                                            onChange={(e) => setWeight(e.target.value)}
                                        />
                                    </div>
                                )}
                                <div className="space-y-1">
                                    <label className="text-[10px] text-zinc-400 block text-right">وصف التحديثات</label>
                                    <textarea 
                                        className="w-full p-2 border bg-background text-foreground text-xs rounded text-right" 
                                        placeholder="أهم الميزات والمصلاحات في هذا الإصدار..."
                                        rows={3}
                                        value={desc}
                                        onChange={(e) => setDesc(e.target.value)}
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full text-xs gap-1.5 flex items-center justify-center">
                                    <Plus className="h-4 w-4" />
                                    <span>نشر التحديث فورياً</span>
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ReleaseManager;
