import React, { useState, useRef } from 'react';
import { Send, Paperclip, Smile, X } from 'lucide-react';
import { simulateFileUpload } from '@/utils/upload-utils';

export const MessageComposer = ({ onSendMessage, isSending, onTyping }) => {
    const [text, setText] = useState('');
    const [showEmojis, setShowEmojis] = useState(false);
    const [attachedFile, setAttachedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const isTypingRef = useRef(false);

    const quickEmojis = ["💪", "🥗", "👏", "👍", "🔥", "🍎", "📝", "🤝"];

    const handleSend = (e) => {
        e.preventDefault();
        if ((!text.trim() && !attachedFile) || isSending || uploading) return;

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        if (isTypingRef.current && onTyping) {
            isTypingRef.current = false;
            onTyping(false);
        }

        if (attachedFile) {
            onSendMessage(text, attachedFile);
        } else {
            onSendMessage(text);
        }
        setText('');
        setAttachedFile(null);
    };

    const handleTextChange = (val) => {
        setText(val);

        if (onTyping) {
            if (!isTypingRef.current && val.trim().length > 0) {
                isTypingRef.current = true;
                onTyping(true);
            }

            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }

            typingTimeoutRef.current = setTimeout(() => {
                isTypingRef.current = false;
                onTyping(false);
            }, 2500);
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        simulateFileUpload(file).then(meta => {
            setAttachedFile(meta);
            setUploading(false);
        });
    };

    const insertEmoji = (emoji) => {
        handleTextChange(text + emoji);
        setShowEmojis(false);
    };

    return (
        <form onSubmit={handleSend} className="p-3 border-t border-border/40 bg-card space-y-2">
            {/* Attached file preview chip */}
            {attachedFile && (
                <div className="flex items-center justify-between bg-muted/60 p-2 rounded-lg text-xs gap-3 rtl text-right">
                    <span className="truncate max-w-[260px] font-bold text-foreground">📎 {attachedFile.name}</span>
                    <button 
                        type="button" 
                        onClick={() => setAttachedFile(null)} 
                        className="text-destructive hover:text-destructive/80 font-bold p-1 rounded-full hover:bg-muted"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}
            {uploading && (
                <div className="text-[10px] text-primary animate-pulse font-bold text-right">جاري تحميل وإرفاق الملف...</div>
            )}

            {/* Quick Emoji Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <button
                    type="button"
                    onClick={() => setShowEmojis(!showEmojis)}
                    className="p-1.5 text-muted-foreground hover:text-primary hover:bg-muted/50 rounded-lg transition-colors shrink-0"
                    title="ملصقات سريعة"
                >
                    <Smile className="w-4 h-4" />
                </button>
                {quickEmojis.map((emoji) => (
                    <button
                        key={emoji}
                        type="button"
                        onClick={() => insertEmoji(emoji)}
                        className="text-sm px-1.5 py-0.5 hover:bg-muted rounded transition-colors shrink-0"
                    >
                        {emoji}
                    </button>
                ))}
            </div>

            {/* Input Composer area */}
            <div className="flex items-center gap-2">
                <input 
                    type="file" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleFileSelect} 
                />
                
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading || isSending}
                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all disabled:opacity-50"
                    title="إرفاق ملف"
                >
                    <Paperclip className="w-5 h-5" />
                </button>

                <input
                    type="text"
                    placeholder={attachedFile ? "تم إرفاق مستند. اضغط إرسال أو أضف نصاً..." : "اكتب رسالتك هنا..."}
                    value={text}
                    onChange={(e) => handleTextChange(e.target.value)}
                    className="flex-1 px-4 py-2 bg-muted/50 rounded-lg text-sm text-foreground placeholder:text-muted-foreground border border-border/40 focus:outline-none focus:border-primary/50 transition-colors"
                    disabled={isSending || uploading}
                    aria-label="محتوى الرسالة"
                />

                <button
                    type="submit"
                    disabled={(!text.trim() && !attachedFile) || isSending || uploading}
                    className="p-2 bg-primary hover:bg-primary/95 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground rounded-lg transition-all shadow-sm"
                    aria-label="إرسال الرسالة"
                >
                    <Send className="w-4 h-4 rotate-180" />
                </button>
            </div>
        </form>
    );
};

export default MessageComposer;
