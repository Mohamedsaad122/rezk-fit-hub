import { z } from 'zod';

export const CoachResponseSchema = z.object({
    analysis: z.string(),
    suggestions: z.array(z.string()),
    timestamp: z.string()
});

export const ClientSummaryResponseSchema = z.object({
    clientId: z.union([z.string(), z.number()]),
    summary: z.string(),
    keyOpportunities: z.array(z.string()),
    recommendedActions: z.array(z.string()),
    timestamp: z.string()
});

export const ReportSummaryResponseSchema = z.object({
    reportType: z.string(),
    findings: z.array(z.string()),
    conclusion: z.string(),
    timestamp: z.string()
});

export default CoachResponseSchema;
