import { z } from 'zod';

export const ApiScopeSchema = z.object({
    scope: z.string(),
    description: z.string()
});

export const ApiScopeListSchema = z.array(ApiScopeSchema);

export default ApiScopeSchema;
