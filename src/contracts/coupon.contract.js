import { z } from 'zod';

export const CouponRequestSchema = z.object({
    code: z.string().min(3, 'كود الخصم يجب أن يتكون من 3 أحرف على الأقل').toUpperCase(),
    type: z.enum(['Percentage', 'Fixed']),
    value: z.number().min(0, 'القيمة غير صالحة'),
    expirationDate: z.string().nullable().optional(),
    maxUses: z.number().min(1).optional().default(100),
    organizationId: z.union([z.string(), z.number()]).nullable().optional()
});

export const CouponResponseSchema = z.object({
    id: z.union([z.string(), z.number()]),
    tenantId: z.union([z.string(), z.number()]),
    code: z.string(),
    type: z.enum(['Percentage', 'Fixed']),
    value: z.number(),
    expirationDate: z.string().nullable().optional(),
    maxUses: z.number(),
    usedCount: z.number(),
    status: z.enum(['Active', 'Expired', 'MaxedOut']),
    organizationId: z.union([z.string(), z.number()]).nullable().optional()
});

export const CouponListResponseSchema = z.array(CouponResponseSchema);

export default CouponResponseSchema;
