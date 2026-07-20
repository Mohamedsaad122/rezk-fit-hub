import { ReleaseRepository } from '@/repositories/release.repository';
import { eventBus } from '@/realtime/event-bus';

export const ReleaseService = {
    getReleases: async () => {
        return ReleaseRepository.getAll();
    },

    deployRelease: async (version, channel, description, canaryWeight = null) => {
        const payload = {
            version,
            channel,
            status: 'Deployed',
            description,
            deployedAt: new Date().toISOString(),
            rolledBackAt: null,
            canaryWeight
        };
        const release = await ReleaseRepository.create(payload);
        eventBus.publish('RELEASE_DEPLOYED', release);
        return release;
    },

    rollbackRelease: async (id) => {
        const rolledBack = await ReleaseRepository.rollback(id);
        eventBus.publish('RELEASE_ROLLED_BACK', rolledBack);
        return rolledBack;
    }
};

export default ReleaseService;
