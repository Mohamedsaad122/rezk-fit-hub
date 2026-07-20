import React from 'react';

export const RequestTimeline = ({ traces = [] }) => {
    const sorted = [...traces].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    if (sorted.length === 0) {
        return <div className="text-center py-6 text-xs text-zinc-500">لا توجد طلبات جارية.</div>;
    }

    const minTime = new Date(sorted[0].startTime).getTime();
    const maxTime = Math.max(...sorted.map(t => new Date(t.startTime).getTime() + t.durationMs));
    const totalSpan = Math.max(1, maxTime - minTime);

    return (
        <div className="space-y-3 font-mono text-[9px] text-right rtl">
            {sorted.map((t, idx) => {
                const startOffset = new Date(t.startTime).getTime() - minTime;
                const leftPercent = (startOffset / totalSpan) * 100;
                const widthPercent = (t.durationMs / totalSpan) * 100;

                return (
                    <div key={t.id || idx} className="space-y-1">
                        <div className="flex justify-between flex-row-reverse text-zinc-400">
                            <span>{t.name}</span>
                            <span>{t.durationMs}ms</span>
                        </div>
                        <div className="w-full h-3 bg-muted/20 rounded relative overflow-hidden border border-border/10">
                            <div 
                                className={`h-full absolute rounded ${t.status === 'Success' ? 'bg-primary' : 'bg-rose-500'}`}
                                style={{
                                    right: `${leftPercent}%`,
                                    width: `${Math.max(1, widthPercent)}%`
                                }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default RequestTimeline;
