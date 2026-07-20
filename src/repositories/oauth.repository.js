import AppConfig from '@/config/app.config';
import api from '@/api/axios';
import { mockDatabase } from '@/mocks/mockDatabase';
import { simulateApi } from '@/utils/mockApi.helper';
import { parseApiResponse } from '@/utils/parseApiResponse';
import { ApiTokenSchema } from '@/contracts/api-token.contract';

export const OauthRepository = {
    createAuthCode: async (clientId, code, redirectUri, codeChallenge, codeChallengeMethod) => {
        if (AppConfig.enableMock) {
            return simulateApi(() => mockDatabase.saas.oauth.createCode({
                clientId,
                code,
                redirectUri,
                codeChallenge,
                codeChallengeMethod,
                expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10m TTL
            }));
        } else {
            const res = await api.post('/api/saas/oauth/code', { clientId, code, redirectUri, codeChallenge, codeChallengeMethod });
            return res.data;
        }
    },

    getAuthCode: async (code) => {
        if (AppConfig.enableMock) {
            return simulateApi(() => mockDatabase.saas.oauth.getCode(code));
        } else {
            const res = await api.get(`/api/saas/oauth/code/${code}`);
            return res.data;
        }
    },

    createToken: async (data) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.oauth.createToken(data));
        } else {
            const res = await api.post('/api/saas/oauth/token', data);
            result = res.data;
        }
        return parseApiResponse(ApiTokenSchema, result, 'OAuth Token Exchange');
    },

    revokeToken: async (token) => {
        if (AppConfig.enableMock) {
            return simulateApi(() => mockDatabase.saas.oauth.revokeToken(token));
        } else {
            const res = await api.post('/api/saas/oauth/revoke', { token });
            return res.data.success;
        }
    }
};

export default OauthRepository;
