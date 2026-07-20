import { SecurityRepository } from '@/repositories/security.repository';

// Keep track of failed attempts in-memory for fast access
const failedTracker = new Map();

export const SecurityService = {
    verifyBruteForce: async (ip) => {
        const config = await SecurityRepository.getConfig();
        const record = failedTracker.get(ip) || { count: 0, lockedUntil: null };

        if (record.lockedUntil && new Date() < new Date(record.lockedUntil)) {
            throw new Error(`IP address is locked due to brute force protection. Try again later.`);
        }

        return record;
    },

    registerFailedAttempt: async (ip) => {
        const config = await SecurityRepository.getConfig();
        const record = failedTracker.get(ip) || { count: 0, lockedUntil: null };

        record.count++;
        record.lastAttemptAt = new Date().toISOString();

        if (record.count >= config.maxFailedAttempts) {
            record.lockedUntil = new Date(Date.now() + config.lockoutDurationMinutes * 60 * 1000).toISOString();
            
            await SecurityService.logEvent(
                'POLICY_VIOLATION',
                null,
                ip,
                'Unknown',
                `Brute force lockout triggered for IP: ${ip}. Max failed attempts limit exceeded.`
            );
        }

        failedTracker.set(ip, record);
        return record;
    },

    resetFailedAttempts: async (ip) => {
        failedTracker.delete(ip);
    },

    logEvent: async (eventType, userId, ipAddress, location, details, riskScore = 0) => {
        const payload = {
            eventType,
            userId,
            ipAddress,
            location: location || 'Unknown',
            details,
            riskScore
        };
        return SecurityRepository.createLog(payload);
    },

    getLogs: async () => {
        return SecurityRepository.getLogs();
    },

    getConfig: async () => {
        return SecurityRepository.getConfig();
    },

    updateConfig: async (config) => {
        return SecurityRepository.updateConfig(config);
    }
};

export default SecurityService;
