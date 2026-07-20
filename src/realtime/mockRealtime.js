import { eventBus } from './event-bus';
import { SOCKET_EVENTS } from './socket-events';
import AppConfig from '@/config/app.config';
import { useRealtimeStore } from './connection-state';

class MockRealtime {
    constructor() {
        this.primaryInterval = null;
        this.calendarInterval = null;
        this.networkInterval = null;
        this.isRunning = false;
        this.unsubscribeSentListener = null;
        
        // Mock users profile list
        this.mockUsers = [
            { id: 2, name: 'محمد علي', avatar: '👨', color: '#2ed573' },
            { id: 3, name: 'فاطمة حسن', avatar: '👩', color: '#ff4757' },
            { id: 5, name: 'أخصائي التغذية', avatar: '🍎', color: '#ffa502' }
        ];
    }

    /**
     * Start the simulation intervals.
     */
    start() {
        if (this.isRunning || AppConfig.realtimeMode !== 'mock') return;
        this.isRunning = true;

        // Auto read simulator: When Coach sends a message, simulate Client reading it after 3 seconds
        this.unsubscribeSentListener = eventBus.subscribe(SOCKET_EVENTS.MESSAGE_SENT, (msg) => {
            if (msg && msg.sender === 'Coach') {
                setTimeout(() => {
                    const readPayload = {
                        conversationId: Number(msg.conversationId),
                        userId: 2,
                        userName: 'سارة أحمد',
                        seenAt: new Date().toISOString()
                    };
                    eventBus.publish(SOCKET_EVENTS.MESSAGES_READ, readPayload);
                    console.log('[MockRealtime] Auto-read triggered:', readPayload);
                }, 3000);
            }
        });

        // 1. Primary Collaboration Loop (presence, comments, locks, mentions, activity)
        this.primaryInterval = setInterval(() => {
            if (!useRealtimeStore.getState().isConnected) return; // Skip if disconnected

            const randomChance = Math.random();

            if (randomChance < 0.25) {
                // Presence updates: random user status shifts
                const user = this.mockUsers[Math.floor(Math.random() * this.mockUsers.length)];
                const statuses = ['online', 'away', 'busy', 'offline'];
                const status = statuses[Math.floor(Math.random() * statuses.length)];
                
                const presencePayload = {
                    userId: user.id,
                    name: user.name,
                    status,
                    lastSeen: new Date().toISOString(),
                    activeConversationId: status === 'online' ? 1 : null
                };
                eventBus.publish(SOCKET_EVENTS.PRESENCE_UPDATED, presencePayload);
                console.log('[MockRealtime] Presence transition:', presencePayload);

            } else if (randomChance < 0.45) {
                // Typing indicator followed by comment addition
                const user = this.mockUsers[Math.floor(Math.random() * this.mockUsers.length)];
                const entityTypes = ['Client', 'Task', 'Document', 'Appointment'];
                const entityType = entityTypes[Math.floor(Math.random() * entityTypes.length)];
                const entityId = Math.floor(Math.random() * 3) + 1; // entity IDs 1..3

                const typingPayload = {
                    conversationId: user.id,
                    userId: user.id,
                    clientName: user.name
                };
                eventBus.publish(SOCKET_EVENTS.MESSAGE_TYPING, typingPayload);

                setTimeout(() => {
                    eventBus.publish(SOCKET_EVENTS.MESSAGE_STOPPED_TYPING, typingPayload);
                    
                    const mentionTarget = Math.random() < 0.5 ? ' @الكوتش أحمد' : '';
                    const commentsText = [
                        `تم تحديث التفاصيل والتأكد من التزام المتدرب.${mentionTarget}`,
                        `البرنامج يبدو رائعاً، بالتوفيق.${mentionTarget}`,
                        `هل تم مراجعة القياسات الأخيرة؟${mentionTarget}`,
                        `المرفقات تحتوي على كافة البيانات المطلوبة.${mentionTarget}`
                    ];
                    const text = commentsText[Math.floor(Math.random() * commentsText.length)];

                    const commentPayload = {
                        id: Math.floor(Math.random() * 1000) + 100,
                        entityType,
                        entityId,
                        text,
                        author: user.name,
                        authorAvatar: user.avatar,
                        timestamp: new Date().toISOString(),
                        reactions: {},
                        isPinned: false,
                        isResolved: false
                    };

                    eventBus.publish(SOCKET_EVENTS.COMMENT_CREATED, commentPayload);
                    console.log('[MockRealtime] New comment published:', commentPayload);

                    if (text.includes('@')) {
                        eventBus.publish(SOCKET_EVENTS.MENTION_CREATED, {
                            commentId: commentPayload.id,
                            mentionedUser: 'الكوتش أحمد',
                            author: user.name,
                            entityType,
                            entityId
                        });
                    }

                    // Log activity timeline event
                    eventBus.publish(SOCKET_EVENTS.ACTIVITY_CREATED, {
                        id: Math.floor(Math.random() * 1000) + 1000,
                        category: entityType,
                        description: `أضاف ${user.name} تعليقاً على ${entityType} #${entityId}`,
                        actor: user.name,
                        clientId: entityType === 'Client' ? entityId : null,
                        timestamp: new Date().toISOString()
                    });

                }, 2000);

            } else if (randomChance < 0.65) {
                // Lock Management: Acquire/Release cycles
                const user = this.mockUsers[Math.floor(Math.random() * this.mockUsers.length)];
                const entityTypes = ['Client', 'Task', 'Document', 'Appointment'];
                const entityType = entityTypes[Math.floor(Math.random() * entityTypes.length)];
                const entityId = Math.floor(Math.random() * 5) + 1;
                const lockKey = `${entityType}:${entityId}`;

                const lockPayload = {
                    entityKey: lockKey,
                    entityType,
                    entityId,
                    isLocked: true,
                    lockedBy: user.name,
                    lockedByAvatar: user.avatar,
                    lockedAt: new Date().toISOString(),
                    timeoutAt: new Date(Date.now() + 15 * 1000).toISOString(), // 15 seconds lock
                    remainingTime: 15
                };

                eventBus.publish(SOCKET_EVENTS.ENTITY_LOCKED, lockPayload);
                console.log('[MockRealtime] Lock acquired:', lockPayload);

                setTimeout(() => {
                    eventBus.publish(SOCKET_EVENTS.ENTITY_UNLOCKED, {
                        entityKey: lockKey,
                        entityType,
                        entityId,
                        unlockedBy: user.name
                    });
                    console.log('[MockRealtime] Lock released:', lockKey);
                }, 10000);

            } else if (randomChance < 0.8) {
                // Simulate an update conflict & resolution flow
                const entityTypes = ['Client', 'Task', 'Document'];
                const entityType = entityTypes[Math.floor(Math.random() * entityTypes.length)];
                const entityId = 1;

                const conflictPayload = {
                    id: Math.floor(Math.random() * 100) + 200,
                    entityType,
                    entityId,
                    mine: { name: 'الاسم المدخل كوتش', status: 'نشط', progress: 50 },
                    theirs: { name: 'الاسم المدخل سارة', status: 'نشط', progress: 65 },
                    merged: { name: 'الاسم المدخل سارة', status: 'نشط', progress: 65 },
                    resolved: false
                };

                eventBus.publish(SOCKET_EVENTS.MERGE_REQUEST, conflictPayload);
                console.log('[MockRealtime] Concurrent update conflict detected:', conflictPayload);

                setTimeout(() => {
                    eventBus.publish(SOCKET_EVENTS.MERGE_ACCEPTED, {
                        id: conflictPayload.id,
                        entityType,
                        entityId,
                        mergedData: conflictPayload.merged
                    });
                    console.log('[MockRealtime] Merge completed and saved.');
                }, 4000);
            }
        }, 12000);

        // 2. Calendar and Page Viewer / Cursor Simulation (faster loop for coordinates)
        this.calendarInterval = setInterval(() => {
            if (!useRealtimeStore.getState().isConnected) return;

            const viewersList = this.mockUsers.map(u => ({
                username: u.name,
                color: u.color,
                avatar: u.avatar
            }));
            
            eventBus.publish(SOCKET_EVENTS.CALENDAR_PRESENCE_UPDATED, {
                type: 'viewers',
                viewersList
            });

            viewersList.forEach(viewer => {
                eventBus.publish(SOCKET_EVENTS.CALENDAR_PRESENCE_UPDATED, {
                    type: 'cursor',
                    username: viewer.username,
                    cursorData: {
                        x: Math.floor(Math.random() * 700) + 150,
                        y: Math.floor(Math.random() * 450) + 150,
                        color: viewer.color
                    }
                });
            });
        }, 4000);

        // 3. Network Connection state fluctuations (disconnects and latency loops)
        this.networkInterval = setInterval(() => {
            const store = useRealtimeStore.getState();
            const randomChance = Math.random();

            if (randomChance < 0.12 && store.isConnected) {
                // Trigger temporary disconnect drop
                console.warn('[MockRealtime] SIMULATED: Temporary network connection failure.');
                store.setConnected(false);
                
                // Recover automatically after 3 seconds
                setTimeout(() => {
                    console.log('[MockRealtime] SIMULATED: Network reconnected. Synchronizing queries...');
                    store.setConnected(true);
                    store.setTransport('mock-transport');
                    store.setServerVersion('4.4.0-mock');
                    
                    // Trigger global refresh notification / reconnect callbacks
                    eventBus.publish('RECONNECT_SUCCESSFUL', { timestamp: new Date().toISOString() });
                }, 3000);
            } else if (store.isConnected) {
                // Heartbeat latency jitter
                const jitter = Math.floor(Math.random() * 30) + 12;
                store.setLatency(jitter);
            }
        }, 8000);
    }

    /**
     * Stop the simulation.
     */
    stop() {
        if (this.primaryInterval) {
            clearInterval(this.primaryInterval);
            this.primaryInterval = null;
        }
        if (this.calendarInterval) {
            clearInterval(this.calendarInterval);
            this.calendarInterval = null;
        }
        if (this.networkInterval) {
            clearInterval(this.networkInterval);
            this.networkInterval = null;
        }
        if (this.unsubscribeSentListener) {
            this.unsubscribeSentListener();
            this.unsubscribeSentListener = null;
        }
        this.isRunning = false;
    }
}

export const mockRealtime = new MockRealtime();
export default mockRealtime;
