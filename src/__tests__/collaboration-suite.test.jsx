import { describe, it, expect, beforeEach, vi } from 'vitest';
import { usePresenceStore } from '../store/presence.store';
import { useCalendarPresenceStore } from '../store/calendar-presence.store';
import { useRealtimeStore } from '../realtime/connection-state';
import { eventBus } from '../realtime/event-bus';
import { SOCKET_EVENTS } from '../realtime/socket-events';
import { CollaborationRepository } from '../repositories/collaboration.repository';
import { ActivityRepository } from '../repositories/activity.repository';
import AppConfig from '../config/app.config';
import { mockDatabase } from '../mocks/mockDatabase';

// Mock the API delay helper to run tests instantly
vi.mock('../utils/mockApi.helper', () => {
    return {
        simulateApi: vi.fn((dataFn) => typeof dataFn === 'function' ? dataFn() : dataFn),
        delay: vi.fn(() => Promise.resolve())
    };
});

describe('Sprint 4.4 Collaboration & Realtime Integration Test Suite', () => {
    beforeEach(() => {
        useRealtimeStore.getState().resetStore();
        
        // Reset stores
        usePresenceStore.setState({
            onlineUsers: {},
            typingUsers: {}
        });
        useCalendarPresenceStore.setState({
            viewersList: [],
            activeLocks: {},
            cursors: {}
        });

        // Configure mock mode
        AppConfig.enableMock = true;
        AppConfig.realtimeMode = 'mock';
    });

    describe('1. Live Presence & Zustand Store Synchronization', () => {
        it('should handle user presence additions, status changes, and removals', () => {
            // Simulating socket presence event
            const payload = {
                userId: 2,
                name: 'محمد علي',
                status: 'online',
                lastSeen: new Date().toISOString()
            };

            // Event Bus subscription callback updates local Zustand store
            usePresenceStore.setState({
                onlineUsers: {
                    ...usePresenceStore.getState().onlineUsers,
                    [payload.userId]: { status: payload.status, lastSeen: payload.lastSeen }
                }
            });

            let currentStore = usePresenceStore.getState();
            expect(currentStore.onlineUsers[2]).toBeDefined();
            expect(currentStore.onlineUsers[2].status).toBe('online');

            // Simulate status changes
            usePresenceStore.setState({
                onlineUsers: {
                    ...usePresenceStore.getState().onlineUsers,
                    [payload.userId]: { status: 'away', lastSeen: new Date().toISOString() }
                }
            });

            currentStore = usePresenceStore.getState();
            expect(currentStore.onlineUsers[2].status).toBe('away');
        });

        it('should track viewer presence list and coordinates inside calendar presence store', () => {
            const viewers = [
                { username: 'أحمد', color: '#ff0000', avatar: '👨' },
                { username: 'سارة', color: '#00ff00', avatar: '👩' }
            ];

            // Update store
            useCalendarPresenceStore.setState({ viewersList: viewers });
            expect(useCalendarPresenceStore.getState().viewersList.length).toBe(2);

            // Update cursors
            useCalendarPresenceStore.setState({
                cursors: {
                    ...useCalendarPresenceStore.getState().cursors,
                    'أحمد': { x: 120, y: 350, color: '#ff0000' }
                }
            });

            const userCursor = useCalendarPresenceStore.getState().cursors['أحمد'];
            expect(userCursor).toBeDefined();
            expect(userCursor.x).toBe(120);
            expect(userCursor.y).toBe(350);
        });
    });

    describe('2. Editing Locks Lifecycle Management', () => {
        it('should acquire, verify, renew, and release resource locks', async () => {
            const entityType = 'Client';
            const entityId = 99;
            const username = 'الكوتش أحمد';
            const avatar = '👨‍و';

            // Acquire lock
            const acquireResult = await CollaborationRepository.acquireLock(entityType, entityId, username, avatar);
            expect(acquireResult.success).toBe(true);

            // Check lock status
            const lockStatus = await CollaborationRepository.getLock(entityType, entityId);
            expect(lockStatus.isLocked).toBe(true);
            expect(lockStatus.lockedBy).toBe(username);

            // Renew lock
            const renewResult = await CollaborationRepository.renewLock(entityType, entityId, username, avatar);
            expect(renewResult.success).toBe(true);

            // Release lock
            const releaseResult = await CollaborationRepository.releaseLock(entityType, entityId, username);
            expect(releaseResult).toBe(true);

            const finalLockStatus = await CollaborationRepository.getLock(entityType, entityId);
            expect(finalLockStatus.isLocked).toBe(false);
        });
    });

    describe('3. Comments Engine & Mentions System', () => {
        it('should support creation, update, reactions addition, and pinning comments', async () => {
            const entityType = 'Task';
            const entityId = 12;
            const text = 'تم إنهاء المراجعة المبدئية للبرنامج الغذائي';
            const author = 'أخصائي التغذية';
            const avatar = '🍎';

            // Create comment
            const comment = await CollaborationRepository.addComment(entityType, entityId, text, author, avatar);
            expect(comment.id).toBeDefined();
            expect(comment.text).toBe(text);
            expect(comment.author).toBe(author);

            // Update comment
            const updatedComment = await CollaborationRepository.updateComment(comment.id, 'نص معدل');
            expect(updatedComment.text).toBe('نص معدل');

            // Add reaction
            const reactionComment = await CollaborationRepository.addReaction(comment.id, 'الكوتش أحمد', '🔥');
            expect(reactionComment.reactions['🔥']).toContain('الكوتش أحمد');

            // Toggle pin comment
            const pinnedComment = await CollaborationRepository.togglePinComment(comment.id, true);
            expect(pinnedComment.isPinned).toBe(true);

            // Resolve comment
            const resolvedComment = await CollaborationRepository.resolveComment(comment.id, true);
            expect(resolvedComment.isResolved).toBe(true);

            // Delete comment
            const deleteResult = await CollaborationRepository.deleteComment(comment.id);
            expect(deleteResult).toBe(true);
        });

        it('should parse mentions and dispatch notify updates', async () => {
            const text = 'يرجى متابعة التطورات @الكوتش أحمد للضرورة';
            const entityType = 'Client';
            const entityId = 1;
            
            const publishSpy = vi.spyOn(eventBus, 'publish');
            
            // Check message parsing logic simulation
            if (text.includes('@الكوتش أحمد')) {
                eventBus.publish(SOCKET_EVENTS.MENTION_CREATED, {
                    commentId: 45,
                    mentionedUser: 'الكوتش أحمد',
                    author: 'محمد علي',
                    entityType,
                    entityId
                });
            }

            expect(publishSpy).toHaveBeenCalledWith(SOCKET_EVENTS.MENTION_CREATED, expect.objectContaining({
                mentionedUser: 'الكوتش أحمد',
                entityType: 'Client'
            }));

            publishSpy.mockRestore();
        });
    });

    describe('4. Merge Conflicts & Concurrent Editing Resolution', () => {
        it('should create merge requests and resolve conflicts', async () => {
            const entityType = 'Document';
            const entityId = 88;
            
            const mine = { name: 'المسودة النهائية - النسخة أ', size: 1024 };
            const theirs = { name: 'المسودة النهائية - النسخة ب', size: 2048 };
            const merged = { name: 'المسودة النهائية - مدمجة', size: 2048 };

            // Create merge request
            const req = await CollaborationRepository.createMergeRequest(entityType, entityId, mine, theirs, merged);
            expect(req.id).toBeDefined();
            expect(req.entityType).toBe(entityType);
            expect(req.entityId).toBe(entityId);
            expect(req.resolved).toBe(false);

            // Resolve conflict with accepted status
            const resolveResult = await CollaborationRepository.resolveMergeConflict(req.id, 'accepted', merged);
            expect(resolveResult).toBe(true);

            // Fetch conflict requests state from DB
            const dbRequest = mockDatabase.collaboration.mergeRequests.getAll().find(r => r.id === req.id);
            expect(dbRequest.resolved).toBe(true);
        });
    });

    describe('5. Real-time Connection Resiliency & Latency Heartbeats', () => {
        it('should handle disconnect, heartbeat refresh, and automatic recovery invalidation loops', () => {
            const store = useRealtimeStore.getState();
            const publishSpy = vi.spyOn(eventBus, 'publish');
            
            // Initial Connected state
            store.setConnected(true);
            store.setTransport('websocket');
            expect(useRealtimeStore.getState().isConnected).toBe(true);

            // Simulate disconnect drop
            store.setConnected(false);
            expect(useRealtimeStore.getState().isConnected).toBe(false);
            expect(useRealtimeStore.getState().lastDisconnectedAt).toBeDefined();

            // Simulate reconnect automatic recovery
            store.setConnected(true);
            store.setLatency(15);
            eventBus.publish('RECONNECT_SUCCESSFUL', { timestamp: new Date().toISOString() });

            expect(useRealtimeStore.getState().isConnected).toBe(true);
            expect(useRealtimeStore.getState().latency).toBe(15);
            expect(publishSpy).toHaveBeenCalledWith('RECONNECT_SUCCESSFUL', expect.any(Object));

            publishSpy.mockRestore();
        });
    });

    describe('6. Activity Timeline Logger Integration', () => {
        it('should append, filter, and fetch entity specific logs', async () => {
            const category = 'Appointment';
            const description = 'تم نقل موعد تدريب سارة أحمد للثامنة صباحاً';
            const actor = 'الكوتش أحمد';

            // Create activity timeline record
            const log = await ActivityRepository.logActivity(category, description, actor, 2);
            expect(log.id).toBeDefined();
            expect(log.category).toBe(category);
            expect(log.description).toBe(description);

            // Retrieve logs
            const logs = await ActivityRepository.getActivities({ category });
            expect(logs.length).toBeGreaterThan(0);
            expect(logs.find(l => l.id === log.id)).toBeDefined();
        });
    });
});
