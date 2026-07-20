import React from 'react';
import { Play, Activity, Clock, Split, HelpCircle, Trash2 } from 'lucide-react';

const icons = {
    Trigger: Play,
    Action: Activity,
    Delay: Clock,
    Condition: Split,
    Approval: HelpCircle
};

export const WorkflowNode = ({ node, onClick, onDelete }) => {
    const Icon = icons[node.type] || Activity;
    const x = node.position?.x ?? 0;
    const y = node.position?.y ?? 0;

    return (
        <div
            onClick={onClick}
            style={{ transform: `translate(${x}px, ${y}px)` }}
            className="absolute w-[150px] bg-slate-950 border border-slate-800 rounded-lg p-3 cursor-pointer hover:border-primary/50 transition-colors flex flex-col justify-between text-right text-[10px] text-foreground"
        >
            <div className="flex items-center justify-between flex-row-reverse mb-2">
                <Icon className="h-4 w-4 text-primary" />
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    className="text-muted-foreground hover:text-red-500"
                >
                    <Trash2 className="h-3 w-3" />
                </button>
            </div>
            <div className="font-bold text-foreground truncate">{node.label}</div>
            <div className="text-[8px] text-muted-foreground truncate">{node.type}</div>
        </div>
    );
};

export default WorkflowNode;
