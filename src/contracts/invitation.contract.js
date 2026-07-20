import { z } from 'zod';

export const InvitationRequestSchema = z.object({
    email: z.string().email('البريد الإلكتروني غير صحيح'),
    organizationId: z.union([z.string(), z.number()]),
    role: z.enum(['Owner', 'Administrator', 'Coach', 'Nutritionist', 'Reception', 'Trainer', 'Viewer', 'Custom Role']).default('Viewer')
});

export const InvitationResponseSchema = z.object({
    id: z.union([z.string(), z.number()]),
    tenantId: z.union([z.string(), z.number()]),
    organizationId: z.union([z.string(), z.number()]),
    email: z.string(),
    role: z.string(),
    status: z.enum(['Pending', 'Accepted', 'Declined', 'Expired']),
    sentAt: z.string(),
    token: z.string()
});

export const InvitationListResponseSchema = z.array(InvitationResponseSchema);

export default InvitationResponseSchema;
