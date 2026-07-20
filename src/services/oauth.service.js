import { OauthRepository } from '@/repositories/oauth.repository';
import { DeveloperRepository } from '@/repositories/developer.repository';

// Simple base64url SHA256 mock helper for PKCE verifications
const mockSha256 = (str) => {
    return btoa(str)
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
};

export const OauthService = {
    generateAuthCode: async (clientId, redirectUri, codeChallenge = null, codeChallengeMethod = null) => {
        const apps = await DeveloperRepository.getApps();
        const app = apps.find(a => a.clientId === clientId);
        if (!app) {
            throw new Error('Client not found');
        }

        // Verify redirect URI is allowed
        if (app.redirectUris.length > 0 && !app.redirectUris.includes(redirectUri)) {
            throw new Error('Redirect URI mismatch');
        }

        const code = `code_${Math.random().toString(36).substring(2, 10)}`;
        await OauthRepository.createAuthCode(clientId, code, redirectUri, codeChallenge, codeChallengeMethod);
        return code;
    },

    exchangeToken: async (clientId, code, redirectUri, codeVerifier = null, clientSecret = null) => {
        const apps = await DeveloperRepository.getApps();
        const app = apps.find(a => a.clientId === clientId);
        if (!app) {
            throw new Error('Client not found');
        }

        // 1. Authorization Code Flow
        if (code) {
            const authRecord = await OauthRepository.getAuthCode(code);
            if (!authRecord) {
                throw new Error('Invalid or expired auth code');
            }
            if (authRecord.clientId !== clientId) {
                throw new Error('Client mismatch');
            }

            // PKCE check
            if (authRecord.codeChallenge) {
                if (!codeVerifier) {
                    throw new Error('Code verifier required for PKCE');
                }
                const calculatedChallenge = authRecord.codeChallengeMethod === 'S256' 
                    ? mockSha256(codeVerifier) 
                    : codeVerifier;
                
                if (calculatedChallenge !== authRecord.codeChallenge) {
                    throw new Error('PKCE verification failed');
                }
            } else if (app.clientSecret !== clientSecret) {
                // Regular code flow: client secret verification
                throw new Error('Invalid client secret');
            }

            return OauthRepository.createToken({ clientId, scope: 'read write' });
        }

        // 2. Client Credentials Flow
        if (clientSecret) {
            if (app.clientSecret !== clientSecret) {
                throw new Error('Invalid client credentials');
            }
            return OauthRepository.createToken({ clientId, scope: 'read write' });
        }

        throw new Error('Invalid grant parameters');
    },

    introspect: async (token) => {
        // Introspect simulated token details
        if (token.startsWith('at_')) {
            return {
                active: true,
                scope: 'read write',
                clientId: 'client_1',
                exp: Math.floor(Date.now() / 1000) + 3600
            };
        }
        return { active: false };
    },

    revoke: async (token) => {
        return OauthRepository.revokeToken(token);
    }
};

export default OauthService;
