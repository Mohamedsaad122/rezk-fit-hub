import React from 'react';

export const WorkflowMiniMap = ({ nodes = [] }) => {
    return (
        <div className="w-[180px] h-[100px] bg-slate-950 border border-slate-800 rounded-lg relative overflow-hidden hidden md:block">
            <div className="absolute top-2 right-2 text-[8px] text-muted-foreground font-mono">MiniMap</div>
            {nodes.map(n => (
                <div
                    key={n.id}
                    className="absolute bg-primary/40 rounded-sm"
                    style={{
                        width: '12px',
                        height: '8px',
                        right: `${((n.position?.x ?? 0) / 600) * 100}%`,
                        top: `${((n.position?.y ?? 0) / 400) * 100}%`
                    }}
                />
            ))}
        </div>
    );
};

export default WorkflowMiniMap;
