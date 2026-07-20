export const membersMock = [
    {
        id: 1,
        tenantId: 1,
        organizationId: 1,
        email: 'ahmed@rezkfit.com',
        name: 'الكوتش أحمد',
        role: 'Owner',
        status: 'Active',
        joinedAt: '2026-01-01T00:00:00Z',
        teamIds: [1]
    },
    {
        id: 2,
        tenantId: 1,
        organizationId: 1,
        email: 'sara@rezkfit.com',
        name: 'سارة أحمد',
        role: 'Administrator',
        status: 'Active',
        joinedAt: '2026-01-05T00:00:00Z',
        teamIds: [1]
    },
    {
        id: 3,
        tenantId: 1,
        organizationId: 1,
        email: 'mohamed@rezkfit.com',
        name: 'محمد علي',
        role: 'Coach',
        status: 'Active',
        joinedAt: '2026-01-10T00:00:00Z',
        teamIds: [2]
    },
    {
        id: 4,
        tenantId: 1,
        organizationId: 2,
        email: 'ali@rezkfit.com',
        name: 'علي حسن',
        role: 'Nutritionist',
        status: 'Active',
        joinedAt: '2026-03-01T00:00:00Z',
        teamIds: [3]
    },
    {
        id: 5,
        tenantId: 1,
        organizationId: 1,
        email: 'suspended.user@rezkfit.com',
        name: 'عضو موقوف مؤقتاً',
        role: 'Trainer',
        status: 'Suspended',
        joinedAt: '2026-02-01T00:00:00Z',
        teamIds: []
    }
];
