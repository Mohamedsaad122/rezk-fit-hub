import { z } from 'zod';

export const EmailProviderConfigSchema = z.object({
    activeProvider: z.enum(['SMTP', 'SendGrid', 'Mailgun', 'Mock']),
    host: z.string().optional().default(''),
    port: z.number().optional().default(587),
    username: z.string().optional().default(''),
    password: z.string().optional().default(''),
    apiKey: z.string().optional().default('')
});

export default EmailProviderConfigSchema;
