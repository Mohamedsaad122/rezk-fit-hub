import { z } from 'zod';

export const LoginRequestSchema = z.object({
    email: z.string().min(1, 'البريد الإلكتروني مطلوب').email('صيغة البريد الإلكتروني غير صحيحة'),
    password: z.string().min(6, 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل'),
});

export const ForgotPasswordRequestSchema = z.object({
    email: z.string().min(1, 'البريد الإلكتروني مطلوب').email('صيغة البريد الإلكتروني غير صحيحة'),
});

export const VerifyCodeRequestSchema = z.object({
    code: z.string().min(4, 'يجب أن يتكون الرمز من 4 خانات على الأقل').max(6, 'الرمز طويل جداً'),
});

export const ResetPasswordRequestSchema = z.object({
    password: z.string().min(6, 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل'),
    confirmPassword: z.string().min(6, 'تأكيد كلمة المرور مطلوب'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'كلمات المرور غير متطابقة',
    path: ['confirmPassword']
});

export const UserSchema = z.object({
    id: z.union([z.string(), z.number()]),
    name: z.string().min(1),
    email: z.string().email(),
    role: z.enum(['coach', 'admin', 'client', 'nutritionist', 'receptionist', 'trainee']),
    permissions: z.array(z.string()).optional(),
    avatar: z.string().optional(),
});

export const RegisterRequestSchema = z.object({
    name: z.string().min(1, 'الاسم الكامل مطلوب'),
    email: z.string().min(1, 'البريد الإلكتروني مطلوب').email('صيغة البريد الإلكتروني غير صحيحة'),
    phone: z.string().min(1, 'رقم الهاتف مطلوب'),
    password: z.string().min(6, 'يجب أن تتكون كلمة المرور من 6 أحرف على الأقل'),
    confirmPassword: z.string().min(6, 'تأكيد كلمة المرور مطلوب'),
    role: z.enum(['admin', 'coach', 'nutritionist', 'receptionist', 'trainee']),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'كلمات المرور غير متطابقة',
    path: ['confirmPassword']
});

export const LoginResponseSchema = z.object({
    user: UserSchema,
    accessToken: z.string(),
    refreshToken: z.string(),
});
