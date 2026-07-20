import { describe, it, expect, beforeEach } from 'vitest';
import { ProviderManagerService } from '../services/provider-manager.service';

describe('Sprint 5.4 Provider Manager Switch Routing', () => {
    beforeEach(() => {
        ProviderManagerService.setSmsProvider('Twilio');
        ProviderManagerService.setEmailProvider('SendGrid');
        ProviderManagerService.setStorageProvider('AWS_S3');
    });

    it('should dynamically switch SMS provider configurations', () => {
        expect(ProviderManagerService.getSmsProvider()).toBe('Twilio');
        ProviderManagerService.setSmsProvider('FirebaseSMS');
        expect(ProviderManagerService.getSmsProvider()).toBe('FirebaseSMS');
    });

    it('should dynamically switch email provider configurations', () => {
        expect(ProviderManagerService.getEmailProvider()).toBe('SendGrid');
        ProviderManagerService.setEmailProvider('Mailgun');
        expect(ProviderManagerService.getEmailProvider()).toBe('Mailgun');
    });

    it('should dynamically switch storage provider configurations', () => {
        expect(ProviderManagerService.getStorageProvider()).toBe('AWS_S3');
        ProviderManagerService.setStorageProvider('GoogleDrive');
        expect(ProviderManagerService.getStorageProvider()).toBe('GoogleDrive');
    });
});
