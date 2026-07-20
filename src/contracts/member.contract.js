import { z } from 'zod';

export const MemberRequestSchema = z.object({
    email: z.string().email('البريد الإلكتروني غير صحيح'),
    name: z.string().min(2, 'الاسم يجب أن يتكون من حرفين على الأقل'),
    organizationId: z.union([z.string(), z.number()]),
    role: z.enum(['Owner', 'Administrator', 'Coach', 'Nutritionist', 'Reception', 'Trainer', 'Viewer', 'Custom Role']),
    status: z.enum(['Active', 'Suspended']).default('Active'),
    teamIds: z.array(z.union([z.string(), z.number()])).optional().default([])
});

export const MemberResponseSchema = z.object({
    id: z.union([z.string(), z.number()]),
    tenantId: z.union([z.string(), z.number()]),
    organizationId: z.union([z.string(), z.number()]),
    email: z.string(),
    name: z.string(),
    role: z.string(),
    status: z.string(),
    joinedAt: z.string(),
    teamIds: z.array(z.union([z.string(), z.number()]))
});

export const MemberListResponseSchema = z.array(MemberResponseSchema);

export default MemberResponseSchema;
