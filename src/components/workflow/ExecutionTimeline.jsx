import React from 'react';
import { Badge } from '@/components/ui/badge';

export const ExecutionTimeline = ({ runs = [] }) => {
    return (
        <div className="space-y-3 text-right text-xs">
            <h4 className="font-bold text-foreground">تدفقات التشغيل النشطة</h4>
            {runs.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">لا توجد عمليات تشغيل نشطة حالياً.</div>
            ) : (
                <div className="space-y-2">
                    {runs.map(run => (
                        <div key={run.id} className="p-3 border border-border rounded-xl flex items-center justify-between flex-row-reverse bg-muted/5 font-mono text-[10px]">
                            <div className="flex items-center gap-2 flex-row-reverse">
                                <strong>Run #{run.id}</strong>
                                <Badge variant={run.status === 'Completed' ? 'default' : run.status === 'Failed' ? 'destructive' : 'outline'}>
                                    {run.status}
                                </Badge>
                            </div>
                            <div className="text-left text-muted-foreground text-[9px]">
                                <span>البدء: {new Date(run.startTime).toLocaleTimeString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ExecutionTimeline;
