import React, { useState, useEffect } from 'react';
import { useTenantStore } from '@/store/tenant.store';
import { useSubscription } from '@/hooks/use-subscriptions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { ShieldCheck, ToggleLeft, ToggleRight, Info } from 'lucide-react';
import { FeatureFlagsService } from '@/services/feature-flags.service';
import { Button } from '@/components/ui/button';

export const FeatureFlags = () => {
    const { activeTenantId, tenants } = useTenantStore();
    const { subscription } = useSubscription(activeTenantId);
    const [flags, setFlags] = useState([]);
    
    const activeTenantName = tenants.find(t => t.id === activeTenantId)?.name || 'المؤسسة الافتراضية';

    const fetchFlags = async () => {
        const list = await FeatureFlagsService.getFeatureFlags();
        setFlags(list);
    };

    useEffect(() => {
        fetchFlags();
    }, [activeTenantId, subscription]);

    const handleToggle = async (key, currentStatus) => {
        const nextStatus = currentStatus === 'Active' ? 'Disabled' : 'Active';
        await FeatureFlagsService.updateFlag(key, { status: nextStatus });
        fetchFlags();
    };

    return (
        <div className="container mx-auto p-6 space-y-6" dir="rtl">
            <SEO title="إدارة مفاتيح التشغيل التجريبية (Feature Flags)" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-orange-500/10 via-orange-500/5 to-background p-6 rounded-xl border border-orange-500/20 text-right">
                <div className="space-y-1 text-right">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-end">
                        <span>مفاتيح وميزات المؤسسة: </span>
                        <span className="text-orange-600 font-bold">{activeTenantName}</span>
                        <ShieldCheck className="h-6 w-6 text-orange-500" />
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        إعداد مفاتيح تشغيل الخدمات (Feature Flags)، والخدمات التجريبية (Beta Features) المخصصة للمشتركين.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {flags.map((flag) => {
                    const isEnabled = flag.status === 'Active';
                    return (
                        <Card key={flag.key} className="border border-border">
                            <CardHeader className="pb-2 text-right">
                                <div className="flex items-center justify-between flex-row-reverse">
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="p-0 h-auto hover:bg-transparent"
                                        onClick={() => handleToggle(flag.key, flag.status)}
                                    >
                                        {isEnabled ? (
                                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 flex items-center gap-1">
                                                <ToggleRight className="h-4 w-4" />
                                                مفعلة
                                            </Badge>
                                        ) : (
                                            <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 flex items-center gap-1">
                                                <ToggleLeft className="h-4 w-4" />
                                                مغلقة
                                            </Badge>
                                        )}
                                    </Button>
                                    <CardTitle className="text-base font-bold text-foreground">{flag.label}</CardTitle>
                                </div>
                                <CardDescription className="text-xs mt-2 leading-relaxed">
                                    {flag.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-2">
                                <div className="text-[10px] text-muted-foreground flex items-center gap-1 justify-start">
                                    <Info className="h-3.5 w-3.5" />
                                    <span>معدل الإطلاق التدريجي: {flag.rolloutPercent}%</span>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default FeatureFlags;
