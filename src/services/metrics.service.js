import { MetricsRepository } from '@/repositories/metrics.repository';
import { eventBus } from '@/realtime/event-bus';

export const MetricsService = {
    getMetrics: async () => {
        return MetricsRepository.getAll();
    },

    recordMetric: async (key, value, unit) => {
        const payload = {
            key,
            value,
            unit,
            timestamp: new Date().toISOString()
        };
        const recorded = await MetricsRepository.create(payload);
        eventBus.publish('METRIC_UPDATED', recorded);
        return recorded;
    }
};

export default MetricsService;
