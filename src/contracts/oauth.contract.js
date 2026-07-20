import { z } from 'zod';

export const OauthAuthorizeSchema = z.object({
    clientId: z.string(),
    redirectUri: z.string().url(),
    responseType: z.enum(['code', 'token']),
    scope: z.string().optional(),
    state: z.string().optional(),
    codeChallenge: z.string().optional(),
    codeChallengeMethod: z.enum(['S256', 'plain']).optional()
});

export const OauthTokenExchangeSchema = z.object({
    grantType: z.enum(['authorization_code', 'client_credentials', 'refresh_token']),
    code: z.string().optional(),
    redirectUri: z.string().url().optional(),
    clientId: z.string(),
    clientSecret: z.string().optional(),
    codeVerifier: z.string().optional(),
    refreshToken: z.string().optional()
});

export default { OauthAuthorizeSchema, OauthTokenExchangeSchema };
