import { describe, it, expect, beforeEach, vi } from 'vitest';
import AppConfig from '../config/app.config';
import { mockDatabase } from '../mocks/mockDatabase';
import { WebhookService } from '../services/webhook.service';
import { WebhookRepository } from '../repositories/webhook.repository';
import { TenantRepository } from '../repositories/tenant.repository';

describe('Webhook Engine Sprint 5.4 Test Suite', () => {
    beforeEach(() => {
        AppConfig.enableMock = true;
        mockDatabase.reset();
        TenantRepository.setActiveTenant(1);
    });

    it('should register webhook and retrieve them successfully', async () => {
        const created = await WebhookService.register({
            url: 'https://test-webhook.com/event-listener',
            events: ['MEMBER_JOINED']
        });

        expect(created.id).toBeDefined();
        expect(created.url).toBe('https://test-webhook.com/event-listener');
        expect(created.status).toBe('Active');

        const allWebhooks = await WebhookRepository.getAll();
        expect(allWebhooks.find(w => w.id === created.id)).toBeDefined();
    });

    it('should delete a registered webhook endpoint', async () => {
        const created = await WebhookService.register({
            url: 'https://test-webhook.com/delete-me',
            events: ['INVOICE_PAID']
        });

        const deleted = await WebhookService.deleteWebhook(created.id);
        expect(deleted).toBe(true);

        const allWebhooks = await WebhookRepository.getAll();
        expect(allWebhooks.find(w => w.id === created.id)).toBeUndefined();
    });

    it('should verify simulated signature authenticity using secret key', () => {
        const payload = { event: 'TEST_EVENT', data: { id: 100 } };
        const secret = 'super_secret_key';
        
        const signature = WebhookService.generateSignature(payload, secret);
        expect(signature).toBeDefined();

        const isValid = WebhookService.verifySignature(payload, secret, signature);
        expect(isValid).toBe(true);

        const isInvalid = WebhookService.verifySignature(payload, 'wrong_secret', signature);
        expect(isInvalid).toBe(false);
    });

    it('should verify retry policy, failing simulation, and insertion to DLQ', async () => {
        // Register a failing webhook
        const failingWebhook = await WebhookService.register({
            url: 'https://fail-endpoint.com/webhook',
            events: ['INVOICE_GENERATED']
        });

        // Dispatch should trigger retry logic and result in a DLQ log entry
        await WebhookService.dispatch('INVOICE_GENERATED', { invoiceId: 44 });

        const logs = await WebhookRepository.getLogs();
        const failingLogs = logs.filter(l => l.webhookId === failingWebhook.id);
        
        expect(failingLogs.length).toBe(1);
        expect(failingLogs[0].status).toBe('Failed');
        expect(failingLogs[0].attempts).toBe(3); // Max retries
        expect(failingLogs[0].errorMessage).toContain('[DLQ]');
    });

    it('should verify event replay from history logs', async () => {
        const webhook = await WebhookService.register({
            url: 'https://success-endpoint.com/webhook',
            events: ['MEMBER_JOINED']
        });

        // Add a mock log
        const log = await WebhookRepository.addLog({
            webhookId: webhook.id,
            event: 'MEMBER_JOINED',
            payload: { memberId: 99 },
            status: 'Failed',
            statusCode: 500,
            attempts: 3,
            errorMessage: 'Server Error [DLQ]'
        });

        // Replay event should retry successfully (as the url doesn't have "fail")
        const result = await WebhookService.replayEvent(log.id);
        expect(result).toBe(true);

        const logsAfterReplay = await WebhookRepository.getLogs();
        const successLog = logsAfterReplay.find(l => l.webhookId === webhook.id && l.status === 'Success');
        expect(successLog).toBeDefined();
        expect(successLog.attempts).toBe(1);
    });

    it('should preserve tenant isolation for webhook endpoints and logs', async () => {
        // Tenant 1 adds webhook
        TenantRepository.setActiveTenant(1);
        const wh1 = await WebhookService.register({
            url: 'https://tenant1.com/hook',
            events: ['INVOICE_PAID']
        });

        // Tenant 2 adds webhook
        TenantRepository.setActiveTenant(2);
        const wh2 = await WebhookService.register({
            url: 'https://tenant2.com/hook',
            events: ['INVOICE_PAID']
        });

        // Verify isolation of getAll
        TenantRepository.setActiveTenant(1);
        const list1 = await WebhookRepository.getAll();
        expect(list1.find(w => w.id === wh1.id)).toBeDefined();
        expect(list1.find(w => w.id === wh2.id)).toBeUndefined();

        TenantRepository.setActiveTenant(2);
        const list2 = await WebhookRepository.getAll();
        expect(list2.find(w => w.id === wh2.id)).toBeDefined();
        expect(list2.find(w => w.id === wh1.id)).toBeUndefined();
    });
});
