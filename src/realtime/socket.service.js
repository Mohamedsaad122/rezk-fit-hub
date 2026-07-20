import { socketManager } from './socket-manager';
import { eventBus } from './event-bus';

export const SocketService = {
    /**
     * Start the real-time manager listener.
     */
    connect: () => {
        socketManager.connect();
    },

    /**
     * Terminate the connection.
     */
    disconnect: () => {
        socketManager.disconnect();
    },

    /**
     * Send event payload to backend.
     */
    emit: (event, payload) => {
        socketManager.emit(event, payload);
    },

    /**
     * Subscribe to realtime business events.
     */
    subscribe: (event, callback) => {
        return eventBus.subscribe(event, callback);
    },

    /**
     * Unsubscribe from events.
     */
    unsubscribe: (event, callback) => {
        eventBus.unsubscribe(event, callback);
    }
};

export default SocketService;
