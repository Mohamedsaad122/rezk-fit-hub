import { z } from 'zod';

export const ChatMessageSchema = z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string().min(1, 'محتوى الرسالة مطلوب'),
    timestamp: z.string()
});

export const ChatSessionSchema = z.object({
    id: z.union([z.string(), z.number()]),
    tenantId: z.union([z.string(), z.number()]),
    title: z.string(),
    messages: z.array(ChatMessageSchema),
    createdAt: z.string(),
    updatedAt: z.string()
});

export const ChatSessionListSchema = z.array(ChatSessionSchema);

export default ChatSessionSchema;
