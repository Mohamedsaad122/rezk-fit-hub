import React from 'react';
import TraceNode from './TraceNode';

export const TraceTree = ({ traces = [] }) => {
    const roots = traces.filter(t => !t.parentId);

    const renderChildren = (parentId, level = 1) => {
        const children = traces.filter(t => t.parentId === parentId);
        if (children.length === 0) return null;

        return (
            <div className="mr-4 pr-3 border-r border-border/60 space-y-2 mt-2">
                {children.map(child => (
                    <div key={child.id || child.traceId} className="space-y-1">
                        <TraceNode node={child} />
                        {renderChildren(child.traceId, level + 1)}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-4 rtl text-right">
            {roots.length === 0 ? (
                <div className="text-center py-6 text-xs text-zinc-500">لا توجد مسارات ربط موزعة مسجلة.</div>
            ) : (
                roots.map(root => (
                    <div key={root.id || root.traceId} className="space-y-2 border-b border-border/20 pb-4">
                        <TraceNode node={root} />
                        {renderChildren(root.traceId)}
                    </div>
                ))
            )}
        </div>
    );
};

export default TraceTree;
