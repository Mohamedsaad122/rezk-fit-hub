import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageService } from '@/services/message.service';

export const useConversations = (filters = {}) => {
    return useQuery({
        queryKey: ['conversations', filters],
        queryFn: () => MessageService.getConversations(filters),
        staleTime: 10 * 1000,
        gcTime: 60 * 1000,
        refetchOnReconnect: true
    });
};

export const useMessagesThread = (conversationId) => {
    return useQuery({
        queryKey: ['messages', 'thread', conversationId ? Number(conversationId) : null],
        queryFn: () => MessageService.getMessages(conversationId),
        enabled: !!conversationId,
        staleTime: 5 * 1000,
        gcTime: 30 * 1000,
        refetchOnReconnect: true
    });
};

export const useSendMessage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ conversationId, text, attachment }) => MessageService.sendMessage(conversationId, text, attachment),
        onMutate: async ({ conversationId, text, attachment }) => {
            const threadKey = ['messages', 'thread', conversationId ? Number(conversationId) : null];
            await queryClient.cancelQueries({ queryKey: threadKey });

            const previousMessages = queryClient.getQueryData(threadKey) || [];
            
            const tempId = `temp-${Date.now()}`;
            const optimisticMessage = {
                id: tempId,
                senderId: 1, // Coach user ID
                senderName: 'الكوتش أحمد',
                content: text,
                timestamp: new Date().toISOString(),
                isRead: false,
                attachmentUrl: attachment ? URL.createObjectURL(attachment) : null,
                attachmentName: attachment ? attachment.name : null
            };

            queryClient.setQueryData(threadKey, [...previousMessages, optimisticMessage]);

            return { previousMessages, threadKey };
        },
        onError: (error, variables, context) => {
            if (context?.previousMessages) {
                queryClient.setQueryData(context.threadKey, context.previousMessages);
            }
        },
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({ queryKey: context.threadKey });
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
        }
    });
};

export const useMarkConversationRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (conversationId) => MessageService.markAsRead(conversationId),
        onSuccess: (data, conversationId) => {
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
            queryClient.invalidateQueries({ queryKey: ['messages', 'thread', Number(conversationId)] });
        }
    });
};

export const useUpdateConversation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ conversationId, data }) => MessageService.updateConversation(conversationId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
        }
    });
};

export const useMarkAllConversationsRead = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => MessageService.markAllAsRead(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
        }
    });
};

export const useEditMessage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ messageId, text }) => MessageService.editMessage(messageId, text),
        onSuccess: (data) => {
            if (data && data.conversationId) {
                queryClient.invalidateQueries({ queryKey: ['messages', 'thread', Number(data.conversationId)] });
                queryClient.invalidateQueries({ queryKey: ['conversations'] });
            }
        }
    });
};

export const useDeleteMessage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ messageId }) => MessageService.deleteMessage(messageId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['messages'] });
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
        }
    });
};

export const useAddReaction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ messageId, userId, userName, emoji }) => MessageService.addReaction(messageId, userId, userName, emoji),
        onSuccess: (data) => {
            if (data && data.conversationId) {
                queryClient.invalidateQueries({ queryKey: ['messages', 'thread', Number(data.conversationId)] });
            }
        }
    });
};

export const useRemoveReaction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ messageId, userId, emoji }) => MessageService.removeReaction(messageId, userId, emoji),
        onSuccess: (data) => {
            if (data && data.conversationId) {
                queryClient.invalidateQueries({ queryKey: ['messages', 'thread', Number(data.conversationId)] });
            }
        }
    });
};

export default useConversations;
