import { z } from 'zod';

export const TransactionResponseSchema = z.object({
    id: z.union([z.string(), z.number()]),
    tenantId: z.union([z.string(), z.number()]),
    organizationId: z.union([z.string(), z.number()]).nullable().optional(),
    amount: z.number(),
    type: z.enum(['Credit', 'Debit']), // Credit: revenue in, Debit: refund/expense out
    method: z.string(),
    gateway: z.string(),
    status: z.enum(['Success', 'Failed', 'Pending']),
    referenceToken: z.string().optional(),
    timestamp: z.string()
});

export const TransactionListResponseSchema = z.array(TransactionResponseSchema);

export default TransactionResponseSchema;
