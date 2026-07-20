import { InvoiceRepository } from '@/repositories/invoice.repository';

export const InvoiceService = {
    calculateTotals: (items = [], coupon = null, taxRate = 15) => {
        const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
        
        let discount = 0;
        if (coupon && coupon.status === 'Active') {
            if (coupon.type === 'Percentage') {
                discount = subtotal * (coupon.value / 100);
            } else if (coupon.type === 'Fixed') {
                discount = Math.min(coupon.value, subtotal);
            }
        }

        const taxableAmount = Math.max(0, subtotal - discount);
        const tax = taxableAmount * (taxRate / 100);
        const total = taxableAmount + tax;

        return {
            subtotal: Number(subtotal.toFixed(2)),
            discount: Number(discount.toFixed(2)),
            tax: Number(tax.toFixed(2)),
            total: Number(total.toFixed(2))
        };
    },

    issueCreditNote: async (invoiceId, creditAmount, reason = 'خصم استثنائي') => {
        try {
            const invoice = await InvoiceRepository.getById(invoiceId);
            if (!invoice) throw new Error('الفاتورة غير موجودة');

            const updatedDiscount = invoice.discount + creditAmount;
            const totals = InvoiceService.calculateTotals(invoice.items, { type: 'Fixed', value: updatedDiscount, status: 'Active' }, 15);

            const updated = await InvoiceRepository.update(invoiceId, {
                discount: totals.discount,
                tax: totals.tax,
                total: totals.total
            });

            return updated;
        } catch (error) {
            console.error('Failed to issue credit note:', error);
            throw error;
        }
    }
};

export default InvoiceService;
