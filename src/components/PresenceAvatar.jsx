import React from 'react';
import { usePresenceStore } from '../store/presence.store';

export const PresenceAvatar = ({ userId, avatar = '👤', size = 'md', className = '' }) => {
    const status = usePresenceStore(state => state.onlineUsers[Number(userId)]?.status || 'offline');

    const statusColors = {
        online: 'bg-green-500',
        away: 'bg-amber-500',
        busy: 'bg-red-500',
        offline: 'bg-zinc-400'
    };

    const statusLabels = {
        online: 'متصل',
        away: 'خارج العمل',
        busy: 'مشغول',
        offline: 'غير متصل'
    };

    const sizeClasses = {
        sm: 'w-8 h-8 text-sm',
        md: 'w-10 h-10 text-base',
        lg: 'w-12 h-12 text-lg'
    };

    const dotSizeClasses = {
        sm: 'w-2.5 h-2.5',
        md: 'w-3.5 h-3.5',
        lg: 'w-4 h-4'
    };

    return (
        <div className={`relative inline-block ${className}`}>
            <div className={`flex items-center justify-center rounded-full bg-muted border border-border font-medium text-foreground ${sizeClasses[size]}`}>
                {avatar}
            </div>
            <span 
                className={`absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-background ${statusColors[status]} ${dotSizeClasses[size]}`}
                title={statusLabels[status]}
            />
        </div>
    );
};

export default PresenceAvatar;
