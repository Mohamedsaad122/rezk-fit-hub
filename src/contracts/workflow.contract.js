import { z } from 'zod';

export const WorkflowSchema = z.object({
    id: z.union([z.string(), z.number()]),
    tenantId: z.union([z.string(), z.number()]),
    name: z.string(),
    description: z.string().optional().nullable(),
    triggerType: z.string(),
    status: z.enum(['Draft', 'Active', 'Disabled']).default('Draft'),
    nodes: z.array(z.any()).default([]),
    edges: z.array(z.any()).default([]),
    version: z.number().default(1),
    createdAt: z.string(),
    updatedAt: z.string()
});

export const WorkflowListSchema = z.array(WorkflowSchema);

export default WorkflowSchema;
