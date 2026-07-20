import React, { useEffect } from 'react';
import {
    useConversations,
    useMessagesThread,
    useSendMessage,
    useMarkConversationRead,
    useUpdateConversation,
    useMarkAllConversationsRead
} from '@/hooks/use-messages';
import { useMessageStore } from '@/store/message.store';
import ConversationList from '@/components/ConversationList';
import ChatWindow from '@/components/ChatWindow';

export const Messages = () => {
    const {
        activeConversationId,
        setActiveConversationId,
        searchQuery,
        setSearchQuery,
        filterStatus,
        setFilterStatus
    } = useMessageStore();

    // Fetch conversations list
    const { data: conversations = [] } = useConversations({
        search: searchQuery,
        status: filterStatus
    });

    // Fetch current message list
    const { data: messages = [] } = useMessagesThread(activeConversationId);

    const sendMessageMutation = useSendMessage();
    const markReadMutation = useMarkConversationRead();
    const updateConvMutation = useUpdateConversation();
    const markAllReadMutation = useMarkAllConversationsRead();

    // Mark current selected thread as read
    useEffect(() => {
        if (activeConversationId) {
            markReadMutation.mutate(activeConversationId);
        }
    }, [activeConversationId, markReadMutation]);

    const activeConv = conversations.find(c => c.id === activeConversationId);

    const handleSendMessage = (text, attachment = null) => {
        if (!activeConversationId) return;
        sendMessageMutation.mutate({
            conversationId: activeConversationId,
            text,
            attachment
        });
    };

    const handlePin = (id) => {
        const conv = conversations.find(c => c.id === id);
        if (!conv) return;
        updateConvMutation.mutate({
            conversationId: id,
            data: { isPinned: !conv.isPinned }
        });
    };

    const handleFavorite = (id) => {
        const conv = conversations.find(c => c.id === id);
        if (!conv) return;
        updateConvMutation.mutate({
            conversationId: id,
            data: { isFavorite: !conv.isFavorite }
        });
    };

    const handleMute = (id) => {
        const conv = conversations.find(c => c.id === id);
        if (!conv) return;
        updateConvMutation.mutate({
            conversationId: id,
            data: { isMuted: !conv.isMuted }
        });
    };

    const handleArchive = (id) => {
        const conv = conversations.find(c => c.id === id);
        if (!conv) return;
        updateConvMutation.mutate({
            conversationId: id,
            data: { isArchived: !conv.isArchived }
        });
    };

    const handleDelete = (id) => {
        if (confirm("هل أنت متأكد من حذف هذه المحادثة بالكامل؟")) {
            updateConvMutation.mutate({
                conversationId: id,
                data: { isArchived: false } // Reset and delete simulation
            });
            if (activeConversationId === id) {
                setActiveConversationId(null);
            }
        }
    };

    const handleMarkAllRead = () => {
        markAllReadMutation.mutate();
    };

    return (
        <div className="p-4 md:p-6 space-y-4 max-w-7xl mx-auto h-[calc(100vh-100px)] flex flex-col">
            <div className="flex flex-col md:flex-row gap-4 flex-1 min-h-0">
                {/* Left/Sidebar panel: Conversations list */}
                <div className="w-full md:w-80 lg:w-96 shrink-0 h-full">
                    <ConversationList
                        conversations={conversations}
                        activeId={activeConversationId}
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        filterStatus={filterStatus}
                        onFilterChange={setFilterStatus}
                        onSelect={setActiveConversationId}
                        onPin={handlePin}
                        onArchive={handleArchive}
                        onDelete={handleDelete}
                        onMute={handleMute}
                        onFavorite={handleFavorite}
                        onMarkAllRead={handleMarkAllRead}
                    />
                </div>

                {/* Main panel: Chat window thread view */}
                <div className="flex-1 h-full min-h-[350px] md:min-h-0">
                    <ChatWindow
                        conversation={activeConv}
                        messages={messages}
                        onSendMessage={handleSendMessage}
                        isSending={sendMessageMutation.isPending}
                        onPin={() => handlePin(activeConversationId)}
                        onArchive={() => handleArchive(activeConversationId)}
                        onDelete={() => handleDelete(activeConversationId)}
                        onMute={() => handleMute(activeConversationId)}
                        onFavorite={() => handleFavorite(activeConversationId)}
                    />
                </div>
            </div>
        </div>
    );
};

export default Messages;
