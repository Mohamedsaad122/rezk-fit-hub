import { IntegrationRepository } from '@/repositories/integration.repository';

export const IntegrationService = {
    getIntegrations: async () => {
        return IntegrationRepository.getAll();
    },

    toggleStatus: async (id, currentStatus) => {
        const nextStatus = currentStatus === 'Connected' ? 'Disconnected' : 'Connected';
        return IntegrationRepository.update(id, { status: nextStatus });
    },

    updateHealthScore: async (id, score) => {
        return IntegrationRepository.update(id, { healthScore: score });
    }
};

export default IntegrationService;
