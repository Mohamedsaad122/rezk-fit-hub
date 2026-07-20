import React from 'react';

const PRIORITY_MAP = {
    Low: { label: 'منخفضة', className: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300' },
    Medium: { label: 'متوسطة', className: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
    High: { label: 'عالية', className: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' },
    Critical: { label: 'عاجلة جداً', className: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/50 animate-pulse' }
};

export const TaskPriorityBadge = ({ priority }) => {
    const matched = PRIORITY_MAP[priority] || PRIORITY_MAP.Medium;

    return (
        <span className={`inline-flex items-center justify-center text-xs font-semibold px-2 py-0.5 rounded-full select-none ${matched.className}`}>
            {matched.label}
        </span>
    );
};

export default TaskPriorityBadge;
