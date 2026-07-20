import { z } from 'zod';

export const MediaSchema = z.object({
    id: z.union([z.string(), z.number()]),
    documentId: z.union([z.string(), z.number()]),
    zoomLevel: z.number().default(1),
    rotationAngle: z.number().default(0), // degrees: 0, 90, 180, 270
    filterEffect: z.string().default('none'),
    isFullscreen: z.boolean().default(false),
    thumbnailGridUrl: z.string().optional()
});

export const MediaListSchema = z.array(MediaSchema);

export default MediaSchema;
