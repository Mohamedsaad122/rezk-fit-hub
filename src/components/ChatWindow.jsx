import React, { useEffect, useRef } from 'react';
import { Phone, Video, MoreVertical, Pin, Archive, Trash2, VolumeX, Star } from 'lucide-react';
import MessageBubble from './MessageBubble';
import MessageComposer from './MessageComposer';
import { usePresenceStore } from '@/store/presence.store';
import { formatRelativeTime } from '@/utils/relative-time';
import { SocketService } from '@/realtime/socket.service';
import { SOCKET_EVENTS } from '@/realtime/socket-events';

export const ChatWindow = ({
    conversation,
    messages = [],
    onSendMessage,
    isSending,
    onPin,
    onArchive,
    onDelete,
    onMute,
    onFavorite
}) => {
    const threadEndRef = useRef(null);

    // Auto-scroll on new messages
    useEffect(() => {
        threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, conversation?.typing]);

    // Connect to global presence store to get live overrides
    const onlineUsers = usePresenceStore((state) => state.onlineUsers);
    const typingUsers = usePresenceStore((state) => {
        if (!conversation) return [];
        return state.typingUsers[conversation.id] || [];
    });

    if (!conversation) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-muted/20 border border-border/40 rounded-xl p-6 text-center select-none">
                <span className="text-5xl mb-4">💬</span>
                <h3 className="font-bold text-lg text-foreground mb-1">حدد محادثة للبدء</h3>
                <p className="text-xs text-muted-foreground max-w-xs">
                    اختر أحد المتدربين من القائمة الجانبية لبدء المحادثة المباشرة معه ومتابعة التزامه.
                </p>
            </div>
        );
    }

    const { id, clientId, clientName, clientAvatar, isPinned, isMuted = false, isFavorite = false, status, lastSeen } = conversation;

    const userPresence = onlineUsers[clientId];
    const activeStatus = userPresence ? userPresence.status : status;
    const activeLastSeen = userPresence ? userPresence.lastSeen : lastSeen;

    const getStatusText = (statusVal) => {
        switch (statusVal) {
            case 'online':
                return 'نشط الآن';
            case 'away':
                return 'بالخارج';
            case 'busy':
                return 'مشغول';
            case 'invisible':
            case 'offline':
            default:
                return activeLastSeen ? `نشط ${formatRelativeTime(activeLastSeen)}` : 'غير متصل';
        }
    };

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

    // Format typing indicator text for multiple users
    const getTypingText = () => {
        if (typingUsers.length === 0) return null;
        if (typingUsers.length === 1) {
            return `${typingUsers[0].clientName} يكتب الآن...`;
        }
        if (typingUsers.length === 2) {
            return `${typingUsers[0].clientName} و ${typingUsers[1].clientName} يكتبان الآن...`;
        }
        return 'عدة متدربين يكتبون الآن...';
    };

    const handleTypingChange = (isTyping) => {
        SocketService.emit(isTyping ? SOCKET_EVENTS.MESSAGE_TYPING : SOCKET_EVENTS.MESSAGE_STOPPED_TYPING, {
            conversationId: id,
            userId: 1, // Coach ID
            clientName: 'الكوتش أحمد'
        });
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-card border border-border/40 rounded-xl overflow-hidden shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/40 bg-card">
                <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xl shadow-inner">
                        {clientAvatar || "👤"}
                        <span
                            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card ${getStatusColor(activeStatus)}`}
                        />
                    </div>
                    <div>
                        <h4 className="font-semibold text-sm text-foreground flex items-center gap-1.5">
                            {clientName}
                            {isFavorite && <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
                            {isPinned && <Pin className="w-3 h-3 text-primary fill-primary" />}
                        </h4>
                        <p className="text-[10px] text-muted-foreground">
                            {getStatusText(activeStatus)}
                        </p>
                    </div>
                </div>

                {/* Call actions & Thread options */}
                <div className="flex items-center gap-2">
                    <button
                        className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                        title="اتصال صوتي (قريباً)"
                    >
                        <Phone className="w-4 h-4" />
                    </button>
                    <button
                        className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                        title="اتصال فيديو (قريباً)"
                    >
                        <Video className="w-4 h-4" />
                    </button>
                    <div className="relative group/menu">
                        <button className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                            <MoreVertical className="w-4 h-4" />
                        </button>
                        <div className="absolute left-0 mt-1 hidden group-hover/menu:block bg-card border rounded-lg shadow-lg py-1 w-36 z-30">
                            <button
                                onClick={onPin}
                                className="w-full text-right px-3 py-1.5 text-xs text-foreground hover:bg-muted flex items-center gap-2"
                            >
                                <Pin className="w-3.5 h-3.5" />
                                {isPinned ? 'إلغاء التثبيت' : 'تثبيت'}
                            </button>
                            <button
                                onClick={onFavorite}
                                className="w-full text-right px-3 py-1.5 text-xs text-foreground hover:bg-muted flex items-center gap-2"
                            >
                                <Star className="w-3.5 h-3.5" />
                                {isFavorite ? 'إزالة المفضلة' : 'تفضيل'}
                            </button>
                            <button
                                onClick={onMute}
                                className="w-full text-right px-3 py-1.5 text-xs text-foreground hover:bg-muted flex items-center gap-2"
                            >
                                <VolumeX className="w-3.5 h-3.5" />
                                {isMuted ? 'إلغاء الكتم' : 'كتم'}
                            </button>
                            <button
                                onClick={onArchive}
                                className="w-full text-right px-3 py-1.5 text-xs text-foreground hover:bg-muted flex items-center gap-2"
                            >
                                <Archive className="w-3.5 h-3.5" />
                                {conversation.isArchived ? 'إلغاء الأرشفة' : 'أرشفة'}
                            </button>
                            <button
                                onClick={onDelete}
                                className="w-full text-right px-3 py-1.5 text-xs text-destructive hover:bg-red-500/10 flex items-center gap-2"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                                حذف
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scrollable messages container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-muted/10 max-h-[calc(100vh-290px)] scrollbar-thin">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                        <span className="text-3xl mb-1">👋</span>
                        <p className="text-xs">ابدأ بإرسال رسالة ترحيبية للعميل!</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <MessageBubble key={msg.id} message={msg} />
                    ))
                )}

                {/* Animated Typing Indicator */}
                {typingUsers.length > 0 && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/40 p-2.5 rounded-xl max-w-[220px] animate-pulse">
                        <span className="flex gap-1">
                            <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"></span>
                            <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]"></span>
                            <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        </span>
                        <span>{getTypingText()}</span>
                    </div>
                )}
                <div ref={threadEndRef} />
            </div>

            {/* Composer */}
            <MessageComposer 
                onSendMessage={onSendMessage} 
                isSending={isSending} 
                onTyping={handleTypingChange}
            />
        </div>
    );
};

export default ChatWindow;
