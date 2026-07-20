export const DeveloperDocsService = {
    getRestDocs: () => {
        return [
            {
                method: 'GET',
                path: '/api/v1/clients',
                scope: 'clients:read',
                description: 'استرجاع قائمة المتدربين والعملاء النشطين للحساب المؤسسي'
            },
            {
                method: 'POST',
                path: '/api/v1/clients',
                scope: 'clients:write',
                description: 'إضافة عميل جديد وربطه بقسم التمارين والمهام التلقائية'
            },
            {
                method: 'GET',
                path: '/api/v1/tasks',
                scope: 'tasks:read',
                description: 'الاطلاع على قائمة مهام ومتابعة تدريبات العملاء'
            },
            {
                method: 'GET',
                path: '/api/v1/calendar',
                scope: 'calendar:read',
                description: 'استرجاع حصص التمارين اليومية والجداول الزمنية للفروع'
            }
        ];
    },

    getScopes: () => {
        return [
            { scope: 'clients:read', description: 'قراءة بيانات المتدربين والعملاء' },
            { scope: 'clients:write', description: 'إضافة وتعديل بيانات العملاء' },
            { scope: 'tasks:read', description: 'قراءة قائمة مهام المتابعة' },
            { scope: 'tasks:write', description: 'إضافة وتحديث المهام والخطط' },
            { scope: 'calendar:read', description: 'قراءة الجداول الزمنية والحصص' }
        ];
    }
};

export default DeveloperDocsService;
