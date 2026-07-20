import { MetricsService } from './metrics.service';
import { LoggingService } from './logging.service';

export const TelemetryService = {
    trackPageView: async (pagePath) => {
        await LoggingService.info('Developer Platform', `Page view on: ${pagePath}`, { pagePath });
        await MetricsService.recordMetric('telemetry.page.view', 1, 'count');
    },

    trackPerformance: async (name, durationMs) => {
        await MetricsService.recordMetric(`telemetry.performance.${name}`, durationMs, 'ms');
    }
};

export default TelemetryService;
