import { RateLimitRepository } from '@/repositories/rate-limit.repository';

export const RateLimitService = {
    checkAndThrottle: async (ip, limit = 60, windowMs = 60000) => {
        const status = await RateLimitRepository.checkRateLimit(ip, limit, windowMs);
        
        // Log request tracking data
        await RateLimitRepository.logRequest({
            path: '/api/gateway',
            method: 'GET',
            status: status.remaining > 0 ? 200 : 429,
            latencyMs: Math.floor(Math.random() * 20) + 5,
            clientIp: ip,
            scopes: ['read']
        });

        if (status.remaining <= 0) {
            throw new Error(`Rate limit exceeded. Try again after ${status.resetTime}`);
        }

        return status;
    },

    getApiLogs: async () => {
        return RateLimitRepository.getLogs();
    }
};

export default RateLimitService;
