export const initialAuditLogs = [
    {
        id: 1,
        action: "User Login",
        entity: "Authentication",
        user: "أحمد عبد الله",
        date: "2026-07-14T22:30:00.000Z",
        ip: "192.168.1.10",
        device: "Chrome / Windows 11",
        status: "Success",
        details: "تسجيل دخول ناجح للمشرف العام أحمد عبد الله"
    },
    {
        id: 2,
        action: "Client Created",
        entity: "Clients",
        user: "خالد منصور",
        date: "2026-07-14T21:00:00.000Z",
        ip: "192.168.1.15",
        device: "Safari / macOS",
        status: "Success",
        details: "تم تسجيل متدرب جديد: 'سارة أحمد' بنجاح"
    },
    {
        id: 3,
        action: "Appointment Updated",
        entity: "Calendar",
        user: "كابتن سارة علي",
        date: "2026-07-14T20:15:00.000Z",
        ip: "192.168.1.22",
        device: "Chrome / Android",
        status: "Success",
        details: "تعديل موعد الجلسة التدريبية للمتدربة سارة أحمد"
    },
    {
        id: 4,
        action: "Document Uploaded",
        entity: "Documents",
        user: "د. رانيا حسن",
        date: "2026-07-14T18:05:00.000Z",
        ip: "192.168.1.5",
        device: "Firefox / Windows 10",
        status: "Success",
        details: "تم رفع تقرير طبي جديد للمتدرب محمد علي"
    },
    {
        id: 5,
        action: "Role Changed",
        entity: "RBAC",
        user: "أحمد عبد الله",
        date: "2026-07-14T15:30:00.000Z",
        ip: "192.168.1.10",
        device: "Chrome / Windows 11",
        status: "Success",
        details: "تغيير صلاحيات دور الكوتش (Coach): تفعيل صلاحيات التصدير والتقارير"
    }
];

export default initialAuditLogs;
