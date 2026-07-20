import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle, Clock, ListTodo } from "lucide-react";

export const TaskStatistics = ({ statistics }) => {
    const { total = 0, todo = 0, inProgress = 0, completed = 0, overdue = 0, completionRate = 0 } = statistics || {};

    const statsCards = [
        {
            title: "إجمالي المهام",
            value: total,
            description: `${todo} معلقة، ${inProgress} قيد التنفيذ`,
            icon: ListTodo,
            className: "text-blue-500 bg-blue-50 dark:bg-blue-950/20"
        },
        {
            title: "المهام المكتملة",
            value: completed,
            description: "تم إنجازها بالكامل",
            icon: CheckCircle2,
            className: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20"
        },
        {
            title: "المهام المتأخرة",
            value: overdue,
            description: "تجاوزت تاريخ الاستحقاق",
            icon: AlertTriangle,
            className: overdue > 0 ? "text-rose-500 bg-rose-50 dark:bg-rose-950/20 animate-pulse" : "text-amber-500 bg-amber-50 dark:bg-amber-950/20"
        },
        {
            title: "معدل الإنجاز",
            value: `${completionRate}%`,
            description: "النسبة المئوية للمهام المكتملة",
            icon: Clock,
            className: "text-purple-500 bg-purple-50 dark:bg-purple-950/20"
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statsCards.map((stat, idx) => (
                <Card key={idx} className="overflow-hidden border-border bg-card shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-muted-foreground">{stat.title}</p>
                                <p className="text-2xl font-bold text-foreground tracking-tight">{stat.value}</p>
                                <p className="text-[11px] text-muted-foreground">{stat.description}</p>
                            </div>
                            <div className={`p-3 rounded-xl ${stat.className}`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default TaskStatistics;
