import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ChevronLeft } from "lucide-react";
import { useTasks } from '@/hooks/use-tasks';

export const OverdueTasksWidget = () => {
    // Query overdue list
    const { data, isLoading } = useTasks({
        status: 'Overdue',
        sortBy: 'Due Date',
        limit: 3
    });

    const overdueList = data?.data || [];

    return (
        <Card className={`border shadow-sm hover:shadow-md transition-shadow ${
            overdueList.length > 0 ? 'border-rose-200 dark:border-rose-950/40 bg-rose-50/10' : 'border-border/80 bg-card'
        }`}>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm font-bold text-foreground flex items-center gap-1.5">
                    <AlertTriangle className={`w-4 h-4 ${overdueList.length > 0 ? 'text-rose-500 animate-bounce' : 'text-amber-500'}`} />
                    <span>المهام المتأخرة</span>
                    {overdueList.length > 0 && (
                        <span className="bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full animate-pulse mr-1">
                            {overdueList.length} متأخرة
                        </span>
                    )}
                </CardTitle>
                <Button asChild variant="ghost" size="sm" className="h-8 text-xs font-semibold text-primary gap-1">
                    <Link to="/tasks">
                        <span>إدارة المهام</span>
                        <ChevronLeft className="w-3.5 h-3.5" />
                    </Link>
                </Button>
            </CardHeader>
            <CardContent className="space-y-3">
                {isLoading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="h-12 bg-muted/60 animate-pulse rounded-lg" />
                    ))
                ) : overdueList.length === 0 ? (
                    <div className="text-center py-6 text-xs text-muted-foreground">
                        رائع! لا توجد مهام متأخرة حالياً.
                    </div>
                ) : (
                    overdueList.map(task => (
                        <div key={task.id} className="flex items-center justify-between p-3 rounded-lg border border-rose-100 dark:border-rose-950/30 bg-rose-500/5 hover:bg-rose-500/10 transition-colors">
                            <div className="min-w-0 pr-1">
                                <h4 className="font-semibold text-xs text-rose-700 dark:text-rose-400 truncate">{task.title}</h4>
                                <p className="text-[10px] text-muted-foreground mt-0.5">كان الاستحقاق في: {task.dueDate}</p>
                            </div>
                            <Button asChild variant="destructive" size="sm" className="h-7 px-2 text-[10px] shrink-0">
                                <Link to="/tasks">
                                    معالجة
                                </Link>
                            </Button>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
};

export default OverdueTasksWidget;
