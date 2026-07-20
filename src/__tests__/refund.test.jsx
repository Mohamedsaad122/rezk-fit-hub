import { describe, it, expect, beforeEach, vi } from 'vitest';
import AppConfig from '../config/app.config';
import { mockDatabase } from '../mocks/mockDatabase';
import { InvoiceRepository } from '../repositories/invoice.repository';
import { TenantRepository } from '../repositories/tenant.repository';
import { PaymentRepository } from '../repositories/payment.repository';

vi.mock('../utils/mockApi.helper', () => {
    return {
        simulateApi: (fn) => fn()
    };
});

describe('Sprint 5.2 Refunds & Debit Ledgers', () => {
    beforeEach(() => {
        AppConfig.enableMock = true;
        mockDatabase.reset();
    });

    it('should process refund and create a Debit transaction ledger entry', async () => {
        TenantRepository.setActiveTenant(1);

        const invoiceBefore = await InvoiceRepository.getById(1);
        expect(invoiceBefore.status).toBe('Paid');

        // Refund the paid invoice
        const refundResult = await InvoiceRepository.refund(1, 1035, 'طلب المتدرب استرداد أمواله');
        expect(refundResult.status).toBe('Success');
        expect(refundResult.amount).toBe(1035);

        // Verify invoice is Cancelled
        const invoiceAfter = await InvoiceRepository.getById(1);
        expect(invoiceAfter.status).toBe('Cancelled');

        // Verify debit entry created in transactions ledger
        const txs = await PaymentRepository.getTransactions();
        const debitEntry = txs.find(tx => tx.type === 'Debit');
        expect(debitEntry).toBeDefined();
        expect(debitEntry.amount).toBe(1035);
    });
});
