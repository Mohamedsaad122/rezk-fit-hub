import { AlertsRepository } from '@/repositories/alerts.repository';
import { eventBus } from '@/realtime/event-bus';

export const AlertsService = {
    getAlerts: async () => {
        return AlertsRepository.getAll();
    },

    triggerAlert: async (title, message, severity, category) => {
        const payload = {
            title,
            message,
            severity,
            status: 'Active',
            category,
            createdAt: new Date().toISOString(),
            resolvedAt: null,
            escalationLevel: 1
        };
        const alert = await AlertsRepository.create(payload);
        eventBus.publish('ALERT_TRIGGERED', alert);
        return alert;
    },

    resolveAlert: async (id) => {
        const resolved = await AlertsRepository.updateStatus(id, 'Resolved', new Date().toISOString());
        eventBus.publish('ALERT_RESOLVED', resolved);
        return resolved;
    },

    suppressAlert: async (id) => {
        return AlertsRepository.updateStatus(id, 'Suppressed');
    }
};

export default AlertsService;
