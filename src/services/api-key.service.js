import { ApiKeyRepository } from '@/repositories/api-key.repository';

export const ApiKeyService = {
    getKeys: async () => {
        return ApiKeyRepository.getKeys();
    },

    generateKey: async (label, scopes = []) => {
        const payload = {
            value: `rfh_live_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`,
            label,
            status: 'Active',
            scopes
        };
        return ApiKeyRepository.createKey(payload);
    },

    revokeKey: async (id) => {
        return ApiKeyRepository.revokeKey(id);
    },

    validateKey: async (value) => {
        const keys = await ApiKeyRepository.getKeys();
        const activeKey = keys.find(k => k.value === value && k.status === 'Active');
        if (!activeKey) return null;
        return activeKey;
    }
};

export default ApiKeyService;
