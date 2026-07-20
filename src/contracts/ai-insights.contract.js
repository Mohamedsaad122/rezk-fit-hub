import { z } from 'zod';

export const RiskAssessmentSchema = z.object({
    clientId: z.union([z.string(), z.number()]),
    clientName: z.string().optional(),
    riskScore: z.number().min(0).max(100),
    riskLevel: z.enum(['Low', 'Medium', 'High', 'Critical']),
    indicators: z.array(z.string()),
    mitigationStrategy: z.string()
});

export const PredictiveInsightSchema = z.object({
    id: z.union([z.string(), z.number()]),
    tenantId: z.union([z.string(), z.number()]),
    type: z.enum(['Attendance', 'Risk', 'Nutrition', 'Workout', 'General']),
    title: z.string(),
    content: z.string(),
    score: z.number().optional(),
    recommendedActions: z.array(z.string()),
    timestamp: z.string()
});

export const PredictiveInsightListSchema = z.array(PredictiveInsightSchema);

export default PredictiveInsightSchema;
