import AppConfig from '@/config/app.config';
import { useRealtimeStore } from './connection-state';
import { eventBus } from './event-bus';

class SocketManager {
    constructor() {
        this.socket = null;
        this.pingInterval = null;
        this.reconnectTimeout = null;
        this.url = AppConfig.realtimeUrl;
        this.mode = AppConfig.realtimeMode;
    }

    /**
     * Establish real-time connection.
     */
    connect() {
        const store = useRealtimeStore.getState();
        if (store.isConnected || store.isConnecting) return;

        store.setConnecting(true);

        if (this.mode === 'disabled') {
            store.setConnecting(false);
            return;
        }

        if (this.mode === 'mock') {
            // Simulate latency and connections establish intervals
            setTimeout(() => {
                store.setConnected(true);
                store.setTransport('mock-transport');
                store.setServerVersion('4.1.0-mock');
                this.startHeartbeat();
                console.log('[SocketManager] Mock Real-time Session Established.');
            }, 500);
        } else {
            try {
                if (typeof window !== 'undefined' && window.WebSocket) {
                    // Connect using browser native WebSocket
                    const wsUrl = `${this.url.replace(/^http/, 'ws')}/socket`;
                    this.socket = new WebSocket(wsUrl);

                    this.socket.onopen = () => {
                        store.setConnected(true);
                        store.setTransport('websocket');
                        this.startHeartbeat();
                    };

                    this.socket.onclose = () => {
                        this.handleDisconnect();
                    };

                    this.socket.onerror = () => {
                        this.handleDisconnect();
                    };

                    this.socket.onmessage = (event) => {
                        try {
                            const data = JSON.parse(event.data);
                            if (data.event && data.payload) {
                                eventBus.publish(data.event, data.payload);
                            }
                        } catch (err) {
                            console.debug('JSON frame parse skipped:', err);
                        }
                    };
                } else {
                    this.handleDisconnect();
                }
            } catch (err) {
                console.error('[SocketManager] Connection failed:', err);
                this.handleDisconnect();
            }
        }
    }

    /**
     * Trigger manual disconnection.
     */
    disconnect() {
        const store = useRealtimeStore.getState();
        store.setConnected(false);
        store.setConnecting(false);

        this.stopHeartbeat();
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }

        if (this.socket) {
            try {
                this.socket.close();
            } catch (err) {
                console.debug('WS close failed:', err);
            }
            this.socket = null;
        }
        console.log('[SocketManager] Real-time session terminated.');
    }

    /**
     * Handles disconnections and runs backoff retry intervals.
     */
    handleDisconnect() {
        const store = useRealtimeStore.getState();
        store.setConnected(false);
        this.stopHeartbeat();

        if (this.mode === 'socket' && store.reconnectAttempts < 5) {
            store.incrementAttempts();
            const delay = Math.min(1000 * Math.pow(2, store.reconnectAttempts), 30000);
            console.log(`[SocketManager] Retry connection attempt #${store.reconnectAttempts} in ${delay}ms...`);
            this.reconnectTimeout = setTimeout(() => this.connect(), delay);
        }
    }

    /**
     * Heartbeat latency loops tracker.
     */
    startHeartbeat() {
        this.stopHeartbeat();
        const store = useRealtimeStore.getState();

        this.pingInterval = setInterval(() => {
            if (this.mode === 'mock') {
                const simulatedLatency = Math.floor(Math.random() * 40) + 10;
                store.setLatency(simulatedLatency);
            } else if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                const start = Date.now();
                this.socket.send(JSON.stringify({ type: 'ping' }));
                store.setLatency(Date.now() - start);
            }
        }, 5000);
    }

    /**
     * Stop heartbeat ping intervals.
     */
    stopHeartbeat() {
        if (this.pingInterval) {
            clearInterval(this.pingInterval);
            this.pingInterval = null;
        }
    }

    /**
     * Send socket events message payload to the server.
     */
    emit(event, payload) {
        if (this.mode === 'mock') {
            eventBus.publish(event, payload);
        } else if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({ event, payload }));
        }
    }
}

export const socketManager = new SocketManager();
export default socketManager;
