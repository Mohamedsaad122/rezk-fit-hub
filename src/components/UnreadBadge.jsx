import React from 'react';
import { cn } from '@/lib/utils';

export const UnreadBadge = ({ count, className }) => {
    if (!count || count <= 0) return null;

    return (
        <span
            className={cn(
                "relative flex h-5 min-w-5 px-1.5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground shadow-sm shadow-destructive/50 select-none animate-pulse",
                className
            )}
        >
            {count > 99 ? '99+' : count}
        </span>
    );
};

export default UnreadBadge;
