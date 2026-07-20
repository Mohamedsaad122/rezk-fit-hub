import { z } from 'zod';

export const AdminUserSchema = z.object({
    id: z.number().nonnegative(),
    fullName: z.string().min(1, 'الاسم الكامل مطلوب'),
    email: z.string().email('بريد إلكتروني غير صالح'),
    phone: z.string().min(1, 'رقم الهاتف مطلوب'),
    avatar: z.string().optional().nullable(),
    role: z.enum(['Super Admin', 'Admin', 'Coach', 'Nutritionist', 'Receptionist']),
    status: z.enum(['Active', 'Inactive', 'Suspended']),
    lastLogin: z.string().optional().nullable(),
    createdAt: z.string(),
    branch: z.string().min(1, 'الفرع مطلوب'),
    notes: z.string().optional().nullable()
});

export const AdminUserCreateSchema = AdminUserSchema.omit({ id: true, createdAt: true, lastLogin: true });
export const AdminUserUpdateSchema = AdminUserCreateSchema.partial();
