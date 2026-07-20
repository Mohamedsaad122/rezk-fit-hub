import { HealthRepository } from '@/repositories/health.repository';
import { eventBus } from '@/realtime/event-bus';

export const HealthService = {
    /**
     * Get statuses for all infrastructure services.
     */
    getSystemHealth: async () => {
        return HealthRepository.getSystemHealth();
    },

    /**
     * Trigger a mock system verification check on a service.
     */
    pingService: async (serviceKey) => {
        const states = ['Healthy', 'Warning', 'Healthy', 'Healthy'];
        const randomState = states[Math.floor(Math.random() * states.length)];
        const latency = Math.floor(Math.random() * 50) + 5;
        let message = 'مستقر ومتصل بنجاح';

        if (randomState === 'Warning') {
            message = 'ارتفاع طفيف في زمن الاستجابة';
        }

        const updated = await HealthRepository.updateStatus(serviceKey, randomState, message, latency);
        eventBus.publish('HEALTH_CHANGED', { serviceKey, status: randomState, message, latencyMs: latency });
        return updated;
    }
};

export default HealthService;
