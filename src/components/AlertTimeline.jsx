import React from 'react';

export const AlertTimeline = ({ alerts = [] }) => {
    return (
        <div className="space-y-4 text-right rtl">
            {alerts.length === 0 ? (
                <div className="text-center py-6 text-xs text-zinc-500">لا توجد تنبيهات مسجلة في السجل.</div>
            ) : (
                <div className="relative border-r border-border/60 mr-2 pr-4 space-y-4">
                    {alerts.map((alert, idx) => (
                        <div key={alert.id || idx} className="relative">
                            <span className={`absolute -right-[21px] top-1 h-2 w-2 rounded-full ${alert.status === 'Active' ? 'bg-red-500 animate-pulse' : 'bg-zinc-500'}`} />
                            <div className="bg-muted/10 border p-3 rounded-lg text-right">
                                <div className="flex justify-between items-center flex-row-reverse mb-1">
                                    <span className="text-[8px] text-zinc-500">{new Date(alert.createdAt).toLocaleString('ar-EG')}</span>
                                    <strong className="text-xs text-foreground block">{alert.title}</strong>
                                </div>
                                <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed">{alert.message}</p>
                                <div className="flex items-center justify-between text-[8px] text-zinc-500 pt-1.5 mt-1.5 border-t border-border/20 flex-row-reverse">
                                    <span>الحالة: {alert.status === 'Active' ? 'نشط' : 'تم الحل'}</span>
                                    <span>المستوى: Level {alert.escalationLevel || 1}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AlertTimeline;
