import { useEffect, useRef } from 'react';
import { SocketService } from '@/realtime/socket.service';
import { SOCKET_EVENTS } from '@/realtime/socket-events';
import { usePresenceStore } from '@/store/presence.store';
import { useMessageStore } from '@/store/message.store';

const IDLE_TIMEOUT_MS = 3 * 60 * 1000; // 3 minutes for idle/away status
const HEARTBEAT_INTERVAL_MS = 10 * 1000; // 10 seconds heartbeat

export const usePresenceManager = (userId = 1, userName = 'الكوتش أحمد') => {
    const { 
        updateUserPresence, 
        selectedConversationId,
        setSelectedConversationId 
    } = usePresenceStore();

    const { activeConversationId } = useMessageStore();
    const lastActivityRef = useRef(Date.now());
    const statusRef = useRef('online'); // 'online', 'away', 'busy', 'invisible'

    // Update selected conversation in presence store whenever activeConversationId changes
    useEffect(() => {
        setSelectedConversationId(activeConversationId);
    }, [activeConversationId, setSelectedConversationId]);

    useEffect(() => {
        // Track activities to reset idle timer
        const handleActivity = () => {
            lastActivityRef.current = Date.now();
            if (statusRef.current === 'away') {
                statusRef.current = 'online';
                sendHeartbeat('online');
            }
        };

        const activityEvents = ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'];
        activityEvents.forEach((ev) => window.addEventListener(ev, handleActivity));

        // Start heartbeat emit interval
        const sendHeartbeat = (status) => {
            const currentStatus = status || statusRef.current;
            if (currentStatus === 'invisible') {
                // In invisible mode, we don't broadcast online status
                return;
            }
            SocketService.emit(SOCKET_EVENTS.PRESENCE_UPDATED, {
                userId,
                name: userName,
                status: currentStatus,
                lastSeen: new Date().toISOString(),
                activeConversationId: selectedConversationId
            });
        };

        // Send initial heartbeat
        sendHeartbeat('online');

        // Check for idle timeouts
        const idleCheckInterval = setInterval(() => {
            const elapsed = Date.now() - lastActivityRef.current;
            if (elapsed >= IDLE_TIMEOUT_MS && statusRef.current === 'online') {
                statusRef.current = 'away';
                sendHeartbeat('away');
            }
        }, 10000);

        // Heartbeat interval
        const heartbeatInterval = setInterval(() => {
            sendHeartbeat();
        }, HEARTBEAT_INTERVAL_MS);

        // Subscribe to presence changes from other users
        const unsubscribePresence = SocketService.subscribe(SOCKET_EVENTS.PRESENCE_UPDATED, (payload) => {
            if (payload && payload.userId) {
                updateUserPresence(payload.userId, {
                    status: payload.status,
                    lastSeen: payload.lastSeen,
                    activeConversationId: payload.activeConversationId
                });
            }
        });

        return () => {
            activityEvents.forEach((ev) => window.removeEventListener(ev, handleActivity));
            clearInterval(idleCheckInterval);
            clearInterval(heartbeatInterval);
            unsubscribePresence();
        };
    }, [userId, userName, selectedConversationId, updateUserPresence]);

    // Expose utility function to change status manually
    const changeStatus = (newStatus) => {
        if (['online', 'away', 'busy', 'invisible'].includes(newStatus)) {
            statusRef.current = newStatus;
            if (newStatus === 'invisible') {
                // Notify others that we went offline
                SocketService.emit(SOCKET_EVENTS.PRESENCE_UPDATED, {
                    userId,
                    name: userName,
                    status: 'offline',
                    lastSeen: new Date().toISOString()
                });
            } else {
                SocketService.emit(SOCKET_EVENTS.PRESENCE_UPDATED, {
                    userId,
                    name: userName,
                    status: newStatus,
                    lastSeen: new Date().toISOString(),
                    activeConversationId: selectedConversationId
                });
            }
        }
    };

    return {
        changeStatus,
        getCurrentStatus: () => statusRef.current
    };
};

export default usePresenceManager;
