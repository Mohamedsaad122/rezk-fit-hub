import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { QueryClient } from '@tanstack/react-query';
import { usePresenceStore } from '../store/presence.store';
import { eventBus } from '../realtime/event-bus';
import { initQuerySynchronizer } from '../realtime/query-synchronizer';
import { SOCKET_EVENTS } from '../realtime/socket-events';
import { mockDatabase } from '../mocks/mockDatabase';
import AppConfig from '../config/app.config';

describe('Sprint 4.2 Live Collaboration & Presence Integration Test Suite', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        usePresenceStore.getState().resetPresenceStore();
        mockDatabase.reset();
        AppConfig.enableMock = true;
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe('1. Zustand Presence Store & Actions', () => {
        it('should track selected conversation and unread counters correctly', () => {
            const store = usePresenceStore.getState();
            
            store.setSelectedConversationId(5);
            expect(usePresenceStore.getState().selectedConversationId).toBe(5);

            store.setUnreadCount(5, 2);
            expect(usePresenceStore.getState().unreadCounters[5]).toBe(2);

            store.setUnreadCount(5, 0); // Clear counter
            expect(usePresenceStore.getState().unreadCounters[5]).toBe(0);
        });

        it('should add, update and remove typing users correctly', () => {
            const store = usePresenceStore.getState();

            store.addUserTyping(1, { userId: 2, clientName: 'سارة أحمد' });
            expect(usePresenceStore.getState().typingUsers[1][0].userId).toBe(2);
            expect(usePresenceStore.getState().typingUsers[1][0].clientName).toBe('سارة أحمد');

            store.removeUserTyping(1, 2);
            expect(usePresenceStore.getState().typingUsers[1]).toEqual([]);
        });

        it('should update user presence online/away states', () => {
            const store = usePresenceStore.getState();

            store.updateUserPresence(2, { status: 'away', lastSeen: '2026-07-15T00:00:00Z' });
            expect(usePresenceStore.getState().onlineUsers[2].status).toBe('away');
            expect(usePresenceStore.getState().onlineUsers[2].lastSeen).toBe('2026-07-15T00:00:00Z');
        });
    });

    describe('2. Query Synchronizer Integration & Events Sync', () => {
        it('should handle MESSAGE_TYPING and MESSAGE_STOPPED_TYPING updates', () => {
            const queryClient = new QueryClient();
            initQuerySynchronizer(queryClient);

            // Publish typing start
            eventBus.publish(SOCKET_EVENTS.MESSAGE_TYPING, {
                conversationId: 1,
                userId: 2,
                clientName: 'سارة أحمد'
            });

            expect(usePresenceStore.getState().typingUsers[1][0].userId).toBe(2);

            // Publish typing stop
            eventBus.publish(SOCKET_EVENTS.MESSAGE_STOPPED_TYPING, {
                conversationId: 1,
                userId: 2
            });

            expect(usePresenceStore.getState().typingUsers[1]).toEqual([]);
        });

        it('should handle MESSAGE_EDITED and update thread cache', () => {
            const queryClient = new QueryClient();
            initQuerySynchronizer(queryClient);

            const threadKey = ['messages', 'thread', 1];
            queryClient.setQueryData(threadKey, [
                { id: 10, conversationId: 1, text: 'الرسالة الأصلية', sender: 'Client' }
            ]);

            eventBus.publish(SOCKET_EVENTS.MESSAGE_EDITED, {
                id: 10,
                conversationId: 1,
                text: 'الرسالة المعدلة'
            });

            const updatedThread = queryClient.getQueryData(threadKey);
            expect(updatedThread[0].text).toBe('الرسالة المعدلة');
        });

        it('should handle MESSAGE_DELETED and update thread cache', () => {
            const queryClient = new QueryClient();
            initQuerySynchronizer(queryClient);

            const threadKey = ['messages', 'thread', 1];
            queryClient.setQueryData(threadKey, [
                { id: 10, conversationId: 1, text: 'رسالة ستحذف', sender: 'Client' }
            ]);

            eventBus.publish(SOCKET_EVENTS.MESSAGE_DELETED, {
                messageId: 10,
                conversationId: 1
            });

            const updatedThread = queryClient.getQueryData(threadKey);
            expect(updatedThread.length).toBe(0);
        });

        it('should handle MESSAGE_REACTION_ADDED and remove updates', () => {
            const queryClient = new QueryClient();
            initQuerySynchronizer(queryClient);

            const threadKey = ['messages', 'thread', 1];
            queryClient.setQueryData(threadKey, [
                { id: 10, conversationId: 1, text: 'رسالة تفاعل', sender: 'Client', reactions: [] }
            ]);

            eventBus.publish(SOCKET_EVENTS.MESSAGE_REACTION_ADDED, {
                messageId: 10,
                conversationId: 1,
                userId: 2,
                emoji: '🔥'
            });

            let updatedThread = queryClient.getQueryData(threadKey);
            expect(updatedThread[0].reactions[0]).toEqual({
                emoji: '🔥',
                count: 1,
                userIds: [2]
            });

            eventBus.publish(SOCKET_EVENTS.MESSAGE_REACTION_REMOVED, {
                messageId: 10,
                conversationId: 1,
                userId: 2,
                emoji: '🔥'
            });

            updatedThread = queryClient.getQueryData(threadKey);
            expect(updatedThread[0].reactions.length).toBe(0);
        });

        it('should handle MESSAGES_READ receipts', () => {
            const queryClient = new QueryClient();
            initQuerySynchronizer(queryClient);

            const threadKey = ['messages', 'thread', 1];
            queryClient.setQueryData(threadKey, [
                { id: 10, conversationId: 1, text: 'رسالة غير مقروءة للكوتش', sender: 'Coach', read: false }
            ]);

            const seenAt = new Date().toISOString();
            eventBus.publish(SOCKET_EVENTS.MESSAGES_READ, {
                conversationId: 1,
                userId: 2,
                userName: 'سارة أحمد',
                seenAt
            });

            const updatedThread = queryClient.getQueryData(threadKey);
            expect(updatedThread[0].read).toBe(true);
            expect(updatedThread[0].status).toBe('read');
            expect(updatedThread[0].seenAt).toBe(seenAt);
            expect(updatedThread[0].readers[0].name).toBe('سارة أحمد');
        });
    });

    describe('3. Database Mutators & Filters', () => {
        it('should filter conversations by Favorite status', () => {
            mockDatabase.conversations.update(1, { isFavorite: true });
            
            const favorites = mockDatabase.conversations.getAll({ status: 'Favorite' });
            expect(favorites.length).toBe(1);
            expect(favorites[0].id).toBe(1);
        });

        it('should filter conversations by Muted status', () => {
            mockDatabase.conversations.update(1, { isMuted: true });

            const muted = mockDatabase.conversations.getAll({ status: 'Muted' });
            expect(muted.length).toBe(1);
            expect(muted[0].id).toBe(1);
        });
    });
});
