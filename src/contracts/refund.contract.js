import { z } from 'zod';

export const RefundRequestSchema = z.object({
    invoiceId: z.union([z.string(), z.number()]),
    amount: z.number().min(1, 'المبلغ يجب أن يكون أكبر من الصفر'),
    reason: z.string().min(3, 'سبب الاسترجاع مطلوب')
});

export const RefundResponseSchema = z.object({
    id: z.union([z.string(), z.number()]),
    tenantId: z.union([z.string(), z.number()]),
    invoiceId: z.union([z.string(), z.number()]),
    amount: z.number(),
    reason: z.string(),
    status: z.enum(['Success', 'Failed', 'Pending']),
    timestamp: z.string()
});

export default RefundResponseSchema;
