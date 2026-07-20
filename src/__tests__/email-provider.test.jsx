import { describe, it, expect, beforeEach } from 'vitest';
import { ProviderManagerService } from '../services/provider-manager.service';
import { EmailService } from '../services/email.service';

describe('Email Provider Sprint 5.4 Test Suite', () => {
    beforeEach(() => {
        ProviderManagerService.setEmailProvider('SendGrid');
    });

    it('should send email using SendGrid adapter when it is active', async () => {
        ProviderManagerService.setEmailProvider('SendGrid');
        const res = await EmailService.sendEmail({
            to: 'test@example.com',
            subject: 'سجل الحضور اليومي',
            body: 'مرحبا بك في ريزك فيت هب'
        });

        expect(res.success).toBe(true);
        expect(res.provider).toBe('SendGrid');
        expect(res.messageId).toBeDefined();
        expect(res.to).toBe('test@example.com');
        expect(res.subject).toBe('سجل الحضور اليومي');
    });

    it('should switch dynamically to SMTP adapter and send email', async () => {
        ProviderManagerService.setEmailProvider('SMTP');
        const res = await EmailService.sendEmail({
            to: 'admin@gym.com',
            subject: 'تقرير المبيعات',
            body: 'إجمالي المبيعات لشهر يوليو'
        });

        expect(res.success).toBe(true);
        expect(res.provider).toBe('SMTP');
        expect(res.to).toBe('admin@gym.com');
    });

    it('should support Mailgun and Mock mail provider adapters', async () => {
        ProviderManagerService.setEmailProvider('Mailgun');
        let res = await EmailService.sendEmail({ to: 'user1@test.com', subject: 'A', body: 'B' });
        expect(res.provider).toBe('Mailgun');

        ProviderManagerService.setEmailProvider('Mock');
        res = await EmailService.sendEmail({ to: 'user2@test.com', subject: 'C', body: 'D' });
        expect(res.provider).toBe('Mock');
    });
});
