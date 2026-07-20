import { MessageRepository } from '@/repositories/message.repository';

export const MessageService = {
    getConversations: (filters = {}) => {
        return MessageRepository.getConversations(filters);
    },
    getMessages: (conversationId) => {
        return MessageRepository.getMessages(conversationId);
    },
    sendMessage: (conversationId, text, attachment = null) => {
        return MessageRepository.sendMessage(conversationId, text, attachment);
    },
    getOrCreateByClient: (clientId, clientName) => {
        return MessageRepository.getOrCreateByClient(clientId, clientName);
    },
    updateConversation: (conversationId, data) => {
        return MessageRepository.updateConversation(conversationId, data);
    },
    markAsRead: (conversationId) => {
        return MessageRepository.markAsRead(conversationId);
    },
    markAllAsRead: () => {
        return MessageRepository.markAllAsRead();
    },
    editMessage: (messageId, text) => {
        return MessageRepository.editMessage(messageId, text);
    },
    deleteMessage: (messageId) => {
        return MessageRepository.deleteMessage(messageId);
    },
    addReaction: (messageId, userId, userName, emoji) => {
        return MessageRepository.addReaction(messageId, userId, userName, emoji);
    },
    removeReaction: (messageId, userId, emoji) => {
        return MessageRepository.removeReaction(messageId, userId, emoji);
    }
};

export default MessageService;
