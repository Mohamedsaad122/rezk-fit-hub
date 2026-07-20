import { describe, it, expect, beforeEach, vi } from 'vitest';
import AppConfig from '../config/app.config';
import { mockDatabase } from '../mocks/mockDatabase';
import { PaymentService } from '../services/payment.service';
import { InvoiceRepository } from '../repositories/invoice.repository';
import { TenantRepository } from '../repositories/tenant.repository';

vi.mock('../utils/mockApi.helper', () => {
    return {
        simulateApi: (fn) => fn()
    };
});

describe('Sprint 5.2 Payment Gateways Routing & Transactions', () => {
    beforeEach(() => {
        AppConfig.enableMock = true;
        mockDatabase.reset();
    });

    it('should process payment and transition invoice status to Paid on success', async () => {
        TenantRepository.setActiveTenant(1);

        const invoiceBefore = await InvoiceRepository.getById(2);
        expect(invoiceBefore.status).toBe('Pending');

        // Process successful payment
        const payment = await PaymentService.processPayment(2, 1150, 'CreditCard', 'Stripe');
        expect(payment.status).toBe('Success');
        expect(payment.gatewayToken).toBeDefined();

        // Verify invoice updated to Paid
        const invoiceAfter = await InvoiceRepository.getById(2);
        expect(invoiceAfter.status).toBe('Paid');
        expect(invoiceAfter.paymentHistory.length).toBe(1);
    });

    it('should update invoice status to Failed when payment fails', async () => {
        TenantRepository.setActiveTenant(1);

        // Process failing payment (value 999999 forces failure in mock)
        const payment = await PaymentService.processPayment(2, 999999, 'CreditCard', 'Stripe');
        expect(payment.status).toBe('Failed');

        const invoice = await InvoiceRepository.getById(2);
        expect(invoice.status).toBe('Failed');
    });
});
