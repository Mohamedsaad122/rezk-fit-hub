import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, ShieldCheck, ShieldAlert, WifiOff, RefreshCw } from 'lucide-react';
import { toastService } from '@/services/toast.service';

const SERVICE_LABELS = {
    api: 'بوابة خادم الـ API',
    database: 'مستودع قاعدة البيانات (PostgreSQL)',
    realtime: 'خادم البث الفوري (WebSockets)',
    notifications: 'محرك الإشعارات (Firebase)',
    storage: 'سعة التخزين والملفات (S3/Cloud)',
    authentication: 'بوابة التحقق والأمان (JWT/MFA)',
    backgroundWorkers: 'خادم المهام الخلفية (Queue Workers)'
};

const getStatusBadge = (status) => {
    switch (status) {
        case 'Healthy':
            return (
                <span className="flex items-center gap-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 px-2 py-0.5 rounded text-xs font-semibold">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    سليم (Healthy)
                </span>
            );
        case 'Warning':
            return (
                <span className="flex items-center gap-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 px-2 py-0.5 rounded text-xs font-semibold">
                    <ShieldAlert className="h-3.5 w-3.5" />
                    تحذير (Warning)
                </span>
            );
        case 'Critical':
            return (
                <span className="flex items-center gap-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 px-2 py-0.5 rounded text-xs font-semibold">
                    <ShieldAlert className="h-3.5 w-3.5" />
                    خطر (Critical)
                </span>
            );
        case 'Offline':
            return (
                <span className="flex items-center gap-1 bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 px-2 py-0.5 rounded text-xs font-semibold">
                    <WifiOff className="h-3.5 w-3.5" />
                    خارج الخدمة (Offline)
                </span>
            );
        default:
            return null;
    }
};

export const HealthStatusCard = ({ serviceKey, serviceState, onPing }) => {
    const [isPinging, setIsPinging] = useState(false);
    const label = SERVICE_LABELS[serviceKey] || serviceKey;

    const handlePing = async () => {
        setIsPinging(true);
        try {
            await onPing(serviceKey);
            toastService.success(`اكتمل فحص تشخيص ${label}`);
        } catch (error) {
            console.error(error);
            toastService.error('فشل فحص الاتصال بالخدمة');
        } finally {
            setIsPinging(false);
        }
    };

    if (!serviceState) return null;

    return (
        <Card className="border border-border bg-card">
            <CardContent className="p-4 flex items-center justify-between flex-row-reverse" dir="rtl">
                <div className="space-y-1.5 text-right">
                    <h4 className="font-bold text-sm text-foreground">{label}</h4>
                    <p className="text-xs text-muted-foreground">{serviceState.message}</p>
                    <div className="text-[10px] text-muted-foreground">
                        آخر فحص: {new Date(serviceState.lastChecked).toLocaleTimeString('ar-EG')}
                    </div>
                </div>

                <div className="flex flex-col items-start gap-2">
                    {getStatusBadge(serviceState.status)}
                    <div className="flex items-center gap-2">
                        {serviceState.latencyMs !== undefined && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Activity className="h-3.5 w-3.5 text-primary" />
                                {serviceState.latencyMs}ms
                            </span>
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handlePing}
                            disabled={isPinging}
                            className={`h-7 w-7 rounded-full border border-border bg-muted/20 ${isPinging ? 'animate-spin' : ''}`}
                        >
                            <RefreshCw className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default HealthStatusCard;
