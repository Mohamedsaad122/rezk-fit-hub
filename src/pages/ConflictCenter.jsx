import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useSyncStore } from '@/store/sync.store';
import { ConflictResolutionDialog } from '@/components/offline/OfflineComponents';

export const ConflictCenter = () => {
    const conflicts = useSyncStore(state => state.conflicts);
    const [selectedConflict, setSelectedConflict] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleResolve = (conflict) => {
        setSelectedConflict(conflict);
        setDialogOpen(true);
    };

    return (
        <div className="container mx-auto p-6 space-y-6 text-right" dir="rtl">
            <SEO title="مركز حل التعارضات (Conflict Resolution)" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-primary/10 via-primary/5 to-background p-6 rounded-xl border border-primary/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <AlertTriangle className="h-6 w-6 text-amber-500" />
                        مركز تسوية تعارضات البيانات (Conflict Resolution Center)
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        مراجعة التعديلات المتعارضة بين الأجهزة المحلية وقاعدة بيانات السيرفر الرئيسية وتسويتها.
                    </p>
                </div>
            </div>

            <Card className="border border-border">
                <CardHeader className="text-right">
                    <CardTitle className="text-base font-bold">التعارضات المكتشفة حالياً ({conflicts.length})</CardTitle>
                    <CardDescription className="text-xs">يرجى تسوية هذه الملفات لضمان تكامل البيانات المشتركة للمؤسسة.</CardDescription>
                </CardHeader>
                <CardContent className="p-0 text-xs">
                    {conflicts.length === 0 ? (
                        <div className="text-center py-16 text-muted-foreground space-y-2">
                            <ShieldCheck className="h-10 w-10 text-emerald-500 mx-auto" />
                            <p className="text-[11px]">رائع! لا توجد تعارضات معلقة في نظامك حالياً.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            {conflicts.map(conflict => (
                                <div key={conflict.id} className="p-4 flex justify-between items-center flex-row-reverse text-right hover:bg-muted/5">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 flex-row-reverse">
                                            <Badge variant="warning" className="text-[9px] bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                                بحاجة لدمج
                                            </Badge>
                                            <span className="font-semibold text-foreground">{conflict.url}</span>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground">مخزن محلياً: {JSON.stringify(conflict.payload)}</p>
                                    </div>
                                    <Button size="xs" onClick={() => handleResolve(conflict)}>
                                        حل التعارض
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {selectedConflict && (
                <ConflictResolutionDialog
                    conflict={selectedConflict}
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    onResolve={() => setSelectedConflict(null)}
                />
            )}
        </div>
    );
};

export default ConflictCenter;
