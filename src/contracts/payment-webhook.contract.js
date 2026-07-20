import { z } from 'zod';

export const PaymentWebhookPayloadSchema = z.object({
    id: z.string(),
    type: z.string(),
    data: z.object({
        object: z.record(z.any())
    }),
    livemode: z.boolean().optional()
});

export default PaymentWebhookPayloadSchema;
