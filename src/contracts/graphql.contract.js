import { z } from 'zod';

export const GraphqlQuerySchema = z.object({
    query: z.string(),
    variables: z.any().optional()
});

export const GraphqlResponseSchema = z.object({
    data: z.any().nullable().optional(),
    errors: z.array(z.object({
        message: z.string(),
        locations: z.array(z.object({
            line: z.number(),
            column: z.number()
        })).optional(),
        path: z.array(z.union([z.string(), z.number()])).optional()
    })).optional()
});

export default GraphqlQuerySchema;
