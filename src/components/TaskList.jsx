import React from 'react';
import { TaskCard } from "./TaskCard";
import { Skeleton } from "@/components/ui/skeleton";
import { ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";

export const TaskList = ({
    tasks = [],
    isLoading = false,
    selectedIds = [],
    onSelectToggle,
    onViewDetails,
    onEdit,
    onDelete,
    onCompleteToggle,
    onDuplicate,
    meta = null,
    onPageChange
}) => {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="border border-border/60 rounded-xl p-5 space-y-4 bg-card">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-5 w-24 rounded-md" />
                            <Skeleton className="h-5 w-16 rounded-md" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-3/4 rounded-md" />
                            <Skeleton className="h-4 w-full rounded-md" />
                            <Skeleton className="h-4 w-5/6 rounded-md" />
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-border/30">
                            <Skeleton className="h-4 w-28 rounded-md" />
                            <Skeleton className="h-7 w-14 rounded-md" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (tasks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-card rounded-xl border border-border/80 shadow-sm min-h-[300px]">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 text-muted-foreground">
                    <ClipboardList className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1">لا توجد مهام معروضة</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                    لا تتوفر أي مهام مطابقة لخيارات التصفية النشطة حالياً.
                </p>
            </div>
        );
    }

    const { page = 1, totalPages = 1 } = meta || {};

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasks.map(task => (
                    <TaskCard
                        key={task.id}
                        task={task}
                        selected={selectedIds.includes(task.id)}
                        onSelectToggle={() => onSelectToggle(task.id)}
                        onViewDetails={() => onViewDetails(task)}
                        onEdit={() => onEdit(task)}
                        onDelete={() => onDelete(task)}
                        onCompleteToggle={() => onCompleteToggle(task)}
                        onDuplicate={() => onDuplicate(task)}
                    />
                ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4 border-t border-border/40">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page <= 1}
                        onClick={() => onPageChange(page - 1)}
                        className="text-xs border-border"
                    >
                        السابق
                    </Button>
                    <span className="text-xs text-muted-foreground px-2">
                        صفحة {page} من {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page >= totalPages}
                        onClick={() => onPageChange(page + 1)}
                        className="text-xs border-border"
                    >
                        التالي
                    </Button>
                </div>
            )}
        </div>
    );
};

export default TaskList;
