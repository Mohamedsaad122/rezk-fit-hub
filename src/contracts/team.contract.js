import { z } from 'zod';

export const TeamRequestSchema = z.object({
    name: z.string().min(2, 'اسم الفريق يجب أن يكون حرفين على الأقل'),
    organizationId: z.union([z.string(), z.number()]),
    description: z.string().optional().default(''),
    memberIds: z.array(z.union([z.string(), z.number()])).optional().default([])
});

export const TeamResponseSchema = z.object({
    id: z.union([z.string(), z.number()]),
    tenantId: z.union([z.string(), z.number()]),
    organizationId: z.union([z.string(), z.number()]),
    name: z.string(),
    description: z.string(),
    memberIds: z.array(z.union([z.string(), z.number()])),
    createdAt: z.string()
});

export const TeamListResponseSchema = z.array(TeamResponseSchema);

export default TeamResponseSchema;
