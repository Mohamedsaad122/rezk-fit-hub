import { describe, it, expect, beforeEach } from 'vitest';
import { ProviderManagerService } from '../services/provider-manager.service';
import { StorageService } from '../services/storage.service';

describe('Storage Provider Sprint 5.4 Test Suite', () => {
    beforeEach(() => {
        ProviderManagerService.setStorageProvider('AWS_S3');
    });

    it('should upload and delete file using AWS S3 adapter when active', async () => {
        ProviderManagerService.setStorageProvider('AWS_S3');
        
        const uploadRes = await StorageService.uploadFile('member_report.pdf', 'report content data');
        expect(uploadRes.success).toBe(true);
        expect(uploadRes.provider).toBe('AWS_S3');
        expect(uploadRes.fileUrl).toContain('aws-s3');
        expect(uploadRes.fileName).toBe('member_report.pdf');

        const deleteRes = await StorageService.deleteFile(uploadRes.fileUrl);
        expect(deleteRes.success).toBe(true);
        expect(deleteRes.provider).toBe('AWS_S3');
        expect(deleteRes.deletedUrl).toBe(uploadRes.fileUrl);
    });

    it('should dynamically switch and support other cloud storage adapters', async () => {
        const cloudProviders = [
            { key: 'GoogleDrive', match: 'googledrive' },
            { key: 'Dropbox', match: 'dropbox' },
            { key: 'OneDrive', match: 'onedrive' },
            { key: 'Cloudinary', match: 'cloudinary' },
            { key: 'FirebaseStorage', match: 'firebasestorage' },
            { key: 'Mock', match: 'mock' }
        ];

        for (const provider of cloudProviders) {
            ProviderManagerService.setStorageProvider(provider.key);
            const res = await StorageService.uploadFile('avatar.png', 'avatar payload');
            expect(res.success).toBe(true);
            expect(res.provider).toBe(provider.key);
            expect(res.fileUrl.toLowerCase()).toContain(provider.match);
        }
    });
});
