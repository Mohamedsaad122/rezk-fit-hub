import { z } from 'zod';

export const DeviceSchema = z.object({
    id: z.union([z.string(), z.number()]),
    tenantId: z.union([z.string(), z.number()]),
    name: z.string(),
    os: z.string(),
    status: z.string().default('Active'),
    createdAt: z.string().optional(),
    lastActiveAt: z.string().optional()
});

export const DeviceListSchema = z.array(DeviceSchema);

export const TrustedDeviceSchema = z.object({
    id: z.union([z.string(), z.number()]),
    tenantId: z.union([z.string(), z.number()]),
    userId: z.union([z.string(), z.number()]),
    fingerprint: z.string(),
    name: z.string(),
    os: z.string(),
    browser: z.string(),
    trustedAt: z.string(),
    rememberUntil: z.string()
});

export const TrustedDeviceListSchema = z.array(TrustedDeviceSchema);

export default TrustedDeviceSchema;
