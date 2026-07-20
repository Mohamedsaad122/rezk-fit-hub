import { z } from 'zod';

export const EncryptionKeySchema = z.object({
    id: z.union([z.string(), z.number()]),
    algorithm: z.enum(['AES-256-GCM', 'RSA-OAEP-2048']),
    purpose: z.string(),
    publicKey: z.string().optional().nullable(),
    privateKey: z.string().optional().nullable(), // Null for sym keys
    createdAt: z.string(),
    status: z.enum(['Active', 'Deprecated', 'Rotated']).default('Active')
});

export default EncryptionKeySchema;
