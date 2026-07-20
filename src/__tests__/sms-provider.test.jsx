import { describe, it, expect, beforeEach } from 'vitest';
import { ProviderManagerService } from '../services/provider-manager.service';
import { SmsService } from '../services/sms.service';

describe('SMS Provider Sprint 5.4 Test Suite', () => {
    beforeEach(() => {
        ProviderManagerService.setSmsProvider('Twilio');
    });

    it('should send SMS using Twilio adapter when it is active', async () => {
        ProviderManagerService.setSmsProvider('Twilio');
        const res = await SmsService.sendSms({
            to: '+201000000000',
            message: 'تم تأكيد موعد حصتك اليوم الساعة 6 مساءً'
        });

        expect(res.success).toBe(true);
        expect(res.provider).toBe('Twilio');
        expect(res.sid).toBeDefined();
        expect(res.to).toBe('+201000000000');
        expect(res.message).toBe('تم تأكيد موعد حصتك اليوم الساعة 6 مساءً');
    });

    it('should switch dynamically to FirebaseSMS adapter and dispatch message', async () => {
        ProviderManagerService.setSmsProvider('FirebaseSMS');
        const res = await SmsService.sendSms({
            to: '+201111111111',
            message: 'كود التحقق الخاص بك هو 9821'
        });

        expect(res.success).toBe(true);
        expect(res.provider).toBe('FirebaseSMS');
        expect(res.to).toBe('+201111111111');
        expect(res.message).toBe('كود التحقق الخاص بك هو 9821');
    });

    it('should support Mock SMS provider adapter', async () => {
        ProviderManagerService.setSmsProvider('Mock');
        const res = await SmsService.sendSms({
            to: '+201222222222',
            message: 'رسالة تجريبية'
        });

        expect(res.success).toBe(true);
        expect(res.provider).toBe('Mock');
        expect(res.to).toBe('+201222222222');
    });
});
