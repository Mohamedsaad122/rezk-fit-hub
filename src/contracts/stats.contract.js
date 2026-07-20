import { z } from 'zod';

export const StatsOverviewItemSchema = z.object({
    key: z.string(),
    label: z.string(),
    value: z.union([z.string(), z.number()]),
    change: z.string().optional(),
    trend: z.enum(['up', 'down']).optional(),
});

export const StatsOverviewResponseSchema = z.array(StatsOverviewItemSchema);

export const TraineeProgressStatSchema = z.object({
    date: z.string(),
    weight: z.number().optional(),
    fatPercentage: z.number().optional(),
    muscleMass: z.number().optional(),
    caloriesConsumed: z.number().optional(),
    caloriesBurned: z.number().optional(),
});

export const TraineeProgressStatsResponseSchema = z.array(TraineeProgressStatSchema);
