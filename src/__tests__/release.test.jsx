import { describe, it, expect, beforeEach } from 'vitest';
import AppConfig from '../config/app.config';
import { mockDatabase } from '../mocks/mockDatabase';
import { ReleaseService } from '../services/release.service';

describe('DevOps Release Manager Test Suite', () => {
    beforeEach(() => {
        AppConfig.enableMock = true;
        mockDatabase.reset();
    });

    it('should register releases and calculate Canary weight distributions', async () => {
        const release = await ReleaseService.deployRelease('1.4.0', 'Canary', 'Test Release', 25);
        expect(release.id).toBeDefined();
        expect(release.version).toBe('1.4.0');
        expect(release.canaryWeight).toBe(25);
    });

    it('should trigger release rollbacks', async () => {
        const release = await ReleaseService.deployRelease('1.5.0', 'Production', 'Production release');
        const rolledBack = await ReleaseService.rollbackRelease(release.id);
        expect(rolledBack.status).toBe('RolledBack');
        expect(rolledBack.rolledBackAt).toBeDefined();
    });
});
