import AppConfig from '@/config/app.config';
import api from '@/api/axios';
import { mockDatabase } from '@/mocks/mockDatabase';
import { simulateApi } from '@/utils/mockApi.helper';
import { parseApiResponse } from '@/utils/parseApiResponse';
import { VaultSecretListSchema } from '@/contracts/secret.contract';

export const SecretRepository = {
    getSecrets: async () => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.saas.secretsVault.getAll());
        } else {
            const res = await api.get('/api/saas/security/secrets');
            result = res.data;
        }
        return parseApiResponse(VaultSecretListSchema, result, 'Secrets Vault List');
    },

    createSecret: async (data) => {
        if (AppConfig.enableMock) {
            return simulateApi(() => mockDatabase.saas.secretsVault.create(data));
        } else {
            const res = await api.post('/api/saas/security/secrets', data);
            return res.data;
        }
    },

    rotateSecret: async (id, newValue) => {
        if (AppConfig.enableMock) {
            return simulateApi(() => mockDatabase.saas.secretsVault.rotate(id, newValue));
        } else {
            const res = await api.post(`/api/saas/security/secrets/${id}/rotate`, { newValue });
            return res.data;
        }
    }
};

export default SecretRepository;
