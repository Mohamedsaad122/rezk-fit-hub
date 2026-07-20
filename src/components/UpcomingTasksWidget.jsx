import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, Clock } from "lucide-react";
import { useTasks } from '@/hooks/use-tasks';

export const UpcomingTasksWidget = () => {
    // Query list of active tasks sorted by due date
    const { data, isLoading } = useTasks({
        status: 'Todo',
        sortBy: 'Due Date',
        limit: 3
    });

    const tasksList = data?.data || [];

    return (
        <Card className="border border-border/80 bg-card shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-sm font-bold text-foreground flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>المهام القادمة</span>
                </CardTitle>
                <Button asChild variant="ghost" size="sm" className="h-8 text-xs font-semibold text-primary gap-1">
                    <Link to="/tasks">
                        <span>عرض الكل</span>
                        <ChevronLeft className="w-3.5 h-3.5" />
                    </Link>
                </Button>
            </CardHeader>
            <CardContent className="space-y-3">
                {isLoading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="h-12 bg-muted/60 animate-pulse rounded-lg" />
                    ))
                ) : tasksList.length === 0 ? (
                    <div className="text-center py-6 text-xs text-muted-foreground">
                        لا توجد مهام قادمة مجدولة.
                    </div>
                ) : (
                    tasksList.map(task => (
                        <div key={task.id} className="flex items-center justify-between p-3 rounded-lg border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors">
                            <div className="min-w-0 pr-1">
                                <h4 className="font-semibold text-xs text-foreground truncate">{task.title}</h4>
                                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mt-1">
                                    <Clock className="w-3 h-3" />
                                    <span>استحقاق: {task.dueDate || 'بدون تاريخ'}</span>
                                </div>
                            </div>
                            <Button asChild variant="outline" size="sm" className="h-7 px-2 text-[10px] border-border shrink-0">
                                <Link to="/tasks">
                                    عرض
                                </Link>
                            </Button>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
};

export default UpcomingTasksWidget;
