import { z } from 'zod';

export const WorkflowNodeSchema = z.object({
    id: z.string(),
    type: z.enum(['Trigger', 'Action', 'Condition', 'Delay', 'Loop', 'Approval']),
    label: z.string(),
    parameters: z.record(z.any()).default({}),
    position: z.object({
        x: z.number(),
        y: z.number()
    }).optional()
});

export default WorkflowNodeSchema;
