import { z } from 'zod';

export const SmsProviderConfigSchema = z.object({
    activeProvider: z.enum(['Twilio', 'FirebaseSMS', 'Mock']),
    accountSid: z.string().optional().default(''),
    authToken: z.string().optional().default(''),
    fromNumber: z.string().optional().default('')
});

export default SmsProviderConfigSchema;
