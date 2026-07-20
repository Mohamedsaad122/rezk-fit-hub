import { z } from 'zod';

export const WorkflowRunSchema = z.object({
    id: z.union([z.string(), z.number()]),
    tenantId: z.union([z.string(), z.number()]),
    workflowId: z.union([z.string(), z.number()]),
    status: z.enum(['Running', 'Completed', 'Failed', 'Cancelled']).default('Running'),
    currentElementId: z.string().nullable().optional(),
    executedNodes: z.array(z.string()).default([]),
    error: z.string().nullable().optional(),
    startTime: z.string(),
    endTime: z.string().nullable().optional()
});

export const WorkflowRunListSchema = z.array(WorkflowRunSchema);

export default WorkflowRunSchema;
