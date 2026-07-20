import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import SEO from '@/components/SEO';
import { useHealth } from '@/hooks/use-health';
import HealthIndicator from '@/components/HealthIndicator';
import { Button } from '@/components/ui/button';
import { HeartPulse, RefreshCw } from 'lucide-react';

export const HealthDashboard = () => {
    const { systemHealth, pingService } = useHealth();

    return (
        <div className="container mx-auto p-6 space-y-6 text-right" dir="rtl">
            <SEO title="حالة الخدمات والبنية التحتية" />

            <div className="space-y-1">
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-end">
                    <span>حالة البنية التحتية والخدمات</span>
                    <HeartPulse className="h-6 w-6 text-sky-500" />
                </h1>
                <p className="text-sm text-muted-foreground">حالة الفحص الفوري لكافة منافذ وخدمات البنية التحتية لقاعدة البيانات والاتصال.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(systemHealth || {}).map(([key, service]) => (
                    <Card key={key} className="border border-border/40">
                        <CardHeader className="pb-3 text-right">
                            <div className="flex items-center justify-between flex-row-reverse mb-1">
                                <HealthIndicator status={service.status} />
                                <CardTitle className="text-sm font-bold text-foreground font-mono">{key.toUpperCase()}</CardTitle>
                            </div>
                            <CardDescription className="text-xs mt-2">{service.message}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-1">
                            <div className="text-[10px] text-zinc-500 flex justify-between flex-row-reverse border-t border-border/20 pt-2">
                                <span>الاستجابة: {service.latencyMs}ms</span>
                                <span>آخر فحص: {new Date(service.lastChecked).toLocaleTimeString('ar-EG')}</span>
                            </div>
                            <div className="flex justify-end">
                                <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-7 text-[10px] gap-1 hover:bg-sky-500/10 hover:text-sky-500"
                                    onClick={() => pingService(key)}
                                >
                                    <RefreshCw className="h-3 w-3" />
                                    <span>فحص فوري</span>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default HealthDashboard;
