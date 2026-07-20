import { z } from 'zod';

export const KpiMetricsSchema = z.object({
    totalClients: z.number().nonnegative(),
    activeClients: z.number().nonnegative(),
    inactiveClients: z.number().nonnegative(),
    appointments: z.number().nonnegative(),
    completedTasks: z.number().nonnegative(),
    pendingTasks: z.number().nonnegative(),
    cancelledAppointments: z.number().nonnegative(),
    workoutCompletion: z.number().min(0).max(100),
    nutritionCompliance: z.number().min(0).max(100),
    clientGrowth: z.number(),
    retentionRate: z.number().min(0).max(100),
    completionRate: z.number().min(0).max(100),
    coachProductivity: z.number().nonnegative(),
    averageProgress: z.number().min(0).max(100),
    averageBmi: z.number().nonnegative(),
    averageCalories: z.number().nonnegative()
});

export const ChartItemSchema = z.record(z.union([z.string(), z.number()]));

export const ChartsDatasetSchema = z.object({
    clientGrowth: z.array(ChartItemSchema),
    revenue: z.array(ChartItemSchema),
    taskCompletion: z.array(ChartItemSchema),
    workoutDistribution: z.array(ChartItemSchema),
    nutritionComplianceTrend: z.array(ChartItemSchema),
    attendance: z.array(ChartItemSchema)
});

export const PerformerItemSchema = z.object({
    id: z.union([z.string(), z.number()]),
    name: z.string(),
    score: z.union([z.string(), z.number()]),
    detail: z.string().optional()
});

export const TopPerformersSchema = z.object({
    topClients: z.array(PerformerItemSchema),
    topCoaches: z.array(PerformerItemSchema),
    mostActiveClients: z.array(PerformerItemSchema),
    mostCompletedTasks: z.array(PerformerItemSchema),
    bestWorkoutPrograms: z.array(PerformerItemSchema),
    bestNutritionPlans: z.array(PerformerItemSchema)
});

export const ForecastItemSchema = z.object({
    period: z.string(),
    actual: z.number().nullable(),
    forecast: z.number()
});

export const ForecastSchema = z.object({
    clientGrowth: z.array(ForecastItemSchema),
    appointments: z.array(ForecastItemSchema),
    taskCompletion: z.array(ForecastItemSchema)
});

export const AnalyticsResponseSchema = z.object({
    kpis: KpiMetricsSchema,
    kpiTrends: z.record(z.number()), // maps KPI key to % trend change
    charts: ChartsDatasetSchema,
    topPerformers: TopPerformersSchema,
    forecasts: ForecastSchema
});

export default AnalyticsResponseSchema;
