import { z } from 'zod';

export const ApprovalRequestSchema = z.object({
    id: z.union([z.string(), z.number()]),
    tenantId: z.union([z.string(), z.number()]),
    workflowRunId: z.union([z.string(), z.number()]).optional().nullable(),
    title: z.string(),
    description: z.string().optional().nullable(),
    status: z.enum(['Pending', 'Approved', 'Rejected', 'Escalated']).default('Pending'),
    currentLevel: z.number().default(1),
    maxLevels: z.number().default(1),
    approvers: z.array(z.string()).default([]), // Roles or emails
    responses: z.array(z.object({
        level: z.number(),
        approver: z.string(),
        decision: z.enum(['Approved', 'Rejected']),
        comment: z.string().optional(),
        timestamp: z.string()
    })).default([]),
    parallel: z.boolean().optional(),
    timeoutHours: z.number().optional(),
    escalatedAt: z.string().optional(),
    createdAt: z.string(),
    updatedAt: z.string()
});

export const ApprovalRequestListSchema = z.array(ApprovalRequestSchema);

export default ApprovalRequestSchema;
