import { describe, it, expect, beforeEach } from 'vitest';
import AppConfig from '../config/app.config';
import { mockDatabase } from '../mocks/mockDatabase';
import { DeveloperService } from '../services/developer.service';
import { OauthService } from '../services/oauth.service';

describe('OAuth2 / OpenID Connect Simulator Test Suite', () => {
    let devApp;

    beforeEach(async () => {
        AppConfig.enableMock = true;
        mockDatabase.reset();
        
        // Register a developer app for client OAuth credentials
        devApp = await DeveloperService.registerApp(
            'Partner Client App',
            null,
            ['https://partner.com/callback']
        );
    });

    it('should generate an authorization code and enforce redirect URI matching rules', async () => {
        const code = await OauthService.generateAuthCode(
            devApp.clientId,
            'https://partner.com/callback'
        );
        expect(code).toBeDefined();
        expect(code).toContain('code_');

        // Mismatched callback URI should throw
        await expect(OauthService.generateAuthCode(devApp.clientId, 'https://hacker.com/callback'))
            .rejects.toThrow('Redirect URI mismatch');
    });

    it('should exchange code for JWT tokens and support client credentials flows', async () => {
        const code = await OauthService.generateAuthCode(
            devApp.clientId,
            'https://partner.com/callback'
        );

        const token = await OauthService.exchangeToken(
            devApp.clientId,
            code,
            'https://partner.com/callback',
            null,
            devApp.clientSecret
        );

        expect(token.accessToken).toBeDefined();
        expect(token.tokenType).toBe('Bearer');
        expect(token.expiresIn).toBe(3600);
    });

    it('should enforce PKCE code challenge verification rules during exchange', async () => {
        // Enqueue challenge S256 of "my_secret_code_verifier"
        // base64url of "my_secret_code_verifier" is calculated by mock function
        const verifier = 'my_secret_code_verifier';
        const challenge = btoa(verifier)
            .replace(/=/g, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');

        const code = await OauthService.generateAuthCode(
            devApp.clientId,
            'https://partner.com/callback',
            challenge,
            'S256'
        );

        // Exchange with correct verifier
        const token = await OauthService.exchangeToken(
            devApp.clientId,
            code,
            'https://partner.com/callback',
            verifier
        );
        expect(token.accessToken).toBeDefined();

        // Exchange with incorrect verifier should fail
        const code2 = await OauthService.generateAuthCode(
            devApp.clientId,
            'https://partner.com/callback',
            challenge,
            'S256'
        );
        await expect(OauthService.exchangeToken(devApp.clientId, code2, 'https://partner.com/callback', 'wrong_verifier'))
            .rejects.toThrow('PKCE verification failed');
    });

    it('should support token introspection and revocation lifecycle', async () => {
        const token = await OauthService.exchangeToken(
            devApp.clientId,
            null,
            null,
            null,
            devApp.clientSecret
        );

        const intro = await OauthService.introspect(token.accessToken);
        expect(intro.active).toBe(true);

        const revoked = await OauthService.revoke(token.accessToken);
        expect(revoked).toBe(true);
    });
});
