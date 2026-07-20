export const webhooksMock = [
    {
        id: 1,
        tenantId: 1,
        url: 'https://api.external-gym.com/v1/webhook-receiver',
        events: ['INVOICE_GENERATED', 'INVOICE_PAID', 'MEMBER_JOINED'],
        secret: 'whsec_sh_111222333444',
        status: 'Active',
        createdAt: '2026-07-10T08:00:00Z'
    }
];

export const webhookLogsMock = [
    {
        id: 1,
        webhookId: 1,
        event: 'INVOICE_PAID',
        payload: { invoiceId: 1, amount: 1035 },
        status: 'Success',
        statusCode: 200,
        attempts: 1,
        errorMessage: null,
        timestamp: '2026-07-15T10:00:00Z'
    },
    {
        id: 2,
        webhookId: 1,
        event: 'MEMBER_JOINED',
        payload: { memberId: 3, name: 'ياسر محمد' },
        status: 'Failed',
        statusCode: 502,
        attempts: 3,
        errorMessage: 'Bad Gateway on external endpoint',
        timestamp: '2026-07-16T14:22:00Z'
    }
];
