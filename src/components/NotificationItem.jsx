import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Archive, Trash2, RotateCcw, ChevronLeft } from "lucide-react";
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export const formatRelativeTime = (dateString) => {
    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHour = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHour / 24);

        if (diffSec < 60) return 'الآن';
        if (diffMin === 1) return 'منذ دقيقة';
        if (diffMin === 2) return 'منذ دقيقتين';
        if (diffMin < 11) return `منذ ${diffMin} دقائق`;
        if (diffMin < 60) return `منذ ${diffMin} دقيقة`;
        if (diffHour === 1) return 'منذ ساعة';
        if (diffHour === 2) return 'منذ ساعتين';
        if (diffHour < 11) return `منذ ${diffHour} ساعات`;
        if (diffHour < 24) return `منذ ${diffHour} ساعة`;
        if (diffDay === 1) return 'أمس';
        if (diffDay === 2) return 'منذ يومين';
        if (diffDay < 11) return `منذ ${diffDay} أيام`;
        return date.toLocaleDateString('ar-EG', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
        return dateString;
    }
};

const PRIORITY_STYLES = {
    Low: { label: 'منخفضة', className: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
    Normal: { label: 'عادية', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    High: { label: 'هامة', className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
    Critical: { label: 'حرجة', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 animate-pulse' }
};

const COLOR_STYLES = {
    blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    orange: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
    amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    red: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
    indigo: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    green: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
    teal: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
    rose: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
};

export const NotificationItem = ({
    notification,
    onMarkRead,
    onArchive,
    onRestore,
    onDelete,
    isCompact = false
}) => {
    const { id, title, description, priority, status, createdAt, actionUrl, icon, color } = notification;

    const isUnread = status === 'Unread';
    const isArchived = status === 'Archived';
    
    const priorityInfo = PRIORITY_STYLES[priority] || PRIORITY_STYLES.Normal;
    const colorClass = COLOR_STYLES[color] || COLOR_STYLES.blue;

    // Render action triggers (mark read, archive, etc.)
    const renderActions = () => {
        if (isCompact) return null;

        return (
            <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                {isUnread && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onMarkRead?.(id)}
                        className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950/20"
                        title="تحديد كمقروء"
                    >
                        <Check className="w-4 h-4" />
                    </Button>
                )}
                {!isArchived ? (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onArchive?.(id)}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
                        title="أرشفة"
                    >
                        <Archive className="w-4 h-4" />
                    </Button>
                ) : (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRestore?.(id)}
                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                        title="استعادة من الأرشيف"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </Button>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete?.(id)}
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-red-50 dark:hover:bg-red-950/20"
                    title="حذف"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        );
    };

    const cardContent = (
        <div className="flex gap-4">
            {/* Left/Right Icon */}
            <div className={cn(
                "w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 text-lg shadow-sm font-sans select-none",
                colorClass
            )}>
                {icon}
            </div>

            {/* Middle body */}
            <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                    <h4 className={cn(
                        "text-sm font-bold truncate text-foreground",
                        isUnread && "text-primary-foreground dark:text-foreground font-extrabold"
                    )}>
                        {title}
                    </h4>

                    {/* Unread marker */}
                    {isUnread && (
                        <span className="w-1.5 h-1.5 rounded-full bg-destructive shadow shadow-destructive animate-ping"></span>
                    )}

                    {/* Priority Badge */}
                    {!isCompact && (
                        <Badge className={cn("text-[9px] px-1.5 py-0 border-0 h-4 shrink-0 shadow-none", priorityInfo.className)}>
                            {priorityInfo.label}
                        </Badge>
                    )}
                </div>

                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {description}
                </p>

                <div className="flex items-center gap-3 pt-1">
                    <span className="text-[10px] text-muted-foreground/80 font-medium">
                        {formatRelativeTime(createdAt)}
                    </span>
                    {actionUrl && !isCompact && (
                        <span className="text-[10px] text-primary font-bold flex items-center gap-0.5 hover:underline">
                            عرض التفاصيل
                            <ChevronLeft className="w-3 h-3" />
                        </span>
                    )}
                </div>
            </div>

            {/* Actions panel */}
            {renderActions()}
        </div>
    );

    return (
        <div
            className={cn(
                "p-4 rounded-xl border transition-all text-right duration-200 select-none bg-card hover:bg-card/80",
                isUnread ? "border-primary/20 bg-primary/5 hover:bg-primary/10 shadow-sm" : "border-border shadow-none",
                isArchived && "opacity-70 grayscale-[20%]",
                actionUrl && "cursor-pointer"
            )}
            onClick={() => {
                if (isUnread) {
                    onMarkRead?.(id);
                }
            }}
        >
            {actionUrl ? (
                <Link to={actionUrl} className="block w-full text-right" onClick={(e) => {
                    // prevent default navigation if clicked on actions panel
                    if (e.target.closest('button')) {
                        e.preventDefault();
                    }
                }}>
                    {cardContent}
                </Link>
            ) : (
                cardContent
            )}
        </div>
    );
};

export default NotificationItem;
