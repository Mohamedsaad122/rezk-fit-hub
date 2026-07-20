import { ExerciseRepository } from '@/repositories/exercise.repository';

/**
 * Service acting as business layer between controllers and repository actions for Exercise Categories.
 */
export const ExerciseService = {
    getAllCategories: () => {
        return ExerciseRepository.getAll();
    },

    getExercisesByCategory: (categoryId) => {
        return ExerciseRepository.getByCategory(categoryId);
    },

    createExercise: (categoryId, exerciseData) => {
        return ExerciseRepository.create(categoryId, exerciseData);
    },

    updateExercise: (exerciseId, exerciseData) => {
        return ExerciseRepository.update(exerciseId, exerciseData);
    },

    deleteExercise: (exerciseId) => {
        return ExerciseRepository.delete(exerciseId);
    }
};

export default ExerciseService;
