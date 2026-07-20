import { z } from 'zod';

export const InvoiceItemSchema = z.object({
    description: z.string(),
    quantity: z.number().min(1),
    unitPrice: z.number().min(0),
    amount: z.number().min(0)
});

export const InvoiceResponseSchema = z.object({
    id: z.union([z.string(), z.number()]),
    tenantId: z.union([z.string(), z.number()]),
    organizationId: z.union([z.string(), z.number()]).nullable().optional(),
    invoiceNumber: z.string(),
    billingPeriod: z.string().optional().default(''),
    issueDate: z.string(),
    dueDate: z.string(),
    subtotal: z.number(),
    discount: z.number().default(0),
    tax: z.number().default(0),
    total: z.number(),
    currency: z.string().default('SAR'),
    status: z.enum(['Pending', 'Paid', 'Failed', 'Overdue', 'Cancelled']),
    items: z.array(InvoiceItemSchema),
    paymentHistory: z.array(z.object({
        paymentId: z.union([z.string(), z.number()]),
        amount: z.number(),
        status: z.string(),
        timestamp: z.string()
    })).optional().default([])
});

export const InvoiceListResponseSchema = z.array(InvoiceResponseSchema);

export default InvoiceResponseSchema;
