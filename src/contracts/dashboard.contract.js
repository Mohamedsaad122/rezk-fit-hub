import { z } from 'zod';

export const DashboardStatItemSchema = z.object({
    title: z.string(),
    value: z.string(),
    change: z.string(),
    trend: z.enum(['up', 'down']),
    iconName: z.string().optional(),
    icon: z.any().optional(), // allows passing React components in memory during mock execution
    color: z.string(),
    bgColor: z.string()
});

export const DashboardStatsResponseSchema = z.array(DashboardStatItemSchema);

export const RecentActivitySchema = z.object({
    id: z.union([z.string(), z.number()]),
    type: z.string(),
    description: z.string(),
    time: z.string(),
    iconName: z.string().optional(),
    icon: z.any().optional(), // allows passing React components
    color: z.string()
});

export const RecentActivitiesResponseSchema = z.array(RecentActivitySchema);

export const MonthlyProgressItemSchema = z.object({
    month: z.string(),
    trainees: z.number(),
    workouts: z.number(),
    nutrition: z.number()
});

export const MonthlyProgressResponseSchema = z.array(MonthlyProgressItemSchema);

export const TopTraineeItemSchema = z.object({
    id: z.union([z.string(), z.number()]).optional(),
    name: z.string(),
    progress: z.number(),
    workouts: z.number(),
    streak: z.number(),
    goal: z.string().optional()
});

export const TopTraineesResponseSchema = z.array(TopTraineeItemSchema);
