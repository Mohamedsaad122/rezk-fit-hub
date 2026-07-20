import { z } from 'zod';

export const OrganizationSettingsSchema = z.object({
    timezone: z.string().default('Asia/Riyadh'),
    currency: z.string().default('SAR'),
    logoUrl: z.string().nullable().optional().default(null),
    primaryColor: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/, 'لون أساسي غير صالح').default('#0ea5e9')
});

export const OrganizationRequestSchema = z.object({
    name: z.string().min(2, 'اسم المنظمة يجب أن يكون حرفين على الأقل'),
    status: z.enum(['Active', 'Suspended']).default('Active'),
    settings: OrganizationSettingsSchema.optional()
});

export const OrganizationResponseSchema = z.object({
    id: z.union([z.string(), z.number()]),
    tenantId: z.union([z.string(), z.number()]),
    name: z.string(),
    status: z.string(),
    settings: OrganizationSettingsSchema,
    createdAt: z.string()
});

export const OrganizationListResponseSchema = z.array(OrganizationResponseSchema);

export default OrganizationResponseSchema;
