import { z } from 'zod';

export const TenantRequestSchema = z.object({
    name: z.string().min(2, 'الاسم يجب أن يتكون من حرفين على الأقل'),
    domain: z.string().min(3, 'النطاق مطلوب'),
    status: z.enum(['Active', 'Suspended', 'Pending']).default('Active'),
    contactEmail: z.string().email('البريد الإلكتروني غير صحيح'),
    planId: z.string().default('Starter')
});

export const TenantResponseSchema = z.object({
    id: z.union([z.string(), z.number()]),
    name: z.string(),
    domain: z.string(),
    status: z.string(),
    contactEmail: z.string(),
    planId: z.string(),
    createdAt: z.string()
});

export const TenantListResponseSchema = z.array(TenantResponseSchema);

export default TenantResponseSchema;
