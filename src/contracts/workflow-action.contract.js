import { z } from 'zod';

export const WorkflowActionSchema = z.object({
    id: z.string(),
    type: z.string(), // e.g. "SendNotification", "AssignWorkout"
    params: z.record(z.any()).default({}),
    retryCount: z.number().default(0),
    timeoutSeconds: z.number().default(30)
});

export default WorkflowActionSchema;
