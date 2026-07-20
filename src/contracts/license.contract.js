import { z } from 'zod';

export const LicenseRequestSchema = z.object({
    tenantId: z.union([z.string(), z.number()]),
    licenseKey: z.string().min(10, 'مفتاح الترخيص غير صالح'),
    status: z.enum(['Active', 'Expired', 'Revoked']).default('Active'),
    issuedAt: z.string(),
    expiresAt: z.string(),
    seatsCount: z.number().min(1),
    deviceCount: z.number().min(1),
    offlineData: z.string().optional()
});

export const LicenseResponseSchema = z.object({
    id: z.union([z.string(), z.number()]),
    tenantId: z.union([z.string(), z.number()]),
    licenseKey: z.string(),
    status: z.string(),
    issuedAt: z.string(),
    expiresAt: z.string(),
    seatsCount: z.number(),
    deviceCount: z.number(),
    offlineData: z.string().nullable().optional()
});

export const LicenseListResponseSchema = z.array(LicenseResponseSchema);

export default LicenseResponseSchema;
