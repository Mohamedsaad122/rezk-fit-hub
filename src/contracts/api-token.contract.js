import { z } from 'zod';

export const ApiTokenSchema = z.object({
    accessToken: z.string(),
    tokenType: z.string().default('Bearer'),
    expiresIn: z.number(),
    refreshToken: z.string().nullable().optional(),
    scope: z.string().nullable().optional(),
    idToken: z.string().nullable().optional()
});

export default ApiTokenSchema;
