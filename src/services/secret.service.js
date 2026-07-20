import { SecretRepository } from '@/repositories/secret.repository';

export const SecretService = {
    getSecrets: async () => {
        return SecretRepository.getSecrets();
    },

    createSecret: async (key, value, environment = 'Production') => {
        const payload = {
            key,
            value,
            environment
        };
        return SecretRepository.createSecret(payload);
    },

    rotateSecret: async (id, newValue) => {
        return SecretRepository.rotateSecret(id, newValue);
    }
};

export default SecretService;
