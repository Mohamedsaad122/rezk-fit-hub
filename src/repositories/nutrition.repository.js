import { API_ENDPOINTS } from '@/constants/api.constants';
import api from '@/api/axios';
import AppConfig from '@/config/app.config';
import { mockDatabase } from '@/mocks/mockDatabase';
import { simulateApi } from '@/utils/mockApi.helper';
import { parseApiResponse } from '@/utils/parseApiResponse';
import { NutritionPlansResponseSchema, NutritionPlanResponseSchema } from '@/contracts/nutrition.contract';
import { createPaginatedResponseSchema } from '@/contracts/pagination.contract';

/**
 * Standardized Nutrition Diet Plan Repository.
 * Handles menu structures, macro targets, and meal plans CRUD requests.
 */
export const NutritionRepository = {
    getAll: async (options = {}) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => {
                const allPlans = mockDatabase.nutrition.getAllPlans();
                
                // Return paginated payload if options are passed
                if (options.page || options.limit || options.search || options.status) {
                    const page = Number(options.page || 1);
                    const limit = Number(options.limit || 10);
                    let filtered = [...allPlans];
                    
                    if (options.search) {
                        const term = options.search.toLowerCase();
                        filtered = filtered.filter(p => 
                            p.name.toLowerCase().includes(term) ||
                            p.description.toLowerCase().includes(term)
                        );
                    }
                    if (options.status) {
                        filtered = filtered.filter(p => p.status === options.status);
                    }
                    
                    const total = filtered.length;
                    const totalPages = Math.ceil(total / limit);
                    const start = (page - 1) * limit;
                    const sliced = filtered.slice(start, start + limit);
                    
                    return {
                        data: sliced,
                        meta: { page, limit, total, totalPages }
                    };
                }
                
                return allPlans;
            });
        } else {
            const response = await api.get(API_ENDPOINTS.NUTRITION.BASE, { params: options });
            result = response.data;
        }

        // Dynamically validate based on return structure (backward-compatible)
        if (result && result.data && result.meta) {
            const PaginatedNutritionSchema = createPaginatedResponseSchema(NutritionPlanResponseSchema);
            return parseApiResponse(PaginatedNutritionSchema, result, 'Nutrition Paginated List');
        }
        return parseApiResponse(NutritionPlansResponseSchema, result, 'Nutrition Plans List');
    },

    getById: async (planId) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.nutrition.getById(planId));
        } else {
            const response = await api.get(API_ENDPOINTS.NUTRITION.DETAIL(planId));
            result = response.data;
        }

        if (result === null) return null;
        return parseApiResponse(NutritionPlanResponseSchema, result, 'Nutrition Plan Details');
    },

    create: async (planData) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.nutrition.createPlan(planData));
        } else {
            const response = await api.post(API_ENDPOINTS.NUTRITION.BASE, planData);
            result = response.data;
        }

        return parseApiResponse(NutritionPlanResponseSchema, result, 'Nutrition Plan Create');
    },

    update: async (planId, planData) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.nutrition.updatePlan(planId, planData));
        } else {
            const response = await api.put(API_ENDPOINTS.NUTRITION.DETAIL(planId), planData);
            result = response.data;
        }

        return parseApiResponse(NutritionPlanResponseSchema, result, 'Nutrition Plan Update');
    },

    delete: async (planId) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.nutrition.deletePlan(planId));
        } else {
            await api.delete(API_ENDPOINTS.NUTRITION.DETAIL(planId));
            result = true;
        }

        return !!result;
    }
};

export default NutritionRepository;
