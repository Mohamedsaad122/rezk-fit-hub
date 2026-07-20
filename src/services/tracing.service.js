import { mockDatabase } from '@/mocks/mockDatabase';
import { eventBus } from '@/realtime/event-bus';

export const TracingService = {
    getTraces: async () => {
        return mockDatabase.saas.devopsTraces.getAll();
    },

    createTraceSpan: async (name, correlationId, durationMs, status = 'Success', parentId = null, tags = {}) => {
        const traceId = 'tr-' + Math.random().toString(36).substr(2, 9);
        const payload = {
            traceId,
            parentId,
            name,
            correlationId: correlationId || 'corr-' + Math.random().toString(36).substr(2, 9),
            startTime: new Date().toISOString(),
            durationMs,
            status,
            tags
        };
        const trace = await mockDatabase.saas.devopsTraces.create(payload);
        eventBus.publish('TRACE_COMPLETED', trace);
        return trace;
    }
};

export default TracingService;
