import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AIChatRepository } from '@/repositories/ai-chat.repository';
import { AIService } from '@/services/ai.service';
import { useConversationStore } from '@/store/conversation.store';

export const useAIChat = () => {
    const queryClient = useQueryClient();
    const { activeSessionId, setActiveSessionId, streamingMessage, setStreamingMessage, appendChunk } = useConversationStore();

    const sessionsQuery = useQuery({
        queryKey: ['saas', 'ai', 'chats'],
        queryFn: () => AIChatRepository.getSessions()
    });

    const createSessionMutation = useMutation({
        mutationFn: (title) => AIChatRepository.createSession(title),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['saas', 'ai', 'chats'] });
            setActiveSessionId(data.id);
        }
    });

    const sendMessageMutation = useMutation({
        mutationFn: async ({ sessionId, content }) => {
            await AIChatRepository.sendMessage(sessionId, { role: 'user', content });
            queryClient.invalidateQueries({ queryKey: ['saas', 'ai', 'chats'] });

            setStreamingMessage('');
            const fullResponse = await AIService.streamText(
                content,
                (chunk) => {
                    appendChunk(chunk);
                }
            );

            const updatedSession = await AIChatRepository.sendMessage(sessionId, {
                role: 'assistant',
                content: fullResponse
            });
            setStreamingMessage('');
            return updatedSession;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['saas', 'ai', 'chats'] });
        }
    });

    return {
        sessions: sessionsQuery.data || [],
        isLoading: sessionsQuery.isLoading,
        activeSessionId,
        setActiveSessionId,
        streamingMessage,
        createSession: createSessionMutation.mutateAsync,
        sendMessage: sendMessageMutation.mutateAsync
    };
};

export default useAIChat;
