import React from 'react';
import { Check, CheckCheck } from 'lucide-react';
import { useAddReaction, useRemoveReaction } from '@/hooks/use-messages';

export const MessageBubble = ({ message }) => {
    const { id, sender, text, timestamp, read, status, seenAt, readers = [], reactions = [] } = message;

    const addReactionMutation = useAddReaction();
    const removeReactionMutation = useRemoveReaction();

    const isCoach = sender === 'Coach';
    const isSystem = sender === 'System';

    const handleReactionClick = (emoji, hasReacted) => {
        if (hasReacted) {
            removeReactionMutation.mutate({
                messageId: id,
                userId: 1, // Coach user ID
                emoji
            });
        } else {
            addReactionMutation.mutate({
                messageId: id,
                userId: 1, // Coach user ID
                userName: 'الكوتش أحمد',
                emoji
            });
        }
    };

    if (isSystem) {
        return (
            <div className="flex justify-center my-2.5">
                <div className="bg-muted/70 text-[11px] text-muted-foreground px-3 py-1 rounded-full border border-border/20 text-center max-w-[85%] select-none">
                    {text}
                </div>
            </div>
        );
    }

    // Seen status tooltip details
    const seenTooltip = seenAt 
        ? `شوهد في: ${new Date(seenAt).toLocaleTimeString('ar', { hour: '2-digit', minute: '2-digit' })} - قُرئت بواسطة: ${readers.map(r => r.name).join(', ') || 'سارة أحمد'}` 
        : 'لم تقرأ بعد';

    return (
        <div className={`flex w-full mb-3.5 relative group ${isCoach ? 'justify-start' : 'justify-end'}`}>
            {/* Emoji Reaction Quick Bar (Hover Overlay) */}
            <div className="absolute -top-7 hidden group-hover:flex items-center gap-1 bg-card border border-border/60 rounded-full p-1 shadow-md z-20 transition-all rtl:right-2 ltr:left-2">
                {['👍', '❤️', '🔥', '😂', '👏', '🎉', '😮', '😢'].map((emoji) => {
                    const isSelected = reactions?.some(r => r.emoji === emoji && r.userIds.includes(1));
                    return (
                        <button
                            key={emoji}
                            onClick={() => handleReactionClick(emoji, isSelected)}
                            className={`hover:scale-125 transition-transform px-1 text-sm ${isSelected ? 'scale-110' : ''}`}
                            title={emoji}
                        >
                            {emoji}
                        </button>
                    );
                })}
            </div>

            <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm border text-sm relative ${
                    isCoach
                        ? 'bg-primary text-primary-foreground border-primary/10 rounded-tr-none'
                        : 'bg-muted/80 text-foreground border-border/40 rounded-tl-none'
                }`}
            >
                {/* Message Body */}
                {text && <p className="leading-relaxed break-words whitespace-pre-wrap">{text}</p>}

                {/* Attachment Preview */}
                {message.attachment && (
                    <div className="mt-2 pt-2 border-t border-current/10">
                        {['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(message.attachment.extension?.toLowerCase()) ? (
                            <div className="rounded-lg overflow-hidden border max-w-xs bg-black/10">
                                <img 
                                    src={message.attachment.url} 
                                    alt={message.attachment.name} 
                                    className="max-h-48 w-full object-contain hover:scale-105 transition-transform cursor-pointer" 
                                    onClick={() => window.open(message.attachment.url, '_blank')}
                                />
                            </div>
                        ) : (
                            <div className={`flex justify-between items-center bg-black/10 p-2 rounded-lg text-xs gap-3 ${
                                isCoach ? 'text-primary-foreground' : 'text-foreground'
                            }`}>
                                <span className="truncate max-w-[180px] font-bold" title={message.attachment.name}>
                                    📄 {message.attachment.name}
                                </span>
                                <button 
                                    onClick={() => window.open(message.attachment.url, '_blank')}
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-colors ${
                                        isCoach 
                                            ? 'bg-primary-foreground/15 text-primary-foreground hover:bg-primary-foreground/25 border-primary-foreground/20' 
                                            : 'bg-muted text-foreground hover:bg-muted/80 border-border'
                                    }`}
                                >
                                    تحميل
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Reactions Tags Display */}
                {reactions && reactions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {reactions.map((react, i) => {
                            const hasReacted = react.userIds.includes(1);
                            return (
                                <button
                                    key={i}
                                    onClick={() => handleReactionClick(react.emoji, hasReacted)}
                                    className={`flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full border transition-all ${
                                        hasReacted
                                            ? 'bg-primary-foreground/20 border-primary-foreground text-primary-foreground'
                                            : isCoach
                                                ? 'bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground/80 hover:bg-primary-foreground/15'
                                                : 'bg-muted border-border text-muted-foreground hover:bg-muted/85'
                                    }`}
                                    title={react.userIds.length > 0 ? `قُرئت بواسطة: ${react.userIds.join(', ')}` : ''}
                                >
                                    <span>{react.emoji}</span>
                                    <span className="font-bold">{react.count}</span>
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Meta details (time & read receipt) */}
                <div className={`flex items-center justify-end gap-1 mt-1.5 text-[9px] ${
                    isCoach ? 'text-primary-foreground/75' : 'text-muted-foreground'
                }`}>
                    <span>{new Date(timestamp).toLocaleTimeString('ar', { hour: '2-digit', minute: '2-digit' })}</span>
                    
                    {isCoach && (
                        <div className="cursor-help flex items-center" title={seenTooltip}>
                            {status === 'read' || read ? (
                                <CheckCheck className="w-3.5 h-3.5 text-sky-200" />
                            ) : status === 'delivered' ? (
                                <CheckCheck className="w-3.5 h-3.5 text-primary-foreground/40" />
                            ) : (
                                <Check className="w-3.5 h-3.5 text-primary-foreground/45" />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;
