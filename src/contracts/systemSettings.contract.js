import { z } from 'zod';

export const GeneralSettingsSchema = z.object({
    siteName: z.string().min(1, 'اسم الموقع مطلوب'),
    supportEmail: z.string().email('البريد الإلكتروني غير صالح'),
    contactPhone: z.string().min(1, 'رقم التواصل مطلوب')
});

export const SecuritySettingsSchema = z.object({
    passwordExpiryDays: z.number().min(0),
    enableTwoFactor: z.boolean(),
    sessionTimeoutMinutes: z.number().min(1)
});

export const NotificationSettingsSchema = z.object({
    emailAlerts: z.boolean(),
    smsAlerts: z.boolean(),
    pushAlerts: z.boolean()
});

export const AppearanceSettingsSchema = z.object({
    theme: z.enum(['light', 'dark', 'system']),
    primaryColor: z.string().min(1),
    sidebarCollapsed: z.boolean()
});

export const LocalizationSettingsSchema = z.object({
    defaultLanguage: z.enum(['ar', 'en']),
    timezone: z.string().min(1),
    dateFormat: z.string().min(1)
});

export const SystemSettingsSchema = z.object({
    general: GeneralSettingsSchema,
    security: SecuritySettingsSchema,
    notifications: NotificationSettingsSchema,
    appearance: AppearanceSettingsSchema,
    localization: LocalizationSettingsSchema
});
