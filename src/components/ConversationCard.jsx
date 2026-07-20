import React from 'react';
import { Pin, Archive, Trash2, VolumeX, Star } from 'lucide-react';
import { formatRelativeTime } from '@/utils/relative-time';
import { usePresenceStore } from '@/store/presence.store';

export const ConversationCard = ({
    conversation,
    isActive,
    onSelect,
    onPin,
    onArchive,
    onDelete,
    onMute,
    onFavorite
}) => {
    const {
        id,
        clientId,
        clientName,
        clientAvatar,
        lastMessage,
        lastMessageAt,
        unreadCount,
        isPinned,
        status,
        typing,
        isMuted = false,
        isFavorite = false
    } = conversation;

    // Connect to global presence store to get live overrides
    const onlineUsers = usePresenceStore((state) => state.onlineUsers);
    const typingUsers = usePresenceStore((state) => state.typingUsers[id] || []);

    const userPresence = onlineUsers[clientId];
    const activeStatus = userPresence ? userPresence.status : status;
    const isTyping = typing || typingUsers.length > 0;

    const getStatusColor = (statusVal) => {
        switch (statusVal) {
            case 'online':
                return 'bg-emerald-500';
            case 'away':
                return 'bg-amber-500';
            case 'busy':
                return 'bg-red-500';
            case 'invisible':
            case 'offline':
            default:
                return 'bg-zinc-400';
        }
    };

    return (
        <div
            onClick={onSelect}
            className={`flex items-center gap-3 p-3.5 rounded-xl cursor-pointer transition-all border select-none group relative ${
                isActive
                    ? 'bg-primary/10 border-primary/20 shadow-sm'
                    : 'bg-card hover:bg-muted/50 border-border/40'
            }`}
        >
            {/* Avatar & Online status indicator */}
            <div className="relative shrink-0 w-12 h-12 rounded-full bg-muted flex items-center justify-center text-2xl shadow-inner">
                {clientAvatar || "👤"}
                <span
                    className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-card ${getStatusColor(activeStatus)}`}
                />
            </div>

            {/* Conversation text content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-sm text-foreground truncate ml-2 flex items-center gap-1">
                        {clientName}
                        {isFavorite && <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
                    </h4>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {formatRelativeTime(lastMessageAt)}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    {isTyping ? (
                        <p className="text-xs text-primary font-medium truncate animate-pulse">
                            يكتب الآن...
                        </p>
                    ) : (
                        <p className="text-xs text-muted-foreground truncate max-w-[170px]">
                            {lastMessage}
                        </p>
                    )}

                    {/* Unread badge count & Pin / Mute icons */}
                    <div className="flex items-center gap-1.5 shrink-0">
                        {isMuted && (
                            <VolumeX className="w-3 h-3 text-muted-foreground" />
                        )}
                        {isPinned && (
                            <Pin className="w-3.5 h-3.5 text-primary fill-primary" />
                        )}
                        {unreadCount > 0 && (
                            <span className="bg-destructive text-destructive-foreground text-[10px] font-extrabold px-1.5 py-0.5 rounded-full min-w-5 h-5 flex items-center justify-center animate-pulse">
                                {unreadCount}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions (Hover overlay/context buttons) */}
            <div className="absolute left-2 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center gap-1 bg-background/90 backdrop-blur-sm p-1 rounded-lg border shadow-sm transition-all z-10">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onPin();
                    }}
                    className="p-1 text-muted-foreground hover:text-primary rounded transition-colors"
                    title={isPinned ? "إلغاء التثبيت" : "تثبيت المحادثة"}
                >
                    <Pin className="w-3.5 h-3.5" />
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (onFavorite) onFavorite();
                    }}
                    className={`p-1 rounded transition-colors ${isFavorite ? 'text-yellow-500 hover:text-yellow-600' : 'text-muted-foreground hover:text-yellow-500'}`}
                    title={isFavorite ? "إزالة من المفضلة" : "إضافة للمفضلة"}
                >
                    <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-yellow-500' : ''}`} />
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (onMute) onMute();
                    }}
                    className={`p-1 rounded transition-colors ${isMuted ? 'text-destructive hover:text-destructive/80' : 'text-muted-foreground hover:text-destructive'}`}
                    title={isMuted ? "إلغاء الكتم" : "كتم المحادثة"}
                >
                    <VolumeX className="w-3.5 h-3.5" />
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onArchive();
                    }}
                    className="p-1 text-muted-foreground hover:text-orange-500 rounded transition-colors"
                    title="أرشفة المحادثة"
                >
                    <Archive className="w-3.5 h-3.5" />
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    className="p-1 text-muted-foreground hover:text-destructive rounded transition-colors"
                    title="حذف المحادثة"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
};

export default ConversationCard;
