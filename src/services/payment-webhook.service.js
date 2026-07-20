import { PaymentWebhookAdapters } from './adapters/payment-webhook.adapters';
import { PaymentRepository } from '@/repositories/payment.repository';

export const PaymentWebhookService = {
    processIncomingWebhook: async (provider, payload, signature, secret) => {
        const adapter = PaymentWebhookAdapters[provider];
        if (!adapter) {
            throw new Error(`Unsupported payment webhook provider: ${provider}`);
        }

        const isValid = adapter.verifySignature(payload, signature, secret);
        if (!isValid) {
            throw new Error(`Signature verification failed for provider: ${provider}`);
        }

        const paymentInfo = adapter.processPayload(payload);

        // Record the payment in the repository
        const createdPayment = await PaymentRepository.create({
            invoiceId: paymentInfo.invoiceId || 1, // fallback to a valid invoice if missing
            amount: paymentInfo.amount,
            method: paymentInfo.gateway,
            gateway: provider,
            status: paymentInfo.status,
            gatewayToken: paymentInfo.referenceToken
        });

        return {
            success: true,
            provider,
            payment: createdPayment
        };
    }
};

export default PaymentWebhookService;
