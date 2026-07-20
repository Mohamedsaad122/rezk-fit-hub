import { z } from 'zod';

export const BillingRequestSchema = z.object({
    companyName: z.string().min(2, 'الاسم التجاري يجب أن يكون حرفين على الأقل'),
    taxId: z.string().optional().default(''),
    address: z.string().min(5, 'العنوان البريدي غير كافٍ'),
    country: z.string().default('SA'),
    email: z.string().email('البريد الإلكتروني للفوترة غير صحيح'),
    paymentMethodType: z.enum(['CreditCard', 'PayPal', 'BankTransfer', 'Stripe', 'Cash']).default('CreditCard'),
    paymentMethodDetails: z.object({
        brand: z.string().optional(),
        last4: z.string().optional(),
        expiry: z.string().optional()
    }).optional()
});

export const BillingResponseSchema = z.object({
    id: z.union([z.string(), z.number()]),
    tenantId: z.union([z.string(), z.number()]),
    companyName: z.string(),
    taxId: z.string(),
    address: z.string(),
    country: z.string(),
    email: z.string(),
    paymentMethodType: z.string(),
    paymentMethodDetails: z.any().optional(),
    updatedAt: z.string()
});

export default BillingResponseSchema;
