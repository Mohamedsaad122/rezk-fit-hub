import React from 'react';
import { Calendar, CheckCircle2, Clock, PlusCircle } from "lucide-react";

export const TaskTimeline = ({ task }) => {
    if (!task) return null;

    const steps = [
        {
            title: "تم إنشاء المهمة",
            date: task.createdAt ? new Date(task.createdAt).toLocaleString('ar-EG') : null,
            icon: PlusCircle,
            color: "text-blue-500 bg-blue-50 dark:bg-blue-950/30",
            done: true
        },
        {
            title: "تاريخ البدء المخطط",
            date: task.startDate ? new Date(task.startDate).toLocaleDateString('ar-EG') : null,
            icon: Calendar,
            color: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30",
            done: !!task.startDate
        },
        {
            title: "الموعد النهائي (الاستحقاق)",
            date: task.dueDate ? new Date(task.dueDate).toLocaleDateString('ar-EG') : null,
            icon: Clock,
            color: task.status === 'Overdue' ? "text-rose-500 bg-rose-50 dark:bg-rose-950/30 animate-pulse" : "text-amber-500 bg-amber-50 dark:bg-amber-950/30",
            done: !!task.dueDate
        },
        {
            title: "إتمام المهمة وإنجازها",
            date: task.completedAt ? new Date(task.completedAt).toLocaleString('ar-EG') : null,
            icon: CheckCircle2,
            color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30",
            done: task.status === 'Completed' && !!task.completedAt
        }
    ];

    const activeSteps = steps.filter(s => s.done);

    return (
        <div className="relative border-r-2 border-border/80 mr-3 pr-6 space-y-6 rtl">
            {activeSteps.map((step, idx) => (
                <div key={idx} className="relative">
                    <span className={`absolute -right-[34px] top-0.5 rounded-full p-1.5 border border-background shadow-sm ${step.color}`}>
                        <step.icon className="w-4 h-4" />
                    </span>
                    <div className="space-y-0.5">
                        <h4 className="font-semibold text-sm text-foreground">{step.title}</h4>
                        <p className="text-xs text-muted-foreground">{step.date}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TaskTimeline;
