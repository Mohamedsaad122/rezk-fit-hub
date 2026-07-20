export const RiskEngineService = {
    calculateRisk: (currentSession, previousSessions = []) => {
        let score = 10; // Base score
        const triggers = [];

        if (previousSessions.length === 0) {
            score += 15;
            triggers.push('First login from new device/location');
            return { score, triggers };
        }

        const last = previousSessions[previousSessions.length - 1];

        // 1. Browser/OS mismatch
        if (currentSession.userAgent !== last.userAgent) {
            score += 20;
            triggers.push('Device fingerprint mismatch');
        }

        // 2. Location/IP change
        if (currentSession.ipAddress !== last.ipAddress) {
            score += 15;
            triggers.push('New IP address connection');
        }

        // 3. Impossible Travel Check (different locations within 1 hour)
        if (currentSession.location && last.location && currentSession.location !== last.location) {
            const timeDiffMs = Math.abs(new Date(currentSession.createdAt) - new Date(last.createdAt));
            const hours = timeDiffMs / (1000 * 60 * 60);
            
            if (hours < 3) {
                score += 55;
                triggers.push(`Impossible travel detected: Account accessed from "${last.location}" and "${currentSession.location}" within ${Math.round(hours * 10) / 10} hours.`);
            }
        }

        return {
            score: Math.min(100, score),
            triggers,
            isSuspicious: score >= 50
        };
    }
};

export default RiskEngineService;
