export const billingMock = [
    {
        id: 1,
        tenantId: 1,
        companyName: 'مؤسسة التدريب الافتراضية',
        taxId: 'TAX-123456789',
        address: 'شارع العليا، الرياض، المملكة العربية السعودية',
        country: 'SA',
        email: 'billing@default.com',
        paymentMethodType: 'CreditCard',
        paymentMethodDetails: {
            brand: 'Visa',
            last4: '4242',
            expiry: '12/28'
        },
        updatedAt: '2026-07-15T00:00:00Z'
    },
    {
        id: 2,
        tenantId: 2,
        companyName: 'Elite Training Hub Ltd',
        taxId: 'TAX-987654321',
        address: 'Downtown Dubai, UAE',
        country: 'AE',
        email: 'billing@elite.com',
        paymentMethodType: 'Stripe',
        paymentMethodDetails: {
            brand: 'MasterCard',
            last4: '9999',
            expiry: '05/29'
        },
        updatedAt: '2026-07-16T00:00:00Z'
    }
];
