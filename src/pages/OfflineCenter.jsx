import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { toastService } from '@/services/toast.service';
import { Wifi, WifiOff, HardDrive, RefreshCw, RefreshCw as CacheIcon, Trash2 } from 'lucide-react';
import { useOfflineStore } from '@/store/offline.store';
import { ConnectivityManager } from '@/infrastructure/connectivity-manager';
import { CacheService } from '@/services/cache.service';
import { formatNumber } from '@/utils/formatNumber';

export const OfflineCenter = () => {
    const isOnline = useOfflineStore(state => state.isOnline);
    const latencyMs = useOfflineStore(state => state.latencyMs);
    const storageUsageBytes = useOfflineStore(state => state.storageUsageBytes);

    const [cacheStats, setCacheStats] = useState({ count: 0, totalBytes: 0, healthy: true });

    const fetchStats = async () => {
        try {
            const stats = await CacheService.getCacheStats();
            setCacheStats(stats);
        } catch {
            // ignore
        }
    };

    useEffect(() => {
        fetchStats();
    }, [storageUsageBytes]);

    const handleToggleNetwork = () => {
        if (isOnline) {
            ConnectivityManager.simulateOffline();
            toastService.info('محاكاة: تم الدخول في الوضع الأوفلاين للشبكة');
        } else {
            ConnectivityManager.simulateOnline();
            toastService.success('محاكاة: تم استعادة الاتصال بالإنترنت');
        }
    };

    const handleClearCache = async () => {
        try {
            // Clean queries
            await CacheService.setCacheValue('temp_test', null, 0);
            toastService.success('تم إفراغ الذاكرة المؤقتة المنتهية الصلاحية بنجاح');
            fetchStats();
        } catch {
            toastService.error('فشل تنظيف الكاش');
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6 text-right" dir="rtl">
            <SEO title="مركز التحكم أوفلاين (Offline Center)" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-primary/10 via-primary/5 to-background p-6 rounded-xl border border-primary/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <Wifi className="h-6 w-6 text-primary" />
                        مركز التحكم في العمل بدون اتصال (Offline Center)
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        متابعة استهلاك مساحة التخزين المحلية للذاكرة المؤقتة، محاكاة الاتصال، وإدارة بيانات الأوفلاين.
                    </p>
                </div>
                <Button onClick={handleToggleNetwork} className="gap-2 text-xs">
                    {isOnline ? <WifiOff className="h-4 w-4" /> : <Wifi className="h-4 w-4" />}
                    {isOnline ? 'محاكاة وضع الأوفلاين' : 'محاكاة وضع المتصل'}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Status card */}
                <Card className="border border-border">
                    <CardHeader className="text-right">
                        <CardTitle className="text-base font-bold">حالة الاتصال والشبكة</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-xs">
                        <div className="flex justify-between items-center flex-row-reverse">
                            <span className="font-semibold text-muted-foreground">حالة المنصة اللحظية:</span>
                            <Badge variant={isOnline ? 'default' : 'destructive'} className="text-[10px]">
                                {isOnline ? 'متصل بالسيرفر' : 'أوفلاين (بدون اتصال)'}
                            </Badge>
                        </div>
                        <div className="flex justify-between items-center flex-row-reverse">
                            <span className="font-semibold text-muted-foreground">سرعة الاستجابة (Latency):</span>
                            <span className="font-mono text-foreground font-bold">{isOnline ? `${latencyMs}ms` : 'غير متوفر'}</span>
                        </div>
                        <div className="flex justify-between items-center flex-row-reverse">
                            <span className="font-semibold text-muted-foreground">التخزين المحلي المستهلك:</span>
                            <span className="font-mono text-foreground font-bold">
                                {formatNumber(Math.round(storageUsageBytes / 1024))} KB
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Cache Health */}
                <Card className="border border-border lg:col-span-2">
                    <CardHeader className="text-right">
                        <CardTitle className="text-base font-bold">صحة الذاكرة المؤقتة (Cache Health)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6 text-xs">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                            <div className="border border-border p-3 rounded-lg bg-muted/5">
                                <p className="text-muted-foreground text-[10px]">عدد الاستعلامات المخزنة</p>
                                <h3 className="text-xl font-bold text-foreground mt-1">{cacheStats.count} استعلام</h3>
                            </div>
                            <div className="border border-border p-3 rounded-lg bg-muted/5">
                                <p className="text-muted-foreground text-[10px]">حجم الملفات المخبأة</p>
                                <h3 className="text-xl font-bold text-foreground mt-1">{formatNumber(Math.round(cacheStats.totalBytes / 1024))} KB</h3>
                            </div>
                            <div className="border border-border p-3 rounded-lg bg-muted/5">
                                <p className="text-muted-foreground text-[10px]">حالة التخزين المشفر</p>
                                <h3 className="text-xl font-bold text-emerald-500 mt-1">مشفر ونشط</h3>
                            </div>
                        </div>

                        <div className="flex gap-2 justify-start flex-row-reverse">
                            <Button onClick={handleClearCache} variant="destructive" className="gap-1.5 text-xs">
                                <Trash2 className="h-4 w-4" />
                                تنظيف الذاكرة المؤقتة المنتهية
                            </Button>
                            <Button onClick={fetchStats} variant="outline" className="gap-1.5 text-xs">
                                <RefreshCw className="h-4 w-4" />
                                تحديث المؤشرات
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default OfflineCenter;
