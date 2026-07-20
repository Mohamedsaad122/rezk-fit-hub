export const couponsMock = [
    {
        id: 1,
        tenantId: 1,
        code: 'PROMO10',
        type: 'Percentage',
        value: 10,
        expirationDate: '2026-12-31T00:00:00Z',
        maxUses: 100,
        usedCount: 5,
        status: 'Active',
        organizationId: 1
    },
    {
        id: 2,
        tenantId: 1,
        code: 'SAVE50',
        type: 'Fixed',
        value: 50,
        expirationDate: '2026-12-31T00:00:00Z',
        maxUses: 200,
        usedCount: 0,
        status: 'Active',
        organizationId: null
    }
];
