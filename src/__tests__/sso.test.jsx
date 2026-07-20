import { describe, it, expect, beforeEach } from 'vitest';
import AppConfig from '../config/app.config';
import { mockDatabase } from '../mocks/mockDatabase';
import { SsoService } from '../services/sso.service';

describe('SSO / SAML 2.0 / OpenID Connect Identity Test Suite', () => {
    beforeEach(() => {
        AppConfig.enableMock = true;
        mockDatabase.reset();
    });

    it('should save and retrieve federated SSO provider configurations', async () => {
        const payload = [
            {
                id: 1,
                providerType: 'SAML2',
                providerName: 'Okta',
                entryPoint: 'https://okta.com/login',
                issuer: 'https://okta.com/metadata',
                status: 'Active',
                createdAt: new Date().toISOString()
            }
        ];
        
        await SsoService.saveSettings(payload);
        const configs = await SsoService.getSettings();
        expect(configs.length).toBe(1);
        expect(configs[0].providerName).toBe('Okta');
    });

    it('should process simulated SSO login and return user profile details', async () => {
        const profile = await SsoService.authenticateViaSso('AzureAD', 'mock_jwt_assertion_token');
        expect(profile.userId).toBe(101);
        expect(profile.email).toBe('partner-sso@company.com');
        expect(profile.provider).toBe('AzureAD');
    });
});
