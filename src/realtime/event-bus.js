/**
 * Decoupled Application-wide Pub/Sub Event Bus.
 * Allows modules to publish and subscribe to real-time events without directly importing Sockets.
 */
class EventBus {
    constructor() {
        this.listeners = {};
    }

    /**
     * Subscribe to a specific real-time event.
     * @param {string} event - Event name from SOCKET_EVENTS.
     * @param {Function} callback - Execution callback.
     * @returns {Function} Unsubscribe trigger function.
     */
    subscribe(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);

        // Return unsubscribe helper function for React hooks cleaning
        return () => this.unsubscribe(event, callback);
    }

    /**
     * Unsubscribe a callback from an event.
     * @param {string} event - Event name.
     * @param {Function} callback - Callback function.
     */
    unsubscribe(event, callback) {
        if (!this.listeners[event]) return;
        this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }

    /**
     * Publish an event with a custom payload.
     * @param {string} event - Event name.
     * @param {any} payload - The message payload.
     */
    publish(event, payload) {
        if (!this.listeners[event]) return;
        this.listeners[event].forEach(callback => {
            try {
                callback(payload);
            } catch (err) {
                console.error(`[EventBus] Error in callback for event ${event}:`, err);
            }
        });
    }

    /**
     * Retrieves lists of active subscriptions for diagnostic purposes.
     * @returns {Object} Active listeners count by channel.
     */
    getDiagnostics() {
        const stats = {};
        Object.keys(this.listeners).forEach(key => {
            stats[key] = this.listeners[key].length;
        });
        return stats;
    }
}

export const eventBus = new EventBus();
export default eventBus;
