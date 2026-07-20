import { z } from 'zod';

export const WorkflowTriggerSchema = z.object({
    id: z.string(),
    type: z.string(), // e.g. "ClientCreated", "WorkoutAssigned", "CronSchedule"
    config: z.record(z.any()).default({}),
    description: z.string().optional()
});

export default WorkflowTriggerSchema;
