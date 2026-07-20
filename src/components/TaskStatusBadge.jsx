import React from 'react';

const STATUS_MAP = {
    Todo: { label: 'لم تبدأ', className: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400' },
    'In Progress': { label: 'قيد التنفيذ', className: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300' },
    Completed: { label: 'مكتملة', className: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' },
    Cancelled: { label: 'ملغاة', className: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-500 line-through' },
    Overdue: { label: 'متأخرة', className: 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50 animate-pulse' }
};

export const TaskStatusBadge = ({ status }) => {
    const matched = STATUS_MAP[status] || STATUS_MAP.Todo;

    return (
        <span className={`inline-flex items-center justify-center text-xs font-semibold px-2.5 py-0.5 rounded-full select-none ${matched.className}`}>
            {matched.label}
        </span>
    );
};

export default TaskStatusBadge;
