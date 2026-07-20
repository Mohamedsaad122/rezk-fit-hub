import { z } from 'zod';

export const TenantSettingsRequestSchema = z.object({
    companyName: z.string().min(1, 'اسم الشركة مطلوب'),
    primaryColor: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/, 'لون أساسي غير صالح'),
    secondaryColor: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/, 'لون فرعي غير صالح'),
    logo: z.string().min(1, 'شعار الشركة مطلوب'),
    darkLogo: z.string().min(1, 'الشعار المظلم مطلوب'),
    favicon: z.string().min(1, 'أيقونة التبويب مطلوبة'),
    typography: z.string().default('Inter'),
    emailTemplate: z.string().optional(),
    reportBranding: z.boolean().default(true),
    invoiceBranding: z.boolean().default(true)
});

export const TenantSettingsResponseSchema = z.object({
    tenantId: z.union([z.string(), z.number()]),
    companyName: z.string(),
    primaryColor: z.string(),
    secondaryColor: z.string(),
    logo: z.string(),
    darkLogo: z.string(),
    favicon: z.string(),
    typography: z.string(),
    emailTemplate: z.string().nullable().optional(),
    reportBranding: z.boolean(),
    invoiceBranding: z.boolean()
});

export default TenantSettingsResponseSchema;
