import { create } from 'zustand';

export const useBillingStore = create((set) => ({
    billingProfile: null,
    setBillingProfile: (profile) => set({ billingProfile: profile })
}));

export default useBillingStore;
