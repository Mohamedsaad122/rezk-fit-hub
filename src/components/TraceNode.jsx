import React from 'react';
import { CheckCircle, AlertTriangle } from 'lucide-react';

export const TraceNode = ({ node }) => {
    const isSuccess = node.status === 'Success';
    return (
        <div className="flex items-center gap-3 p-2 bg-muted/10 border rounded-lg flex-row-reverse text-right font-mono text-[10px]">
            {isSuccess ? (
                <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
            ) : (
                <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
            )}
            <div className="flex-1 space-y-0.5">
                <div className="flex justify-between items-center flex-row-reverse">
                    <span className="font-bold text-foreground">{node.name}</span>
                    <span className="text-zinc-500">{node.durationMs}ms</span>
                </div>
                <div className="text-[8px] text-zinc-500 flex justify-between flex-row-reverse">
                    <span>Span ID: {node.traceId}</span>
                    <span>Correlation ID: {node.correlationId}</span>
                </div>
            </div>
        </div>
    );
};

export default TraceNode;
