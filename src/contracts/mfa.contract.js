import { z } from 'zod';

export const MfaSetupSchema = z.object({
    secret: z.string(),
    qrCodeUrl: z.string().url(),
    recoveryCodes: z.array(z.string())
});

export const MfaVerifySchema = z.object({
    code: z.string().length(6),
    rememberDevice: z.boolean().optional().default(false)
});

export default { MfaSetupSchema, MfaVerifySchema };
