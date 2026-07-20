import { describe, it, expect, beforeEach, vi } from 'vitest';
import AppConfig from '../config/app.config';
import { mockDatabase } from '../mocks/mockDatabase';
import { InvoiceService } from '../services/invoice.service';
import { InvoiceRepository } from '../repositories/invoice.repository';
import { TenantRepository } from '../repositories/tenant.repository';

vi.mock('../utils/mockApi.helper', () => {
    return {
        simulateApi: (fn) => fn()
    };
});

describe('Sprint 5.2 Invoice Engine Totals & Credit Notes', () => {
    beforeEach(() => {
        AppConfig.enableMock = true;
        mockDatabase.reset();
    });

    it('should calculate subtotals, tax rates, and apply coupon discounts correctly', () => {
        const items = [
            { description: 'Item 1', quantity: 2, unitPrice: 200, amount: 400 },
            { description: 'Item 2', quantity: 1, unitPrice: 100, amount: 100 }
        ];

        // 1. Without Coupon, 15% VAT
        const totals1 = InvoiceService.calculateTotals(items, null, 15);
        expect(totals1.subtotal).toBe(500);
        expect(totals1.discount).toBe(0);
        expect(totals1.tax).toBe(75);
        expect(totals1.total).toBe(575);

        // 2. With 10% Percentage Coupon, 15% VAT
        const coupon = { code: 'SAVE10', type: 'Percentage', value: 10, status: 'Active' };
        const totals2 = InvoiceService.calculateTotals(items, coupon, 15);
        expect(totals2.subtotal).toBe(500);
        expect(totals2.discount).toBe(50);
        expect(totals2.tax).toBe(67.5);
        expect(totals2.total).toBe(517.5);
    });

    it('should issue credit notes and reduce the invoice total amount', async () => {
        TenantRepository.setActiveTenant(1);

        const invoice = await InvoiceRepository.getById(1);
        const originalTotal = invoice.total;

        // Apply a credit note of 200 SAR
        const updated = await InvoiceService.issueCreditNote(1, 200, 'تعديل قيمة الباقة');
        expect(updated.discount).toBe(300); // initial 100 + 200
        expect(updated.total).toBeLessThan(originalTotal);
    });
});
