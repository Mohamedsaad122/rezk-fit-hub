import { describe, it, expect, beforeEach } from 'vitest';
import AppConfig from '../config/app.config';
import { mockDatabase } from '../mocks/mockDatabase';
import { SessionService } from '../services/session.service';

describe('Active Session & Device Revocation Test Suite', () => {
    beforeEach(() => {
        AppConfig.enableMock = true;
        mockDatabase.reset();
    });

    it('should query active sessions and terminate remote sessions by id', async () => {
        const s1 = await SessionService.createSession(1, '192.168.1.1', 'Chrome/Windows');
        const s2 = await SessionService.createSession(1, '192.168.1.2', 'Safari/iOS');

        const active = await SessionService.getSessions();
        expect(active.length).toBe(2);

        // Revoke first session
        await SessionService.revokeSession(s1.id);
        const remaining = await SessionService.getSessions();
        expect(remaining.length).toBe(1);
        expect(remaining[0].id).toBe(s2.id);
    });

    it('should support logging out from all other devices simultaneously', async () => {
        const s1 = await SessionService.createSession(1, '192.168.1.1', 'Chrome/Windows');
        const s2 = await SessionService.createSession(1, '192.168.1.2', 'Safari/iOS');
        const s3 = await SessionService.createSession(1, '192.168.1.3', 'Firefox/Linux');

        // Keep s2 as current and logout others
        await SessionService.revokeAllOtherSessions(s2.id);

        const active = await SessionService.getSessions();
        expect(active.length).toBe(1);
        expect(active[0].id).toBe(s2.id);
    });
});
