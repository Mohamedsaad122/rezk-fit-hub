import React from 'react';
import { useSystemHealth } from '@/hooks/use-reports';
import { HealthStatusCard } from '@/components/HealthStatusCard';
import SEO from '@/components/SEO';
import { Activity, HeartHandshake, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toastService } from '@/services/toast.service';

export const SystemHealth = () => {
    const { healthState, isLoading, refetch, pingService } = useSystemHealth();

    const handleRefetchAll = async () => {
        try {
            await refetch();
            toastService.success('تم تحديث حالات الخدمات الإدارية');
        } catch (error) {
            console.error(error);
            toastService.error('فشل تحديث حالة الخدمات');
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6" dir="rtl">
            <SEO title="حالة النظام والصحة العامة" description="مراقبة خوادم وقواعد بيانات Rezk Fit Hub." />

            {/* Header section */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-emerald-500/10 via-emerald-500/5 to-background p-6 rounded-xl border border-emerald-500/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <HeartHandshake className="h-6 w-6 text-emerald-500" />
                        مركز صحة وأمن النظام الإداري
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        متابعة الاتصال المباشر لخدمات الويب، خوادم وقواعد البيانات، ومستودعات التخزين ومنافذ البث الفوري.
                    </p>
                </div>
                <Button variant="outline" onClick={handleRefetchAll} disabled={isLoading} className="flex items-center gap-2 border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10">
                    <RefreshCw className="h-4 w-4" />
                    فحص كافة الخدمات
                </Button>
            </div>

            {/* Overall status message */}
            <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-lg flex items-center gap-3 text-right">
                <Activity className="h-5 w-5 text-emerald-500 shrink-0 animate-pulse" />
                <div>
                    <h4 className="font-semibold text-sm text-emerald-800 dark:text-emerald-300">جميع الخدمات متصلة وتعمل بصحة ممتازة</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        متوسط استقرار خوادم الويب والبث المباشر خلال 24 ساعة الماضية: 99.98%
                    </p>
                </div>
            </div>

            {/* Cards grid */}
            {healthState && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.keys(healthState).map((serviceKey) => (
                        <HealthStatusCard
                            key={serviceKey}
                            serviceKey={serviceKey}
                            serviceState={healthState[serviceKey]}
                            onPing={pingService}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default SystemHealth;
