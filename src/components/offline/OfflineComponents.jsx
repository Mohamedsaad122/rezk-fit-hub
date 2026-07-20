import React, { useState, useEffect } from 'react';
import { useOfflineStore } from '@/store/offline.store';
import { useSyncStore } from '@/store/sync.store';
import { useBackgroundJobsStore } from '@/store/background-jobs.store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Wifi, WifiOff, RefreshCw, AlertTriangle, Download, Info, CheckCircle2, Server, Laptop } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toastService } from '@/services/toast.service';
import { ConflictResolutionService } from '@/services/conflict-resolution.service';

// 1. OfflineBanner Component
export const OfflineBanner = () => {
    const isOnline = useOfflineStore(state => state.isOnline);
    const offlineSince = useOfflineStore(state => state.offlineSince);

    return (
        <AnimatePresence>
            {!isOnline && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-destructive text-destructive-foreground text-center text-xs py-2 px-4 flex items-center justify-center gap-2 font-semibold select-none border-b border-destructive-foreground/10"
                >
                    <WifiOff className="h-4 w-4 animate-pulse" />
                    <span>تم قطع الاتصال بالإنترنت. أنت تعمل حالياً في الوضع الأوفلاين. سيتم حفظ جميع التعديلات تلقائياً.</span>
                    {offlineSince && (
                        <span className="text-[10px] opacity-80">
                            (منذ {new Date(offlineSince).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })})
                        </span>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// 2. SyncStatusBadge Component
export const SyncStatusBadge = () => {
    const isOnline = useOfflineStore(state => state.isOnline);
    const queue = useSyncStore(state => state.queue);
    const status = useOfflineStore(state => state.status);

    const pendingCount = queue.filter(q => q.status === 'Pending').length;

    if (!isOnline) {
        return (
            <Badge variant="destructive" className="gap-1 text-[10px] py-1 select-none flex items-center flex-row-reverse">
                <WifiOff className="h-3 w-3" />
                أوفلاين
                {pendingCount > 0 && <span className="mr-1 bg-white text-destructive rounded-full px-1 text-[9px] font-bold">{pendingCount}</span>}
            </Badge>
        );
    }

    if (status === 'Syncing' || pendingCount > 0) {
        return (
            <Badge variant="secondary" className="gap-1 text-[10px] py-1 select-none flex items-center flex-row-reverse bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <RefreshCw className="h-3 w-3 animate-spin" />
                مزامنة {pendingCount} تغييرات
            </Badge>
        );
    }

    return (
        <Badge variant="outline" className="gap-1 text-[10px] py-1 select-none flex items-center flex-row-reverse text-emerald-500 border-emerald-500/20 bg-emerald-500/10">
            <Wifi className="h-3 w-3" />
            متصل ومزامن
        </Badge>
    );
};

// 3. SyncProgressDialog Component
export const SyncProgressDialog = ({ open, onOpenChange }) => {
    const progress = useSyncStore(state => state.progress);
    const isSyncing = useSyncStore(state => state.isSyncing);
    const syncStatus = useSyncStore(state => state.syncStatus);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] text-right" dir="rtl">
                <DialogHeader className="text-right">
                    <DialogTitle className="text-base font-bold flex items-center gap-2 flex-row-reverse justify-end">
                        <RefreshCw className={`h-5 w-5 text-primary ${isSyncing ? 'animate-spin' : ''}`} />
                        مزامنة البيانات السحابية
                    </DialogTitle>
                    <DialogDescription className="text-xs mt-1">
                        جاري معالجة وتحديث الحزم المخزنة محلياً على هذا الجهاز.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-6 space-y-4">
                    <div className="flex justify-between text-xs font-semibold">
                        <span>نسبة الإنجاز</span>
                        <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <p className="text-[10px] text-muted-foreground text-center">
                        {syncStatus === 'syncing' ? 'يرجى عدم إغلاق المتصفح أثناء إرسال البيانات...' : 'المزامنة معلقة أو متوقفة مؤقتاً'}
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
};

// 4. PendingChangesPanel Component
export const PendingChangesPanel = () => {
    const queue = useSyncStore(state => state.queue);

    return (
        <Card className="border border-border">
            <CardHeader className="text-right pb-2">
                <CardTitle className="text-sm font-bold flex items-center gap-1.5 flex-row-reverse justify-end">
                    <RefreshCw className="h-4 w-4 text-primary" />
                    التعديلات المحلية المعلقة ({queue.length})
                </CardTitle>
                <CardDescription className="text-xs">التعديلات التي تم حفظها محلياً وسيتم إرسالها فور اتصالك بالسيرفر.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 text-xs">
                {queue.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-[11px]">لا توجد أي تعديلات معلقة حالياً.</div>
                ) : (
                    <div className="divide-y divide-border max-h-[300px] overflow-y-auto">
                        {queue.map(item => (
                            <div key={item.id} className="p-3 flex justify-between items-center flex-row-reverse text-right hover:bg-muted/5">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 flex-row-reverse">
                                        <Badge className="text-[9px]" variant={item.method === 'POST' ? 'default' : item.method === 'PUT' ? 'outline' : 'destructive'}>
                                            {item.method === 'POST' ? 'إضافة' : item.method === 'PUT' ? 'تعديل' : 'حذف'}
                                        </Badge>
                                        <span className="font-semibold text-foreground truncate max-w-[150px]">{item.url}</span>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground">التوقيت: {new Date(item.timestamp).toLocaleTimeString()}</p>
                                </div>
                                <div className="text-left">
                                    <Badge variant={item.status === 'Failed' ? 'destructive' : item.status === 'Syncing' ? 'secondary' : 'outline'} className="text-[9px]">
                                        {item.status === 'Pending' ? 'في الانتظار' : item.status === 'Syncing' ? 'مزامنة...' : item.status === 'Failed' ? 'فشلت' : 'تعارض'}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

// 5. ConflictResolutionDialog Component
export const ConflictResolutionDialog = ({ conflict, open, onOpenChange, onResolve }) => {
    const [strategy, setStrategy] = useState('LWW');

    if (!conflict) return null;

    const handleConfirm = async () => {
        try {
            const resolved = await ConflictResolutionService.resolveConflict(conflict.id, strategy);
            toastService.success('تمت تسوية التعارض بنجاح وإعادة الجدولة');
            if (onResolve) onResolve(resolved);
            onOpenChange(false);
        } catch {
            toastService.error('فشل معالجة التعارض');
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] text-right" dir="rtl">
                <DialogHeader className="text-right">
                    <DialogTitle className="text-base font-bold flex items-center gap-2 flex-row-reverse justify-end">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                        تسوية تعارض البيانات (Conflict detected)
                    </DialogTitle>
                    <DialogDescription className="text-xs mt-1">
                        تم تعديل البيانات على السيرفر ومحلياً في نفس الوقت. يرجى اختيار استراتيجية الدمج المناسبة.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-4 text-xs">
                    <div className="bg-muted/30 p-3 rounded border border-border space-y-2">
                        <h4 className="font-bold">رابط التعديل: <span className="font-mono text-primary">{conflict.url}</span></h4>
                        <p className="text-[10px] text-muted-foreground">التفاصيل المحلية: {JSON.stringify(conflict.payload)}</p>
                    </div>

                    <div className="space-y-2 text-right">
                        <label className="font-semibold block">استراتيجية الحل:</label>
                        <select
                            value={strategy}
                            onChange={(e) => setStrategy(e.target.value)}
                            className="w-full p-2 border bg-background text-foreground text-xs rounded"
                        >
                            <option value="LWW">Last Write Wins (تعديل الجهاز المحلي الأحدث يكسب)</option>
                            <option value="FieldLevel">Field-Level Merge (دمج الحقول غير المتعارضة تلقائياً)</option>
                            <option value="Version">Version Comparison (مقارنة أرقام الإصدارات)</option>
                        </select>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:justify-start">
                    <Button onClick={handleConfirm} className="w-full sm:w-auto">
                        تأكيد وحل التعارض
                    </Button>
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
                        إلغاء
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

// 6. InstallPWAButton Component
export const InstallPWAButton = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const handleBeforeInstall = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowButton(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstall);
        return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            toastService.success('شكراً لتثبيت تطبيق ريزك فيت هب على جهازك!');
        }
        setDeferredPrompt(null);
        setShowButton(false);
    };

    if (!showButton) return null;

    return (
        <Button onClick={handleInstall} variant="outline" className="gap-2 text-xs py-1.5 h-auto">
            <Download className="h-4 w-4 text-primary" />
            تثبيت التطبيق على الجهاز
        </Button>
    );
};

// 7. UpdateAvailableDialog Component
export const UpdateAvailableDialog = ({ open, onOpenChange }) => {
    const handleReload = () => {
        window.location.reload();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px] text-right" dir="rtl">
                <DialogHeader className="text-right">
                    <DialogTitle className="text-base font-bold flex items-center gap-2 flex-row-reverse justify-end">
                        <Info className="h-5 w-5 text-primary" />
                        تحديث للمنصة متوفر
                    </DialogTitle>
                    <DialogDescription className="text-xs mt-1">
                        تم تنزيل إصدار جديد من ريزك فيت هب في الخلفية وجاهز للاستخدام.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 text-xs">
                    يرجى إعادة تشغيل الصفحة لتثبيت وتشغيل التحديث فوراً. لن يؤثر التحديث على التعديلات المعلقة الحالية الخاصة بك.
                </div>

                <DialogFooter className="gap-2 sm:justify-start">
                    <Button onClick={handleReload} className="w-full sm:w-auto">
                        تحديث الصفحة الآن
                    </Button>
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
                        تخطي الآن
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
