export const integrationsMock = [
    {
        id: 1,
        tenantId: 1,
        name: 'مزامنة جوجل كلندر للتمارين والمواعيد',
        type: 'Calendar',
        provider: 'Google Calendar',
        status: 'Connected',
        lastSync: '2026-07-17T12:00:00Z',
        healthScore: 98
    },
    {
        id: 2,
        tenantId: 1,
        name: 'التخزين السحابي AWS S3 للمرفقات والمستندات',
        type: 'Storage',
        provider: 'AWS S3',
        status: 'Connected',
        lastSync: '2026-07-17T14:30:00Z',
        healthScore: 100
    },
    {
        id: 3,
        tenantId: 1,
        name: 'خادم رسائل Twilio وتأكيد الحضور',
        type: 'SMS',
        provider: 'Twilio',
        status: 'Connected',
        lastSync: '2026-07-17T10:15:00Z',
        healthScore: 95
    }
];
