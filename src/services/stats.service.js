import { StatsRepository } from '@/repositories/stats.repository';

/**
 * Service acting as business layer between controllers and repository actions for Statistics reporting.
 */
export const StatsService = {
    getOverview: () => {
        return StatsRepository.getOverview();
    },

    getTraineeProgress: (traineeId) => {
        return StatsRepository.getTraineeProgress(traineeId);
    }
};

export default StatsService;
