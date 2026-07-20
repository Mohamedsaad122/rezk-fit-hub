import { SessionRepository } from '@/repositories/session.repository';

export const SessionService = {
    getSessions: async () => {
        return SessionRepository.getSessions();
    },

    createSession: async (userId, ipAddress, userAgent, location = null) => {
        const payload = {
            userId,
            ipAddress,
            userAgent,
            location: location || 'Unknown',
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        };
        return SessionRepository.createSession(payload);
    },

    revokeSession: async (sessionId) => {
        return SessionRepository.revokeSession(sessionId);
    },

    revokeAllOtherSessions: async (currentSessionId) => {
        const sessions = await SessionRepository.getSessions();
        const others = sessions.filter(s => String(s.id) !== String(currentSessionId));
        
        for (const s of others) {
            await SessionRepository.revokeSession(s.id);
        }
        return true;
    }
};

export default SessionService;
