import React, { useState } from 'react';
import { MessageSquare, Send, CornerDownLeft, Pin, ShieldCheck, Edit3, Trash2 } from 'lucide-react';
import { useEntityComments } from '../hooks/use-collaboration';
import { useAdminUsers } from '../hooks/use-admin-users';
import { Button } from './ui/button';
import { Input } from './ui/input';

export const CommentEngine = ({ entityType, entityId, currentUser = 'الكوتش أحمد', currentUserAvatar = '👨‍و' }) => {
    const {
        comments,
        isLoading,
        addComment,
        updateComment,
        deleteComment,
        togglePin,
        resolveComment,
        addReaction,
        removeReaction
    } = useEntityComments(entityType, entityId);

    const { data: staffData = [] } = useAdminUsers({ limit: 100 });
    const staffList = Array.isArray(staffData) ? staffData : (staffData?.data || []);

    const [newCommentText, setNewCommentText] = useState('');
    const [replyToId, setReplyToId] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editText, setEditText] = useState('');
    const [showMentionDropdown, setShowMentionDropdown] = useState(false);
    const [mentionFilter, setMentionFilter] = useState('');
    const [dropdownTriggerType, setDropdownTriggerType] = useState('new'); // 'new' | 'reply' | 'edit'

    const handleTextChange = (val, type = 'new') => {
        setDropdownTriggerType(type);
        if (type === 'new') {
            setNewCommentText(val);
        } else if (type === 'reply') {
            setReplyText(val);
        } else {
            setEditText(val);
        }

        // Find last index of '@'
        const atIndex = val.lastIndexOf('@');
        if (atIndex !== -1 && atIndex >= val.length - 15) {
            const part = val.substring(atIndex + 1);
            if (!part.includes(' ')) {
                setShowMentionDropdown(true);
                setMentionFilter(part.toLowerCase());
                return;
            }
        }
        setShowMentionDropdown(false);
    };

    const insertMention = (username, type = 'new') => {
        if (type === 'new') {
            const atIndex = newCommentText.lastIndexOf('@');
            const prefix = newCommentText.substring(0, atIndex);
            setNewCommentText(`${prefix}@${username} `);
        } else if (type === 'reply') {
            const atIndex = replyText.lastIndexOf('@');
            const prefix = replyText.substring(0, atIndex);
            setReplyText(`${prefix}@${username} `);
        } else {
            const atIndex = editText.lastIndexOf('@');
            const prefix = editText.substring(0, atIndex);
            setEditText(`${prefix}@${username} `);
        }
        setShowMentionDropdown(false);
    };

    const handleSubmit = async (e, parentId = null) => {
        e.preventDefault();
        const text = parentId ? replyText : newCommentText;
        if (!text.trim()) return;

        await addComment({
            text,
            author: currentUser,
            authorAvatar: currentUserAvatar,
            parentId
        });

        if (parentId) {
            setReplyText('');
            setReplyToId(null);
        } else {
            setNewCommentText('');
        }
    };

    const handleSaveEdit = async (id) => {
        if (!editText.trim()) return;
        await updateComment({ id, text: editText });
        setEditingCommentId(null);
        setEditText('');
    };

    const handleReactionClick = async (commentId, emoji, reactionsObj = {}) => {
        const reactedUsers = reactionsObj[emoji] || [];
        if (reactedUsers.includes(currentUser)) {
            await removeReaction({ id: commentId, username: currentUser, emoji });
        } else {
            await addReaction({ id: commentId, username: currentUser, emoji });
        }
    };

    // Grouping
    const topLevelComments = comments.filter(c => !c.parentId);
    const getReplies = (parentId) => comments.filter(c => c.parentId === parentId);

    const emojis = ['👍', '❤️', '🔥', '😂', '👏', '🎉', '😮', '😢'];

    if (!entityId) return null;

    const renderComment = (comment, isReply = false) => {
        const isEditing = editingCommentId === comment.id;
        const replies = getReplies(comment.id);

        return (
            <div key={comment.id} className={`p-4 rounded-xl border border-border bg-card text-right ${isReply ? 'mr-8 bg-zinc-50/50 dark:bg-zinc-900/30' : 'mb-3'}`}>
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 flex-row-reverse">
                        <span className="text-sm font-bold text-foreground">{comment.author}</span>
                        <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center text-sm">
                            {comment.authorAvatar || '👤'}
                        </div>
                        <span className="text-[10px] text-muted-foreground">
                            {new Date(comment.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                        {comment.isPinned && (
                            <span className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 text-[10px] px-1.5 py-0.5 rounded-md flex items-center gap-1 font-semibold">
                                <Pin className="w-3 h-3" /> مثبت
                            </span>
                        )}
                        {comment.isResolved && (
                            <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-[10px] px-1.5 py-0.5 rounded-md flex items-center gap-1 font-semibold">
                                <ShieldCheck className="w-3 h-3" /> تم حلّه
                            </span>
                        )}
                    </div>
                </div>

                {/* Content */}
                {isEditing ? (
                    <div className="mb-2">
                        <Input
                            value={editText}
                            onChange={(e) => handleTextChange(e.target.value, 'edit')}
                            className="text-right mb-2"
                        />
                        <div className="flex justify-end gap-1.5">
                            <Button size="sm" variant="ghost" onClick={() => setEditingCommentId(null)}>إلغاء</Button>
                            <Button size="sm" onClick={() => handleSaveEdit(comment.id)}>حفظ</Button>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-foreground mb-3 leading-relaxed">
                        {comment.text}
                    </p>
                )}

                {/* Footer Controls & Reactions */}
                <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-border/50">
                    <div className="flex items-center gap-1 flex-wrap">
                        {emojis.map(emoji => {
                            const count = comment.reactions?.[emoji]?.length || 0;
                            const isReacted = comment.reactions?.[emoji]?.includes(currentUser);
                            return (
                                <button
                                    key={emoji}
                                    onClick={() => handleReactionClick(comment.id, emoji, comment.reactions)}
                                    className={`px-2 py-0.5 text-xs rounded-full border flex items-center gap-1 transition-all ${isReacted ? 'bg-primary/10 border-primary text-primary font-bold' : 'bg-muted/30 border-border hover:bg-muted text-muted-foreground'}`}
                                >
                                    <span>{count}</span>
                                    <span>{emoji}</span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex items-center gap-1.5">
                        {!isReply && !comment.isResolved && (
                            <Button
                                size="sm"
                                variant="ghost"
                                className="text-xs text-zinc-500 h-8 flex items-center gap-1"
                                onClick={() => {
                                    setReplyToId(replyToId === comment.id ? null : comment.id);
                                    setReplyText('');
                                }}
                            >
                                <CornerDownLeft className="w-3.5 h-3.5" />
                                رد
                            </Button>
                        )}
                        {!comment.parentId && (
                            <Button
                                size="sm"
                                variant="ghost"
                                className="text-xs text-amber-600 h-8"
                                onClick={() => togglePin({ id: comment.id, isPinned: !comment.isPinned })}
                            >
                                {comment.isPinned ? 'إلغاء التثبيت' : 'تثبيت'}
                            </Button>
                        )}
                        {!comment.parentId && (
                            <Button
                                size="sm"
                                variant="ghost"
                                className="text-xs text-green-600 h-8"
                                onClick={() => resolveComment({ id: comment.id, isResolved: !comment.isResolved })}
                            >
                                {comment.isResolved ? 'فتح التعليق' : 'حل التعليق'}
                            </Button>
                        )}
                        {comment.author === currentUser && (
                            <>
                                <button
                                    className="p-1.5 text-zinc-400 hover:text-foreground hover:bg-muted rounded-lg transition"
                                    onClick={() => {
                                        setEditingCommentId(comment.id);
                                        setEditText(comment.text);
                                    }}
                                >
                                    <Edit3 className="w-3.5 h-3.5 animate-in fade-in duration-200" />
                                </button>
                                <button
                                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-500/10 rounded-lg transition"
                                    onClick={() => deleteComment(comment.id)}
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Reply Form nested */}
                {replyToId === comment.id && (
                    <form onSubmit={(e) => handleSubmit(e, comment.id)} className="mt-3 flex items-center gap-2 flex-row-reverse border-t border-border/50 pt-3">
                        <div className="relative flex-1">
                            <Input
                                value={replyText}
                                onChange={(e) => handleTextChange(e.target.value, 'reply')}
                                placeholder="اكتب رداً..."
                                className="text-right pl-10 pr-3 rounded-lg"
                            />
                            {showMentionDropdown && dropdownTriggerType === 'reply' && renderMentionDropdown('reply')}
                        </div>
                        <Button type="submit" size="sm" className="rounded-lg h-9">إرسال</Button>
                    </form>
                )}

                {/* Nested Replies */}
                {replies.length > 0 && (
                    <div className="mt-3 space-y-2 border-r border-border/50 pr-4">
                        {replies.map(reply => renderComment(reply, true))}
                    </div>
                )}
            </div>
        );
    };

    const renderMentionDropdown = (type) => {
        const filtered = staffList.filter(s => 
            s.name.toLowerCase().includes(mentionFilter) || 
            (s.role && s.role.toLowerCase().includes(mentionFilter))
        );

        if (filtered.length === 0) return null;

        return (
            <div className="absolute z-50 bottom-full mb-1 left-0 right-0 bg-popover border border-border rounded-xl shadow-xl max-h-40 overflow-y-auto p-1 text-right">
                {filtered.map(user => (
                    <button
                        key={user.id}
                        type="button"
                        onClick={() => insertMention(user.name, type)}
                        className="w-full px-3 py-1.5 text-xs hover:bg-accent hover:text-accent-foreground rounded-lg flex items-center justify-between flex-row-reverse"
                    >
                        <span className="font-semibold">@{user.name}</span>
                        <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-md">{user.role || 'موظف'}</span>
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2 flex-row-reverse">
                <MessageSquare className="w-4 h-4 text-primary" />
                ملاحظات التعاون والنقاش
            </h3>

            {/* List */}
            {isLoading ? (
                <div className="text-center py-4 text-xs text-muted-foreground">جاري تحميل التعليقات...</div>
            ) : comments.length === 0 ? (
                <div className="text-center py-6 text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                    لا توجد تعليقات بعد. ابدأ النقاش بالأسفل!
                </div>
            ) : (
                <div className="space-y-1">
                    {topLevelComments.map(c => renderComment(c))}
                </div>
            )}

            {/* Write Comment */}
            <form onSubmit={(e) => handleSubmit(e)} className="flex gap-2 flex-row-reverse items-end mt-4">
                <div className="relative flex-1">
                    <Input
                        value={newCommentText}
                        onChange={(e) => handleTextChange(e.target.value, 'new')}
                        placeholder="أضف تعليقاً واستخدم @ للإشارة إلى زملائك..."
                        className="text-right pl-10 pr-4 py-2.5 rounded-xl h-11 border-border focus-visible:ring-primary"
                    />
                    {showMentionDropdown && dropdownTriggerType === 'new' && renderMentionDropdown('new')}
                </div>
                <Button type="submit" className="rounded-xl h-11 px-4 flex items-center gap-1.5 bg-primary text-white">
                    <Send className="w-4 h-4" />
                    إرسال
                </Button>
            </form>
        </div>
    );
};

export default CommentEngine;
