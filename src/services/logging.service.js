import { LogsRepository } from '@/repositories/logs.repository';

export const LoggingService = {
    getLogs: async () => {
        return LogsRepository.getAll();
    },

    log: async (level, category, message, context = {}) => {
        const payload = {
            timestamp: new Date().toISOString(),
            level,
            category,
            message,
            context
        };
        return LogsRepository.create(payload);
    },

    trace: (category, message, context) => LoggingService.log('Trace', category, message, context),
    debug: (category, message, context) => LoggingService.log('Debug', category, message, context),
    info: (category, message, context) => LoggingService.log('Info', category, message, context),
    warn: (category, message, context) => LoggingService.log('Warning', category, message, context),
    error: (category, message, context) => LoggingService.log('Error', category, message, context),
    critical: (category, message, context) => LoggingService.log('Critical', category, message, context)
};

export default LoggingService;
