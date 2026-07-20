import { z } from 'zod';

export const BranchSchema = z.object({
    id: z.number().nonnegative(),
    name: z.string().min(1, 'اسم الفرع مطلوب'),
    code: z.string().min(1, 'رمز الفرع مطلوب'),
    address: z.string().min(1, 'العنوان مطلوب'),
    phone: z.string().min(1, 'رقم الهاتف مطلوب'),
    manager: z.string().min(1, 'المدير المسؤول مطلوب'),
    status: z.enum(['Active', 'Inactive']),
    timezone: z.string().min(1, 'النطاق الزمني مطلوب')
});

export const BranchCreateSchema = BranchSchema.omit({ id: true });
export const BranchUpdateSchema = BranchCreateSchema.partial();
