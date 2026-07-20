import { z } from 'zod';

export const PaginationQuerySchema = z.object({
    page: z.number().int().positive('رقم الصفحة يجب أن يكون أكبر من 0').default(1),
    limit: z.number().int().positive('عدد العناصر يجب أن يكون أكبر من 0').max(100, 'الحد الأقصى للعناصر هو 100').default(10),
    search: z.string().optional(),
    status: z.string().optional()
});

export const PaginationMetadataSchema = z.object({
    page: z.number().int().nonnegative(),
    limit: z.number().int().positive(),
    total: z.number().int().nonnegative(),
    totalPages: z.number().int().nonnegative()
});

export const createPaginatedResponseSchema = (itemSchema) => {
    return z.object({
        data: z.array(itemSchema),
        meta: PaginationMetadataSchema
    });
};

export default createPaginatedResponseSchema;
