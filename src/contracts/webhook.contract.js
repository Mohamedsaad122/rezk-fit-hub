import { z } from 'zod';

export const WebhookRegistrationRequestSchema = z.object({
    url: z.string().url('رابط الويب هوك غير صالح'),
    events: z.array(z.string()).min(1, 'يجب تحديد حدث واحد على الأقل للمتابعة'),
    secret: z.string().optional()
});

export const WebhookDeliveryLogSchema = z.object({
    id: z.union([z.string(), z.number()]),
    webhookId: z.union([z.string(), z.number()]),
    event: z.string(),
    payload: z.any(),
    status: z.enum(['Success', 'Failed']),
    statusCode: z.number(),
    attempts: z.number(),
    errorMessage: z.string().nullable().optional(),
    timestamp: z.string()
});

export const WebhookEndpointSchema = z.object({
    id: z.union([z.string(), z.number()]),
    tenantId: z.union([z.string(), z.number()]),
    url: z.string(),
    events: z.array(z.string()),
    secret: z.string(),
    status: z.enum(['Active', 'Inactive', 'Failing']),
    createdAt: z.string()
});

export const WebhookEndpointListSchema = z.array(WebhookEndpointSchema);
export const WebhookDeliveryLogListSchema = z.array(WebhookDeliveryLogSchema);

export default WebhookEndpointSchema;
