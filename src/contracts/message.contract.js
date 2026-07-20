import { z } from 'zod';

export const MessageSchema = z.object({
    id: z.number().nonnegative(),
    conversationId: z.number().nonnegative(),
    sender: z.enum(['Coach', 'Client', 'System']),
    text: z.string().min(1),
    timestamp: z.string(), // ISO String
    read: z.boolean(),
    attachment: z.object({
        name: z.string(),
        url: z.string(),
        extension: z.string(),
        size: z.number().optional()
    }).nullable().optional(),
    status: z.enum(['sent', 'delivered', 'read']).optional(),
    seenAt: z.string().nullable().optional(),
    readers: z.array(z.object({
        userId: z.number(),
        name: z.string(),
        readAt: z.string()
    })).optional(),
    reactions: z.array(z.object({
        emoji: z.string(),
        count: z.number(),
        userIds: z.array(z.number())
    })).optional()
});

export const ConversationSchema = z.object({
    id: z.number().nonnegative(),
    clientId: z.number().nonnegative(),
    clientName: z.string(),
    clientAvatar: z.string(),
    lastMessage: z.string(),
    lastMessageAt: z.string(), // ISO String
    unreadCount: z.number().nonnegative(),
    isPinned: z.boolean(),
    isArchived: z.boolean(),
    status: z.enum(['online', 'offline', 'away', 'busy', 'invisible']),
    typing: z.boolean(),
    lastSeen: z.string().nullable().optional(),
    isMuted: z.boolean().optional(),
    isFavorite: z.boolean().optional()
});

export default {
    MessageSchema,
    ConversationSchema
};
