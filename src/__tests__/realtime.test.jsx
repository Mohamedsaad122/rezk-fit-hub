import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { QueryClient } from '@tanstack/react-query';
import { useRealtimeStore } from '../realtime/connection-state';
import { eventBus } from '../realtime/event-bus';
import { socketManager } from '../realtime/socket-manager';
import { mockRealtime } from '../realtime/mockRealtime';
import { initQuerySynchronizer } from '../realtime/query-synchronizer';
import { SOCKET_EVENTS } from '../realtime/socket-events';
import AppConfig from '../config/app.config';

describe('Sprint 4.1 Real-time Infrastructure & Cache Sync Test Suite', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        useRealtimeStore.getState().resetStore();
        socketManager.disconnect();
        mockRealtime.stop();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    describe('1. Zustand Realtime Store & Metrics', () => {
        it('should initialize with default disconnected state', () => {
            const state = useRealtimeStore.getState();
            expect(state.isConnected).toBe(false);
            expect(state.isConnecting).toBe(false);
            expect(state.reconnectAttempts).toBe(0);
            expect(state.latency).toBe(0);
        });

        it('should update connection statistics and attempts count', () => {
            const store = useRealtimeStore.getState();
            
            store.setConnecting(true);
            expect(useRealtimeStore.getState().isConnecting).toBe(true);

            store.setConnected(true);
            expect(useRealtimeStore.getState().isConnected).toBe(true);
            expect(useRealtimeStore.getState().isConnecting).toBe(false);
            expect(useRealtimeStore.getState().reconnectAttempts).toBe(0);

            store.setConnected(false);
            expect(useRealtimeStore.getState().isConnected).toBe(false);
            expect(useRealtimeStore.getState().lastDisconnectedAt).toBeDefined();

            store.incrementAttempts();
            expect(useRealtimeStore.getState().reconnectAttempts).toBe(1);
        });
    });

    describe('2. Event Bus Pub/Sub System', () => {
        it('should subscribe to event, receive broadcast payload, and unsubscribe correctly', () => {
            const received = [];
            const unsubscribe = eventBus.subscribe(SOCKET_EVENTS.CLIENT_UPDATED, (payload) => {
                received.push(payload);
            });

            eventBus.publish(SOCKET_EVENTS.CLIENT_UPDATED, { id: 5, progress: 85 });
            expect(received.length).toBe(1);
            expect(received[0].id).toBe(5);
            expect(received[0].progress).toBe(85);

            // Unsubscribe and trigger again
            unsubscribe();
            eventBus.publish(SOCKET_EVENTS.CLIENT_UPDATED, { id: 6, progress: 90 });
            expect(received.length).toBe(1); // Should still be 1 (unsubscribed)
        });
    });

    describe('3. Socket Manager & Emulator Reconnections', () => {
        it('should transition to connected status in Mock Mode', () => {
            AppConfig.realtimeMode = 'mock';
            socketManager.connect();
            
            expect(useRealtimeStore.getState().isConnecting).toBe(true);

            // Fast-forward simulated lag (500ms)
            vi.advanceTimersByTime(500);

            expect(useRealtimeStore.getState().isConnected).toBe(true);
            expect(useRealtimeStore.getState().transport).toBe('mock-transport');
        });

        it('should toggle mock realtime emitter loops', () => {
            AppConfig.realtimeMode = 'mock';
            useRealtimeStore.getState().setConnected(true);
            
            const publishSpy = vi.spyOn(eventBus, 'publish');
            
            mockRealtime.start();
            expect(mockRealtime.isRunning).toBe(true);

            // Fast-forward timer by 15 seconds
            vi.advanceTimersByTime(15000);
            expect(publishSpy).toHaveBeenCalled();

            mockRealtime.stop();
            expect(mockRealtime.isRunning).toBe(false);
            publishSpy.mockRestore();
        });
    });

    describe('4. React Query Cache Sync & Invalidation', () => {
        it('should trigger invalidateQueries on CLIENT_CREATED event', () => {
            const mockQueryClient = new QueryClient();
            const invalidateSpy = vi.spyOn(mockQueryClient, 'invalidateQueries');

            initQuerySynchronizer(mockQueryClient);

            eventBus.publish(SOCKET_EVENTS.CLIENT_CREATED, { name: 'صالح علي' });
            
            expect(invalidateSpy).toHaveBeenCalled();
            invalidateSpy.mockRestore();
        });

        it('should optimistically append MESSAGE_SENT to thread data cache', () => {
            const mockQueryClient = new QueryClient();
            initQuerySynchronizer(mockQueryClient);

            const threadKey = ['messages', 'thread', 2]; // Conversation with user 2
            
            mockQueryClient.setQueryData(threadKey, [
                { id: 1, senderId: 1, content: 'مرحباً سارة' }
            ]);

            const mockIncomingMessage = {
                id: 105,
                senderId: 2, // From Sara
                recipientId: 1,
                content: 'أهلاً كوتش، كيف حالك؟',
                timestamp: new Date().toISOString()
            };

            eventBus.publish(SOCKET_EVENTS.MESSAGE_SENT, mockIncomingMessage);

            const updatedThread = mockQueryClient.getQueryData(threadKey);
            expect(updatedThread.length).toBe(2);
            expect(updatedThread[1].content).toBe('أهلاً كوتش، كيف حالك؟');
            expect(updatedThread[1].id).toBe(105);
        });
    });
});
