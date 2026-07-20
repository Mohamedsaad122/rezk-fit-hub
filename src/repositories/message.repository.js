import AppConfig from '@/config/app.config';
import { mockDatabase } from '@/mocks/mockDatabase';
import { simulateApi } from '@/utils/mockApi.helper';
import { parseApiResponse } from '@/utils/parseApiResponse';
import { z } from 'zod';
import { ConversationSchema, MessageSchema } from '@/contracts/message.contract';

export const MessageRepository = {
    getConversations: async (filters = {}) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.conversations.getAll(filters));
        } else {
            // Placeholder for API route integration
            result = [];
        }
        return parseApiResponse(z.array(ConversationSchema), result, 'Conversations List');
    },

    getMessages: async (conversationId) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.messages.getAll(Number(conversationId)));
        } else {
            result = [];
        }
        return parseApiResponse(z.array(MessageSchema), result, 'Message Thread');
    },

    sendMessage: async (conversationId, text, attachment = null) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.messages.create({
                conversationId: Number(conversationId),
                text,
                sender: 'Coach',
                attachment
            }));
        } else {
            result = {};
        }
        return parseApiResponse(MessageSchema, result, 'Sent Message');
    },

    getOrCreateByClient: async (clientId, clientName) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.conversations.getOrCreateByClient(Number(clientId), clientName));
        } else {
            result = {};
        }
        return parseApiResponse(ConversationSchema, result, 'Client Conversation Header');
    },

    updateConversation: async (conversationId, data) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.conversations.update(Number(conversationId), data));
        } else {
            result = {};
        }
        return parseApiResponse(ConversationSchema, result, 'Updated Conversation');
    },

    markAsRead: async (conversationId) => {
        if (AppConfig.enableMock) {
            await simulateApi(() => mockDatabase.conversations.markAsRead(Number(conversationId)));
            return true;
        }
        return true;
    },

    markAllAsRead: async () => {
        if (AppConfig.enableMock) {
            await simulateApi(() => mockDatabase.conversations.markAllAsRead());
            return true;
        }
        return true;
    },

    editMessage: async (messageId, text) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.messages.edit(Number(messageId), text));
        } else {
            result = {};
        }
        return parseApiResponse(MessageSchema, result, 'Edited Message');
    },

    deleteMessage: async (messageId) => {
        if (AppConfig.enableMock) {
            await simulateApi(() => mockDatabase.messages.delete(Number(messageId)));
            return true;
        }
        return true;
    },

    addReaction: async (messageId, userId, userName, emoji) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.messages.addReaction(Number(messageId), Number(userId), userName, emoji));
        } else {
            result = {};
        }
        return parseApiResponse(MessageSchema, result, 'Reaction Added');
    },

    removeReaction: async (messageId, userId, emoji) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.messages.removeReaction(Number(messageId), Number(userId), emoji));
        } else {
            result = {};
        }
        return parseApiResponse(MessageSchema, result, 'Reaction Removed');
    }
};

export default MessageRepository;
