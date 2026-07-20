export const invitationsMock = [
    {
        id: 1,
        tenantId: 1,
        organizationId: 1,
        email: 'invitee1@rezkfit.com',
        role: 'Coach',
        status: 'Pending',
        sentAt: '2026-07-15T12:00:00Z',
        token: 'TOKEN_INVITE_1'
    },
    {
        id: 2,
        tenantId: 1,
        organizationId: 1,
        email: 'invitee2@rezkfit.com',
        role: 'Nutritionist',
        status: 'Accepted',
        sentAt: '2026-07-16T14:00:00Z',
        token: 'TOKEN_INVITE_2'
    },
    {
        id: 3,
        tenantId: 1,
        organizationId: 1,
        email: 'invitee3@rezkfit.com',
        role: 'Viewer',
        status: 'Declined',
        sentAt: '2026-07-17T09:00:00Z',
        token: 'TOKEN_INVITE_3'
    }
];
