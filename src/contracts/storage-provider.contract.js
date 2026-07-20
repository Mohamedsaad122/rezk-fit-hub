import { z } from 'zod';

export const StorageProviderConfigSchema = z.object({
    activeProvider: z.enum(['AWS_S3', 'GoogleDrive', 'Dropbox', 'Cloudinary', 'OneDrive', 'FirebaseStorage', 'Mock']),
    bucketName: z.string().optional().default(''),
    region: z.string().optional().default(''),
    accessKeyId: z.string().optional().default(''),
    secretAccessKey: z.string().optional().default(''),
    cloudName: z.string().optional().default('')
});

export default StorageProviderConfigSchema;
