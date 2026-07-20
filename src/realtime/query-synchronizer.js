import { eventBus } from './event-bus';
import { SOCKET_EVENTS } from './socket-events';
import QUERY_KEYS from '@/constants/queryKeys';
import { usePresenceStore } from '@/store/presence.store';
import { useCalendarPresenceStore } from '@/store/calendar-presence.store';

/**
 * Initializes listeners linking real-time messages with React Query data caches.
 * @param {QueryClient} queryClient - Active React Query client.
 */
export const initQuerySynchronizer = (queryClient) => {
    // 1. Trainee/Clients Cache Invalidations
    eventBus.subscribe(SOCKET_EVENTS.CLIENT_CREATED, () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.clients.all });
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard.stats });
    });
    
    eventBus.subscribe(SOCKET_EVENTS.CLIENT_UPDATED, (client) => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.clients.all });
        if (client && client.id) {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.clients.detail(client.id) });
        }
    });

    eventBus.subscribe(SOCKET_EVENTS.CLIENT_DELETED, () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.clients.all });
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.dashboard.stats });
    });

    // 2. Tasks Cache Invalidations
    eventBus.subscribe(SOCKET_EVENTS.TASK_CREATED, () => {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
    });

    eventBus.subscribe(SOCKET_EVENTS.TASK_UPDATED, () => {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
    });

    eventBus.subscribe(SOCKET_EVENTS.TASK_COMPLETED, (task) => {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks.statistics() });
        if (task && task.id) {
            queryClient.invalidateQueries({ queryKey: ['tasks', 'detail', task.id] });
        }
    });

    // 3. Messages Chat Thread Appender & Collaboration Sync
    eventBus.subscribe(SOCKET_EVENTS.MESSAGE_SENT, (msg) => {
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
        if (msg) {
            const conversationId = msg.conversationId 
                ? Number(msg.conversationId)
                : (msg.senderId === 1 ? Number(msg.recipientId) : Number(msg.senderId));
            if (conversationId) {
                const threadKey = ['messages', 'thread', conversationId];
                queryClient.setQueryData(threadKey, (old) => {
                    const list = Array.isArray(old) ? old : [];
                    if (list.some(m => m.id === msg.id)) return list;
                    return [...list, msg];
                });
            }
        }
    });

    eventBus.subscribe(SOCKET_EVENTS.MESSAGE_EDITED, (msg) => {
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
        if (msg && msg.conversationId) {
            const conversationId = Number(msg.conversationId);
            const threadKey = ['messages', 'thread', conversationId];
            queryClient.setQueryData(threadKey, (old) => {
                if (!Array.isArray(old)) return [];
                return old.map(m => m.id === msg.id ? { ...m, ...msg } : m);
            });
        }
    });

    eventBus.subscribe(SOCKET_EVENTS.MESSAGE_DELETED, (payload) => {
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
        if (payload && payload.conversationId && payload.messageId) {
            const conversationId = Number(payload.conversationId);
            const threadKey = ['messages', 'thread', conversationId];
            queryClient.setQueryData(threadKey, (old) => {
                if (!Array.isArray(old)) return [];
                return old.filter(m => m.id !== Number(payload.messageId));
            });
        }
    });

    eventBus.subscribe(SOCKET_EVENTS.MESSAGE_REACTION_ADDED, (payload) => {
        if (payload && payload.conversationId && payload.messageId) {
            const conversationId = Number(payload.conversationId);
            const threadKey = ['messages', 'thread', conversationId];
            queryClient.setQueryData(threadKey, (old) => {
                if (!Array.isArray(old)) return [];
                return old.map(m => {
                    if (m.id !== Number(payload.messageId)) return m;
                    const reactions = m.reactions ? [...m.reactions] : [];
                    const react = reactions.find(r => r.emoji === payload.emoji);
                    if (react) {
                        if (!react.userIds.includes(Number(payload.userId))) {
                            react.userIds.push(Number(payload.userId));
                            react.count = react.userIds.length;
                        }
                    } else {
                        reactions.push({ emoji: payload.emoji, count: 1, userIds: [Number(payload.userId)] });
                    }
                    return { ...m, reactions };
                });
            });
        }
    });

    eventBus.subscribe(SOCKET_EVENTS.MESSAGE_REACTION_REMOVED, (payload) => {
        if (payload && payload.conversationId && payload.messageId) {
            const conversationId = Number(payload.conversationId);
            const threadKey = ['messages', 'thread', conversationId];
            queryClient.setQueryData(threadKey, (old) => {
                if (!Array.isArray(old)) return [];
                return old.map(m => {
                    if (m.id !== Number(payload.messageId)) return m;
                    if (!m.reactions) return m;
                    const reactions = m.reactions.map(r => {
                        if (r.emoji !== payload.emoji) return r;
                        const userIds = r.userIds.filter(uid => uid !== Number(payload.userId));
                        return { ...r, userIds, count: userIds.length };
                    }).filter(r => r.count > 0);
                    return { ...m, reactions };
                });
            });
        }
    });

    eventBus.subscribe(SOCKET_EVENTS.MESSAGES_READ, (payload) => {
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
        if (payload && payload.conversationId) {
            const conversationId = Number(payload.conversationId);
            const threadKey = ['messages', 'thread', conversationId];
            queryClient.setQueryData(threadKey, (old) => {
                if (!Array.isArray(old)) return [];
                return old.map(m => {
                    if (m.conversationId === conversationId && m.sender !== 'Client') {
                        const readers = m.readers ? [...m.readers] : [];
                        if (!readers.some(r => r.userId === Number(payload.userId))) {
                            readers.push({ userId: payload.userId, name: payload.userName || 'مستخدم', readAt: payload.seenAt });
                        }
                        return { ...m, read: true, status: 'read', seenAt: payload.seenAt, readers };
                    }
                    return m;
                });
            });
        }
    });

    eventBus.subscribe(SOCKET_EVENTS.MESSAGE_TYPING, (payload) => {
        if (payload && payload.conversationId && payload.userId) {
            usePresenceStore.getState().addUserTyping(payload.conversationId, {
                userId: payload.userId,
                clientName: payload.clientName || 'متدرب'
            });
        }
    });

    eventBus.subscribe(SOCKET_EVENTS.MESSAGE_STOPPED_TYPING, (payload) => {
        if (payload && payload.conversationId && payload.userId) {
            usePresenceStore.getState().removeUserTyping(payload.conversationId, payload.userId);
        }
    });

    eventBus.subscribe(SOCKET_EVENTS.PRESENCE_UPDATED, (payload) => {
        queryClient.invalidateQueries({ queryKey: ['conversations'] });
        if (payload && payload.userId) {
            usePresenceStore.getState().updateUserPresence(payload.userId, {
                status: payload.status,
                lastSeen: payload.lastSeen,
                activeConversationId: payload.activeConversationId
            });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.clients.detail(payload.userId) });
        }
    });

    // 4. Notifications Counters Sync
    eventBus.subscribe(SOCKET_EVENTS.NOTIFICATION_CREATED, () => {
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications.unread });
    });

    eventBus.subscribe(SOCKET_EVENTS.NOTIFICATION_READ, () => {
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.notifications.unread });
    });

    // 5. Calendar Schedules Sync
    eventBus.subscribe(SOCKET_EVENTS.CALENDAR_UPDATED, () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.calendar.all });
        queryClient.invalidateQueries({ queryKey: ['calendar', 'list'] });
    });

    eventBus.subscribe(SOCKET_EVENTS.APPOINTMENT_CREATED, () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.calendar.all });
        queryClient.invalidateQueries({ queryKey: ['calendar', 'list'] });
    });

    eventBus.subscribe(SOCKET_EVENTS.APPOINTMENT_UPDATED, () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.calendar.all });
        queryClient.invalidateQueries({ queryKey: ['calendar', 'list'] });
    });

    eventBus.subscribe(SOCKET_EVENTS.APPOINTMENT_DELETED, () => {
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.calendar.all });
        queryClient.invalidateQueries({ queryKey: ['calendar', 'list'] });
    });

    eventBus.subscribe(SOCKET_EVENTS.APPOINTMENT_LOCKED, (payload) => {
        if (payload && payload.appointmentId) {
            useCalendarPresenceStore.getState().updateLock(payload.appointmentId, {
                isLocked: true,
                lockedBy: payload.username,
                timeoutAt: payload.timeoutAt
            });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.calendar.all });
        }
    });

    eventBus.subscribe(SOCKET_EVENTS.APPOINTMENT_UNLOCKED, (payload) => {
        if (payload && payload.appointmentId) {
            useCalendarPresenceStore.getState().removeLock(payload.appointmentId);
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.calendar.all });
        }
    });

    eventBus.subscribe(SOCKET_EVENTS.CALENDAR_PRESENCE_UPDATED, (payload) => {
        if (!payload) return;
        if (payload.type === 'viewers' && payload.viewersList) {
            useCalendarPresenceStore.getState().setViewers(payload.viewersList);
        } else if (payload.type === 'editors' && payload.editorsMap) {
            useCalendarPresenceStore.getState().setEditors(payload.editorsMap);
        } else if (payload.type === 'cursor' && payload.username && payload.cursorData) {
            useCalendarPresenceStore.getState().updateCursor(payload.username, payload.cursorData);
        } else if (payload.type === 'cursor_leave' && payload.username) {
            useCalendarPresenceStore.getState().removeCursor(payload.username);
        }
    });

    // 6. Collaboration Suite Real-time Synchronization (Sprint 4.4)
    eventBus.subscribe(SOCKET_EVENTS.COMMENT_CREATED, (comment) => {
        queryClient.invalidateQueries({ queryKey: ['comments', comment.entityType, comment.entityId] });
    });
    eventBus.subscribe(SOCKET_EVENTS.COMMENT_UPDATED, (comment) => {
        queryClient.invalidateQueries({ queryKey: ['comments', comment.entityType, comment.entityId] });
    });
    eventBus.subscribe(SOCKET_EVENTS.COMMENT_DELETED, (payload) => {
        queryClient.invalidateQueries({ queryKey: ['comments', payload.entityType, payload.entityId] });
    });

    eventBus.subscribe(SOCKET_EVENTS.ENTITY_LOCKED, (lock) => {
        queryClient.invalidateQueries({ queryKey: ['entity-lock', lock.entityType, lock.entityId] });
    });
    eventBus.subscribe(SOCKET_EVENTS.ENTITY_UNLOCKED, (payload) => {
        queryClient.invalidateQueries({ queryKey: ['entity-lock', payload.entityType, payload.entityId] });
    });

    eventBus.subscribe(SOCKET_EVENTS.ACTIVITY_CREATED, (activity) => {
        queryClient.invalidateQueries({ queryKey: ['timeline', activity.category, activity.clientId] });
        queryClient.invalidateQueries({ queryKey: ['timeline'] });
    });

    eventBus.subscribe(SOCKET_EVENTS.MERGE_REQUEST, (payload) => {
        queryClient.invalidateQueries({ queryKey: ['merge-conflict', payload.entityType, payload.entityId] });
    });
    eventBus.subscribe(SOCKET_EVENTS.MERGE_ACCEPTED, (payload) => {
        queryClient.invalidateQueries({ queryKey: ['merge-conflict', payload.entityType, payload.entityId] });
        
        // Invalidate corresponding entity cache
        if (payload.entityType === 'Client') {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.clients.all });
            if (payload.entityId) {
                queryClient.invalidateQueries({ queryKey: QUERY_KEYS.clients.detail(payload.entityId) });
            }
        } else if (payload.entityType === 'Task') {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        } else if (payload.entityType === 'Document') {
            queryClient.invalidateQueries({ queryKey: ['documents'] });
        } else if (payload.entityType === 'Appointment') {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.calendar.all });
        } else if (payload.entityType === 'Nutrition') {
            queryClient.invalidateQueries({ queryKey: ['nutrition'] });
        }
    });
    eventBus.subscribe(SOCKET_EVENTS.MERGE_REJECTED, (payload) => {
        queryClient.invalidateQueries({ queryKey: ['merge-conflict', payload.entityType, payload.entityId] });
    });
};

export default initQuerySynchronizer;
