import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { 
    MoreVertical, 
    Calendar, 
    Check, 
    Copy, 
    Edit, 
    Eye, 
    Trash2, 
    User,
    Clock
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TaskPriorityBadge } from "./TaskPriorityBadge";
import { TaskStatusBadge } from "./TaskStatusBadge";

const CATEGORY_LABELS = {
    Workout: 'تمارين رياضة',
    Nutrition: 'برنامج غذائي',
    Assessment: 'تقييم بدني',
    Consultation: 'استشارة',
    'Follow Up': 'متابعة دورية',
    'Phone Call': 'مكالمة هاتفية',
    Meeting: 'اجتماع عمل',
    Administrative: 'عمل إداري',
    Reminder: 'تذكير'
};

const CATEGORY_EMOJIS = {
    Workout: '💪',
    Nutrition: '🍎',
    Assessment: '📊',
    Consultation: '💬',
    'Follow Up': '🔄',
    'Phone Call': '📞',
    Meeting: '👥',
    Administrative: '📁',
    Reminder: '🔔'
};

export const TaskCard = ({
    task,
    selected = false,
    onSelectToggle,
    onViewDetails,
    onEdit,
    onDelete,
    onCompleteToggle,
    onDuplicate
}) => {
    if (!task) return null;

    const isCompleted = task.status === 'Completed';
    const isOverdue = task.status === 'Overdue';
    const catLabel = CATEGORY_LABELS[task.category] || task.category;
    const catEmoji = CATEGORY_EMOJIS[task.category] || '📋';

    return (
        <Card className={`border overflow-hidden transition-all duration-200 bg-card hover:border-primary/50 hover:shadow-md ${
            selected ? 'border-primary bg-primary/5' : 'border-border/80'
        } ${isCompleted ? 'opacity-70' : ''}`}>
            <CardContent className="p-5 space-y-4">
                {/* Header section with category, checkbox, priority and actions menu */}
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <Checkbox 
                            checked={selected} 
                            onCheckedChange={onSelectToggle}
                            aria-label="تحديد المهمة"
                        />
                        <span className="text-sm select-none" title={catLabel}>
                            {catEmoji} <span className="text-xs text-muted-foreground mr-1">{catLabel}</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <TaskPriorityBadge priority={task.priority} />
                        <TaskStatusBadge status={task.status} />
                        
                        {/* More Actions Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg">
                                    <MoreVertical className="w-4 h-4 text-muted-foreground" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rtl text-right">
                                <DropdownMenuItem onClick={onViewDetails} className="gap-2 cursor-pointer">
                                    <Eye className="w-4 h-4" />
                                    <span>عرض التفاصيل</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={onEdit} className="gap-2 cursor-pointer">
                                    <Edit className="w-4 h-4" />
                                    <span>تعديل</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={onDuplicate} className="gap-2 cursor-pointer">
                                    <Copy className="w-4 h-4" />
                                    <span>نسخ مطابقة</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={onDelete} className="text-destructive gap-2 cursor-pointer">
                                    <Trash2 className="w-4 h-4" />
                                    <span>حذف</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Title & Description */}
                <div className="space-y-1" onClick={onViewDetails}>
                    <h3 className={`text-base font-bold text-foreground hover:text-primary transition-colors cursor-pointer leading-snug ${
                        isCompleted ? 'line-through text-muted-foreground' : ''
                    }`}>
                        {task.title}
                    </h3>
                    {task.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            {task.description}
                        </p>
                    )}
                </div>

                {/* Client Reference Link & Estimated Time */}
                {(task.clientId || task.estimatedMinutes) && (
                    <div className="flex flex-wrap gap-3 items-center text-xs text-muted-foreground border-t border-border/40 pt-3">
                        {task.clientId && (
                            <div className="flex items-center gap-1">
                                <User className="w-3.5 h-3.5 text-primary shrink-0" />
                                <span>متدرب #{task.clientId}</span>
                            </div>
                        )}
                        {task.estimatedMinutes > 0 && (
                            <div className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 shrink-0" />
                                <span>التقدير: {task.estimatedMinutes} دقيقة</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Bottom section with completion checkbox trigger & due dates */}
                <div className="flex items-center justify-between border-t border-border/40 pt-3">
                    <div className="flex items-center gap-1 text-xs">
                        <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className={`${isOverdue ? 'text-rose-500 font-semibold animate-pulse' : 'text-muted-foreground'}`}>
                            {task.dueDate ? `استحقاق: ${task.dueDate}` : 'لا يوجد تاريخ استحقاق'}
                        </span>
                    </div>

                    {task.status !== 'Completed' && task.status !== 'Cancelled' ? (
                        <Button
                            onClick={onCompleteToggle}
                            size="sm"
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-300 dark:hover:bg-emerald-950/40 text-xs h-7 px-2 rounded-lg gap-1"
                        >
                            <Check className="w-3.5 h-3.5" />
                            <span>إنجاز</span>
                        </Button>
                    ) : task.status === 'Completed' ? (
                        <Button
                            onClick={onCompleteToggle}
                            size="sm"
                            variant="ghost"
                            className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/20 text-xs h-7 px-2 rounded-lg gap-1"
                        >
                            <span>تراجع</span>
                        </Button>
                    ) : null}
                </div>
            </CardContent>
        </Card>
    );
};

export default TaskCard;
