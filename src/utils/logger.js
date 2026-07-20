import AppConfig from '../config/app.config';

const LOG_LEVELS = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
};

const getLogLevelValue = (level) => {
    return LOG_LEVELS[String(level).toLowerCase()] ?? 1; // default to info (1)
};

/**
 * Standardized logging service that filters logs based on environment configurations.
 */
export const logger = {
    debug: (message, ...args) => {
        const currentLevel = getLogLevelValue(AppConfig.logLevel);
        if (currentLevel <= LOG_LEVELS.debug) {
            console.debug(`[DEBUG] ${message}`, ...args);
        }
    },
    info: (message, ...args) => {
        const currentLevel = getLogLevelValue(AppConfig.logLevel);
        if (currentLevel <= LOG_LEVELS.info) {
            console.info(`[INFO] ${message}`, ...args);
        }
    },
    warn: (message, ...args) => {
        const currentLevel = getLogLevelValue(AppConfig.logLevel);
        if (currentLevel <= LOG_LEVELS.warn) {
            console.warn(`[WARN] ${message}`, ...args);
        }
    },
    error: (message, ...args) => {
        const currentLevel = getLogLevelValue(AppConfig.logLevel);
        if (currentLevel <= LOG_LEVELS.error) {
            console.error(`[ERROR] ${message}`, ...args);
        }
    }
};

export default logger;
