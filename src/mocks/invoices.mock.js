export const invoicesMock = [
    {
        id: 1,
        tenantId: 1,
        organizationId: 1,
        invoiceNumber: 'INV-2026-001',
        billingPeriod: 'يوليو 2026',
        issueDate: '2026-07-01T00:00:00Z',
        dueDate: '2026-07-15T00:00:00Z',
        subtotal: 1000,
        discount: 100,
        tax: 135,
        total: 1035,
        currency: 'SAR',
        status: 'Paid',
        items: [
            { description: 'اشتراك باقة المحترفين لشهر يوليو', quantity: 1, unitPrice: 1000, amount: 1000 }
        ],
        paymentHistory: [
            { paymentId: 1, amount: 1035, status: 'Success', timestamp: '2026-07-02T10:00:00Z' }
        ]
    },
    {
        id: 2,
        tenantId: 1,
        organizationId: 1,
        invoiceNumber: 'INV-2026-002',
        billingPeriod: 'أغسطس 2026',
        issueDate: '2026-08-01T00:00:00Z',
        dueDate: '2026-08-15T00:00:00Z',
        subtotal: 1000,
        discount: 0,
        tax: 150,
        total: 1150,
        currency: 'SAR',
        status: 'Pending',
        items: [
            { description: 'اشتراك باقة المحترفين لشهر أغسطس', quantity: 1, unitPrice: 1000, amount: 1000 }
        ],
        paymentHistory: []
    }
];
