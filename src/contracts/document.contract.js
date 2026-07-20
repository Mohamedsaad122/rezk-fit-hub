import { z } from 'zod';

export const DocumentCategorySchema = z.enum([
    'Images', 
    'PDF', 
    'Word', 
    'Excel', 
    'CSV', 
    'ZIP', 
    'Videos', 
    'Audio',
    'Client Images',
    'Progress Photos',
    'Medical Reports',
    'Nutrition PDFs',
    'Workout PDFs',
    'Measurements Files',
    'Other'
], {
    errorMap: () => ({ message: 'فئة المستند غير صالحة' })
});

export const DocumentVersionSchema = z.object({
    version: z.number().positive(),
    url: z.string(),
    size: z.number().nonnegative(),
    updatedAt: z.string(),
    updatedBy: z.string()
});

export const DocumentResponseSchema = z.object({
    id: z.union([z.string(), z.number()]),
    tenantId: z.union([z.string(), z.number()]).optional(),
    name: z.string().min(1, 'اسم المستند مطلوب'),
    url: z.string().min(1, 'رابط المستند مطلوب'),
    extension: z.string(),
    size: z.number().nonnegative(), // bytes
    owner: z.string().default('Coach'),
    category: DocumentCategorySchema.default('Other'),
    tags: z.array(z.string()).default([]),
    isFavorite: z.boolean().default(false),
    isArchived: z.boolean().default(false),
    versions: z.array(DocumentVersionSchema).default([]),
    clientId: z.union([z.string(), z.number()]).nullable().optional().default(null),
    appointmentId: z.union([z.string(), z.number()]).nullable().optional().default(null),
    taskId: z.union([z.string(), z.number()]).nullable().optional().default(null),
    createdAt: z.string(),
    updatedAt: z.string()
});

export const DocumentRequestSchema = DocumentResponseSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true
}).partial({
    owner: true,
    category: true,
    tags: true,
    isFavorite: true,
    isArchived: true,
    versions: true,
    clientId: true,
    appointmentId: true,
    taskId: true
});

export const DocumentListResponseSchema = z.array(DocumentResponseSchema);

export const StorageUsageSchema = z.object({
    used: z.number().nonnegative(), // bytes
    limit: z.number().nonnegative(), // bytes
    breakdown: z.object({
        images: z.number().nonnegative(),
        pdf: z.number().nonnegative(),
        documents: z.number().nonnegative(),
        videos: z.number().nonnegative(),
        audio: z.number().nonnegative(),
        other: z.number().nonnegative()
    })
});

export default DocumentResponseSchema;
