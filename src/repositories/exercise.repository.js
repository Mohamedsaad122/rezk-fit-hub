import { API_ENDPOINTS } from '@/constants/api.constants';
import api from '@/api/axios';
import AppConfig from '@/config/app.config';
import { mockDatabase } from '@/mocks/mockDatabase';
import { simulateApi } from '@/utils/mockApi.helper';
import { parseApiResponse } from '@/utils/parseApiResponse';
import { ExerciseCategoriesResponseSchema, ExerciseResponseSchema } from '@/contracts/exercise.contract';
import { z } from 'zod';

/**
 * Standardized Exercise Repository.
 * Handles categorization structure and workout CRUD commands.
 */
export const ExerciseRepository = {
    getAll: async (options = {}) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.exercises.getAllCategories());
        } else {
            const response = await api.get(API_ENDPOINTS.EXERCISES.BASE, { params: options });
            result = response.data;
        }

        return parseApiResponse(ExerciseCategoriesResponseSchema, result, 'Exercise Categories');
    },

    getByCategory: async (categoryId, options = {}) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.exercises.getExercisesByCategory(categoryId));
        } else {
            const response = await api.get(API_ENDPOINTS.EXERCISES.CATEGORY(categoryId), { params: options });
            result = response.data;
        }

        return parseApiResponse(z.array(ExerciseResponseSchema), result, 'Exercises By Category');
    },

    create: async (categoryId, exerciseData) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.exercises.createExercise(categoryId, exerciseData));
        } else {
            const response = await api.post(API_ENDPOINTS.EXERCISES.BASE, { categoryId, ...exerciseData });
            result = response.data;
        }

        return parseApiResponse(ExerciseResponseSchema, result, 'Exercise Create');
    },

    update: async (exerciseId, exerciseData) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.exercises.updateExercise(exerciseId, exerciseData));
        } else {
            const response = await api.put(API_ENDPOINTS.EXERCISES.DETAIL(exerciseId), exerciseData);
            result = response.data;
        }

        return parseApiResponse(ExerciseResponseSchema, result, 'Exercise Update');
    },

    delete: async (exerciseId) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => mockDatabase.exercises.deleteExercise(exerciseId));
        } else {
            await api.delete(API_ENDPOINTS.EXERCISES.DETAIL(exerciseId));
            result = true;
        }

        return !!result;
    }
};

export default ExerciseRepository;
