import { z } from 'zod';

export const WorkoutExerciseSchema = z.object({
    name: z.string(),
    sets: z.number(),
    reps: z.string(),
    restSeconds: z.number()
});

export const WorkoutRecommendationSchema = z.object({
    name: z.string(),
    exercises: z.array(WorkoutExerciseSchema),
    durationMinutes: z.number(),
    targetMuscleGroup: z.string(),
    notes: z.string()
});

export default WorkoutRecommendationSchema;
