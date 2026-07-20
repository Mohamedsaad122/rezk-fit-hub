import { WebhookRepository } from '@/repositories/webhook.repository';
import { eventBus } from '@/realtime/event-bus';

export const WebhookService = {
    register: async (data) => {
        return WebhookRepository.create(data);
    },

    deleteWebhook: async (id) => {
        return WebhookRepository.delete(id);
    },

    verifySignature: (payload, secret, receivedSignature) => {
        if (!payload || !secret || !receivedSignature) return false;
        const expected = WebhookService.generateSignature(payload, secret);
        return expected === receivedSignature;
    },

    generateSignature: (payload, secret) => {
        const serialized = typeof payload === 'string' ? payload : JSON.stringify(payload);
        // Base64 simulation of HMAC signature
        try {
            const combined = serialized + '::' + secret;
            // Simple hash string simulation
            let hash = 0;
            for (let i = 0; i < combined.length; i++) {
                const char = combined.charCodeAt(i);
                hash = (hash << 5) - hash + char;
                hash = hash & hash;
            }
            return `sha256_${Math.abs(hash).toString(16)}`;
        } catch (e) {
            return `sha256_fallback_sig_${secret}`;
        }
    },

    dispatch: async (event, payload) => {
        const endpoints = await WebhookRepository.getAll();
        const targets = endpoints.filter(w => w.status === 'Active' && w.events.includes(event));

        for (const target of targets) {
            await WebhookService.sendWithRetry(target, event, payload);
        }
    },

    sendWithRetry: async (webhook, event, payload, attempt = 1) => {
        const maxRetries = 3;
        let success = true;
        let statusCode = 200;
        let errorMessage = null;

        // If URL has fail, simulate server down
        if (webhook.url.includes('fail') || webhook.status === 'Failing') {
            success = false;
            statusCode = 502;
            errorMessage = 'Bad Gateway on external endpoint';
        }

        if (success) {
            await WebhookRepository.addLog({
                webhookId: webhook.id,
                event,
                payload,
                status: 'Success',
                statusCode,
                attempts: attempt,
                errorMessage: null
            });
            eventBus.publish('Webhook Received', { webhookId: webhook.id, event, success: true });
            return true;
        } else {
            if (attempt < maxRetries) {
                return WebhookService.sendWithRetry(webhook, event, payload, attempt + 1);
            } else {
                // DLQ insertion
                await WebhookRepository.addLog({
                    webhookId: webhook.id,
                    event,
                    payload,
                    status: 'Failed',
                    statusCode,
                    attempts: attempt,
                    errorMessage: `${errorMessage} [DLQ]`
                });
                eventBus.publish('Webhook Failed', { webhookId: webhook.id, event, success: false });
                return false;
            }
        }
    },

    replayEvent: async (logId) => {
        const logs = await WebhookRepository.getLogs();
        const log = logs.find(l => l.id === Number(logId));
        if (!log) return false;

        const endpoints = await WebhookRepository.getAll();
        const webhook = endpoints.find(w => w.id === log.webhookId);
        if (!webhook) return false;

        return WebhookService.sendWithRetry(webhook, log.event, log.payload, 1);
    }
};

export default WebhookService;
