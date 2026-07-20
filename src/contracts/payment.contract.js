import { z } from 'zod';

export const PaymentRequestSchema = z.object({
    invoiceId: z.union([z.string(), z.number()]),
    amount: z.number().min(1, 'المبلغ يجب أن يكون أكبر من الصفر'),
    method: z.enum(['CreditCard', 'PayPal', 'Moyasar', 'MyFatoorah', 'Paymob', 'Cash', 'BankTransfer', 'Wallet']),
    gateway: z.string().default('MockGateway'),
    gatewayToken: z.string().optional()
});

export const PaymentResponseSchema = z.object({
    id: z.union([z.string(), z.number()]),
    tenantId: z.union([z.string(), z.number()]),
    invoiceId: z.union([z.string(), z.number()]),
    amount: z.number(),
    method: z.string(),
    gateway: z.string(),
    status: z.enum(['Success', 'Failed', 'Pending']),
    gatewayToken: z.string().nullable().optional(),
    timestamp: z.string()
});

export const PaymentListResponseSchema = z.array(PaymentResponseSchema);

export default PaymentResponseSchema;
