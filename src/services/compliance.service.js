export const ComplianceService = {
    getComplianceStatus: async () => {
        return {
            soc2: {
                status: 'Compliant',
                score: 95,
                checks: [
                    { title: 'تمكين تشفير البيانات أثناء الحفظ والعمليات (Data-at-rest)', pass: true },
                    { title: 'تسجيل عمليات المطورين وسجلات الولوج الأمنية (Security Logs)', pass: true },
                    { title: 'سياسة حماية حدود الاستهلاك وحظر Brute Force', pass: true }
                ]
            },
            iso27001: {
                status: 'Compliant',
                score: 100,
                checks: [
                    { title: 'إدارة مفاتيح الوصول وإجبار تدوير الأسرار (Keys Rotation)', pass: true },
                    { title: 'استخدام المصادقة الثنائية لجميع حسابات المسؤولين (MFA)', pass: true },
                    { title: 'مراجعة الأجهزة الموثوقة وإلغاء الجلسات النشطة', pass: true }
                ]
            },
            gdpr: {
                status: 'Compliant',
                score: 90,
                checks: [
                    { title: 'حق النسيان وتطهير السجلات الشخصية للمتدربين', pass: true },
                    { title: 'تشفير البيانات الحساسة (عناوين IP والأسماء)', pass: true },
                    { title: 'الحصول على موافقات ملفات تعريف الارتباط Cookies', pass: true }
                ]
            }
        };
    },

    getSecurityHeaders: () => {
        return {
            'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
            'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline';",
            'X-Frame-Options': 'DENY',
            'X-Content-Type-Options': 'nosniff',
            'Referrer-Policy': 'strict-origin-when-cross-origin'
        };
    }
};

export default ComplianceService;
