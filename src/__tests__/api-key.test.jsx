import { describe, it, expect, beforeEach } from 'vitest';
import AppConfig from '../config/app.config';
import { mockDatabase } from '../mocks/mockDatabase';
import { ApiKeyService } from '../services/api-key.service';

describe('Developer API Key Service Test Suite', () => {
    beforeEach(() => {
        AppConfig.enableMock = true;
        mockDatabase.reset();
    });

    it('should generate a new API key with specific scopes', async () => {
        const key = await ApiKeyService.generateKey('Test key', ['clients:read', 'tasks:write']);
        expect(key.value).toBeDefined();
        expect(key.value).toContain('rfh_live_');
        expect(key.label).toBe('Test key');
        expect(key.scopes).toEqual(['clients:read', 'tasks:write']);
        expect(key.status).toBe('Active');
    });

    it('should retrieve registered active keys and support key validation', async () => {
        const key = await ApiKeyService.generateKey('Production integration', ['read']);
        
        const validResult = await ApiKeyService.validateKey(key.value);
        expect(validResult).toBeDefined();
        expect(validResult.label).toBe('Production integration');

        const invalidResult = await ApiKeyService.validateKey('rfh_live_wrong_value');
        expect(invalidResult).toBeNull();
    });

    it('should revoke a key and invalidate subsequent validation checks', async () => {
        const key = await ApiKeyService.generateKey('Temporary key', ['read']);
        
        const revoked = await ApiKeyService.revokeKey(key.id);
        expect(revoked.status).toBe('Revoked');

        const validation = await ApiKeyService.validateKey(key.value);
        expect(validation).toBeNull();
    });
});
