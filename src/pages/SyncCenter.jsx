import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { toastService } from '@/services/toast.service';
import { RefreshCw, Play, Trash2, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';
import { useSyncStore } from '@/store/sync.store';
import { useOfflineStore } from '@/store/offline.store';
import { SyncService } from '@/services/sync.service';
import { PendingChangesPanel, SyncProgressDialog } from '@/components/offline/OfflineComponents';

export const SyncCenter = () => {
    const isOnline = useOfflineStore(state => state.isOnline);
    const queue = useSyncStore(state => state.queue);
    const statistics = useSyncStore(state => state.statistics);
    const isSyncing = useSyncStore(state => state.isSyncing);

    const [showProgress, setShowProgress] = useState(false);

    const handleForceSync = async () => {
        if (!isOnline) {
            toastService.warning('لا يمكن تشغيل المزامنة وأنت غير متصل بالإنترنت');
            return;
        }

        try {
            setShowProgress(true);
            await SyncService.forceSync();
            toastService.success('تمت مزامنة طابور البيانات بنجاح مع السيرفر');
        } catch {
            toastService.error('حدثت أخطاء أثناء المزامنة');
        } finally {
            // Give user a brief time to see 100% completion in modal
            setTimeout(() => {
                setShowProgress(false);
            }, 800);
        }
    };

    const handleClearQueue = async () => {
        try {
            await SyncService.clearSyncQueue();
            toastService.success('تم إفراغ طابور المزامنة المحلي');
        } catch {
            toastService.error('فشل مسح طابور المزامنة');
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6 text-right" dir="rtl">
            <SEO title="مركز مزامنة البيانات (Sync Center)" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-primary/10 via-primary/5 to-background p-6 rounded-xl border border-primary/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <RefreshCw className={`h-6 w-6 text-primary ${isSyncing ? 'animate-spin' : ''}`} />
                        مركز مزامنة البيانات وتأكيد التغييرات (Sync Center)
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        متابعة طابور التعديلات المعلقة، مراجعة إحصائيات فشل محاولات الإرسال، وإعادة تشغيل طابور المزامنة.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={handleClearQueue} variant="destructive" className="gap-2 text-xs" disabled={queue.length === 0}>
                        <Trash2 className="h-4 w-4" />
                        مسح الطابور
                    </Button>
                    <Button onClick={handleForceSync} className="gap-2 text-xs" disabled={queue.length === 0 || isSyncing}>
                        <Play className="h-4 w-4" />
                        مزامنة الآن
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Queue status */}
                <div className="lg:col-span-2 space-y-6">
                    <PendingChangesPanel />
                </div>

                {/* Queue statistics */}
                <div className="space-y-6">
                    <Card className="border border-border">
                        <CardHeader className="text-right">
                            <CardTitle className="text-base font-bold flex items-center gap-1.5 flex-row-reverse justify-end">
                                <Layers className="h-5 w-5 text-primary" />
                                إحصائيات المزامنة الجارية
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-xs">
                            <div className="flex justify-between items-center flex-row-reverse">
                                <span className="font-semibold text-muted-foreground">التعديلات المتبقية بالطابور:</span>
                                <span className="font-bold text-foreground">{queue.length} تغيير</span>
                            </div>
                            <div className="flex justify-between items-center flex-row-reverse">
                                <span className="font-semibold text-muted-foreground">العمليات المزامنة بنجاح:</span>
                                <span className="font-bold text-emerald-500">{statistics.totalSynced} عملية</span>
                            </div>
                            <div className="flex justify-between items-center flex-row-reverse">
                                <span className="font-semibold text-muted-foreground">العمليات الفاشلة نهائياً:</span>
                                <span className="font-bold text-destructive">{statistics.totalFailed} عملية</span>
                            </div>
                            <div className="flex justify-between items-center flex-row-reverse">
                                <span className="font-semibold text-muted-foreground">التعارضات المكتشفة:</span>
                                <span className="font-bold text-amber-500">{statistics.totalConflicts} تعارض</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <SyncProgressDialog open={showProgress} onOpenChange={setShowProgress} />
        </div>
    );
};

export default SyncCenter;
