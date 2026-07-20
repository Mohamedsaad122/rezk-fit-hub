import { DeveloperRepository } from '@/repositories/developer.repository';

export const DeveloperService = {
    getApps: async () => {
        return DeveloperRepository.getApps();
    },

    registerApp: async (name, logo, redirectUris) => {
        const payload = {
            name,
            logo: logo || null,
            clientId: `client_${Math.random().toString(36).substring(2, 10)}`,
            clientSecret: `secret_${Math.random().toString(36).substring(2, 15)}`,
            redirectUris: redirectUris || [],
            status: 'Active'
        };
        return DeveloperRepository.createApp(payload);
    },

    deleteApp: async (id) => {
        return DeveloperRepository.deleteApp(id);
    }
};

export default DeveloperService;
