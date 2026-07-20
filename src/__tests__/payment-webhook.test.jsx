import { describe, it, expect, beforeEach } from 'vitest';
import AppConfig from '../config/app.config';
import { mockDatabase } from '../mocks/mockDatabase';
import { PaymentWebhookService } from '../services/payment-webhook.service';
import { PaymentRepository } from '../repositories/payment.repository';
import { TenantRepository } from '../repositories/tenant.repository';

describe('Payment Webhooks Engine Sprint 5.4 Test Suite', () => {
    beforeEach(() => {
        AppConfig.enableMock = true;
        mockDatabase.reset();
        TenantRepository.setActiveTenant(1);
    });

    it('should process Stripe payment succeeded webhook event successfully', async () => {
        const payload = {
            id: 'evt_stripe_12345',
            type: 'payment_intent.succeeded',
            data: {
                object: {
                    amount: 1500,
                    invoiceId: 1
                }
            }
        };
        const secret = 'stripe_wh_secret';
        const signature = `stripe_sig_${secret}`;

        const result = await PaymentWebhookService.processIncomingWebhook('Stripe', payload, signature, secret);
        
        expect(result.success).toBe(true);
        expect(result.provider).toBe('Stripe');
        expect(result.payment).toBeDefined();
        expect(result.payment.amount).toBe(1500);
        expect(result.payment.status).toBe('Success');
        expect(result.payment.method).toBe('Stripe');
        expect(result.payment.gatewayToken).toBe('evt_stripe_12345');

        // Check in repository
        const allPayments = await PaymentRepository.getAll();
        expect(allPayments.find(p => p.gatewayToken === 'evt_stripe_12345')).toBeDefined();
    });

    it('should block processing Stripe webhook if signature is invalid', async () => {
        const payload = { id: 'evt_stripe_12345', type: 'payment_intent.succeeded', data: { object: { amount: 1500 } } };
        
        await expect(
            PaymentWebhookService.processIncomingWebhook('Stripe', payload, 'invalid_sig', 'secret')
        ).rejects.toThrow('Signature verification failed');
    });

    it('should process PayPal PAYMENT.CAPTURE.COMPLETED event successfully', async () => {
        const payload = {
            id: 'evt_paypal_99999',
            event_type: 'PAYMENT.CAPTURE.COMPLETED',
            resource: {
                amount: {
                    value: '850.50'
                },
                invoice_id: '1'
            }
        };
        const secret = 'paypal_wh_secret';
        const signature = `paypal_sig_${secret}`;

        const result = await PaymentWebhookService.processIncomingWebhook('PayPal', payload, signature, secret);

        expect(result.success).toBe(true);
        expect(result.payment.amount).toBe(850.50);
        expect(result.payment.status).toBe('Success');
        expect(result.payment.method).toBe('PayPal');
        expect(result.payment.gatewayToken).toBe('evt_paypal_99999');
    });

    it('should process MyFatoorah TransactionStatusChanged success event successfully', async () => {
        const payload = {
            id: 'evt_myfatoorah_777',
            Event: 'TransactionStatusChanged',
            Data: {
                InvoiceId: '100200300',
                InvoiceValue: 350,
                TransactionStatus: '2', // Success code
                CustomerReference: '1'
            }
        };
        const secret = 'myfatoorah_secret';
        const signature = `myfatoorah_sig_${secret}`;

        const result = await PaymentWebhookService.processIncomingWebhook('MyFatoorah', payload, signature, secret);

        expect(result.success).toBe(true);
        expect(result.payment.amount).toBe(350);
        expect(result.payment.status).toBe('Success');
        expect(result.payment.method).toBe('MyFatoorah');
        expect(result.payment.gatewayToken).toBe('100200300');
    });

    it('should process Paymob payment success event successfully', async () => {
        const payload = {
            id: 'evt_paymob_888',
            obj: {
                id: 112233,
                amount_cents: 25000, // 250 EGP
                success: true,
                order: {
                    merchant_order_id: '1'
                }
            }
        };
        const secret = 'paymob_secret';
        const signature = `paymob_sig_${secret}`;

        const result = await PaymentWebhookService.processIncomingWebhook('Paymob', payload, signature, secret);

        expect(result.success).toBe(true);
        expect(result.payment.amount).toBe(250);
        expect(result.payment.status).toBe('Success');
        expect(result.payment.method).toBe('Paymob');
        expect(result.payment.gatewayToken).toBe('112233');
    });

    it('should process Moyasar invoice paid event successfully', async () => {
        const payload = {
            id: 'evt_moyasar_555',
            data: {
                id: 'pay_moyasar_7777',
                amount: 45000, // 450.00 SAR
                status: 'paid',
                metadata: {
                    invoice_id: '1'
                }
            }
        };
        const secret = 'moyasar_secret';
        const signature = `moyasar_sig_${secret}`;

        const result = await PaymentWebhookService.processIncomingWebhook('Moyasar', payload, signature, secret);

        expect(result.success).toBe(true);
        expect(result.payment.amount).toBe(450);
        expect(result.payment.status).toBe('Success');
        expect(result.payment.method).toBe('Moyasar');
        expect(result.payment.gatewayToken).toBe('pay_moyasar_7777');
    });
});
