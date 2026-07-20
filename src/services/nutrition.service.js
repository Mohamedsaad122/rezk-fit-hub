import { NutritionRepository } from '@/repositories/nutrition.repository';

/**
 * Service acting as business layer between controllers and repository actions for Nutrition Plans.
 */
export const NutritionService = {
    getAllPlans: (options = {}) => {
        return NutritionRepository.getAll(options);
    },

    getPlanById: (planId) => {
        return NutritionRepository.getById(planId);
    },

    createPlan: (planData) => {
        return NutritionRepository.create(planData);
    },

    updatePlan: (planId, planData) => {
        return NutritionRepository.update(planId, planData);
    },

    deletePlan: (planId) => {
        return NutritionRepository.delete(planId);
    }
};

export default NutritionService;
