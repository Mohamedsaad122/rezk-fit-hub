import { create } from 'zustand';
import { InvoiceService } from '@/services/invoice.service';

export const useCheckoutStore = create((set, get) => ({
    selectedPlan: { id: 'Professional', name: 'الباقة الاحترافية', price: 1000 },
    couponCode: '',
    couponDetails: null,
    taxCountry: 'SA',
    taxRate: 15,
    items: [{ description: 'اشتراك باقة المحترفين', quantity: 1, unitPrice: 1000, amount: 1000 }],
    totals: { subtotal: 1000, discount: 0, tax: 150, total: 1150 },

    setSelectedPlan: (plan) => {
        const items = [{ description: `اشتراك ${plan.name}`, quantity: 1, unitPrice: plan.price, amount: plan.price }];
        set({ selectedPlan: plan, items });
        get().recalculate();
    },

    setCouponDetails: (coupon) => {
        set({ couponDetails: coupon });
        get().recalculate();
    },

    setTaxCountry: (country, rate) => {
        set({ taxCountry: country, taxRate: rate });
        get().recalculate();
    },

    recalculate: () => {
        const { items, couponDetails, taxRate } = get();
        const totals = InvoiceService.calculateTotals(items, couponDetails, taxRate);
        set({ totals });
    },

    resetCheckout: () => set({
        couponCode: '',
        couponDetails: null,
        totals: { subtotal: 1000, discount: 0, tax: 150, total: 1150 }
    })
}));

export default useCheckoutStore;
