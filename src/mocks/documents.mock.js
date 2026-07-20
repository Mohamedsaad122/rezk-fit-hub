export const documentsMock = [
    {
        id: 1,
        name: "تقرير التحاليل الطبية - سارة أحمد.pdf",
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        extension: "pdf",
        size: 245670, // ~240KB
        owner: "Coach",
        category: "Medical Reports",
        tags: ["صحي", "تحاليل", "بداية"],
        isFavorite: true,
        isArchived: false,
        versions: [
            { version: 1, url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", size: 245670, updatedAt: "2026-06-01T10:00:00.000Z", updatedBy: "Coach" }
        ],
        clientId: 1,
        appointmentId: null,
        taskId: null,
        createdAt: "2026-06-01T10:00:00.000Z",
        updatedAt: "2026-06-01T10:00:00.000Z"
    },
    {
        id: 2,
        name: "خطة التغذية - يوليو 2026.pdf",
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        extension: "pdf",
        size: 154800, // ~150KB
        owner: "Coach",
        category: "Nutrition PDFs",
        tags: ["دايت", "يوليو", "بروتين"],
        isFavorite: false,
        isArchived: false,
        versions: [
            { version: 1, url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", size: 154800, updatedAt: "2026-07-01T08:30:00.000Z", updatedBy: "Coach" }
        ],
        clientId: 1,
        appointmentId: 1,
        taskId: 1,
        createdAt: "2026-07-01T08:30:00.000Z",
        updatedAt: "2026-07-01T08:30:00.000Z"
    },
    {
        id: 3,
        name: "صورة التقدم البدني - الأسبوع الرابع.jpg",
        url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&q=80",
        extension: "jpg",
        size: 890400, // ~870KB
        owner: "Client",
        category: "Progress Photos",
        tags: ["تقدم", "الأسبوع 4", "عضلات"],
        isFavorite: true,
        isArchived: false,
        versions: [
            { version: 1, url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&q=80", size: 890400, updatedAt: "2026-06-28T18:00:00.000Z", updatedBy: "Client" }
        ],
        clientId: 1,
        appointmentId: null,
        taskId: null,
        createdAt: "2026-06-28T18:00:00.000Z",
        updatedAt: "2026-06-28T18:00:00.000Z"
    },
    {
        id: 4,
        name: "قياسات الجسم والوزن.xlsx",
        url: "https://example.com/files/measurements.xlsx",
        extension: "xlsx",
        size: 45600, // ~45KB
        owner: "Coach",
        category: "Measurements Files",
        tags: ["قياسات", "تطور", "اكسل"],
        isFavorite: false,
        isArchived: false,
        versions: [
            { version: 2, url: "https://example.com/files/measurements_v2.xlsx", size: 45600, updatedAt: "2026-07-10T11:20:00.000Z", updatedBy: "Coach" },
            { version: 1, url: "https://example.com/files/measurements_v1.xlsx", size: 42000, updatedAt: "2026-06-10T09:00:00.000Z", updatedBy: "Coach" }
        ],
        clientId: 2,
        appointmentId: null,
        taskId: null,
        createdAt: "2026-06-10T09:00:00.000Z",
        updatedAt: "2026-07-10T11:20:00.000Z"
    },
    {
        id: 5,
        name: "برنامج تدريبات المقاومة الشامل.docx",
        url: "https://example.com/files/workout_plan.docx",
        extension: "docx",
        size: 112000, // ~110KB
        owner: "Coach",
        category: "Workout PDFs",
        tags: ["تمارين", "مقاومة", "خطة"],
        isFavorite: true,
        isArchived: false,
        versions: [
            { version: 1, url: "https://example.com/files/workout_plan.docx", size: 112000, updatedAt: "2026-07-02T14:15:00.000Z", updatedBy: "Coach" }
        ],
        clientId: 2,
        appointmentId: null,
        taskId: null,
        createdAt: "2026-07-02T14:15:00.000Z",
        updatedAt: "2026-07-02T14:15:00.000Z"
    },
    {
        id: 6,
        name: "جدول المكملات والجرعات اليومية.csv",
        url: "https://example.com/files/supplements.csv",
        extension: "csv",
        size: 12500, // ~12KB
        owner: "Coach",
        category: "Other",
        tags: ["مكملات", "فيتامينات"],
        isFavorite: false,
        isArchived: false,
        versions: [
            { version: 1, url: "https://example.com/files/supplements.csv", size: 12500, updatedAt: "2026-07-05T09:30:00.000Z", updatedBy: "Coach" }
        ],
        clientId: 3,
        appointmentId: null,
        taskId: null,
        createdAt: "2026-07-05T09:30:00.000Z",
        updatedAt: "2026-07-05T09:30:00.000Z"
    },
    {
        id: 7,
        name: "أرشيف ملفات الاشتراك القديمة.zip",
        url: "https://example.com/files/old_contracts.zip",
        extension: "zip",
        size: 5670800, // ~5.4MB
        owner: "Admin",
        category: "Other",
        tags: ["اشتراكات", "أرشيف"],
        isFavorite: false,
        isArchived: true,
        versions: [
            { version: 1, url: "https://example.com/files/old_contracts.zip", size: 5670800, updatedAt: "2025-12-15T15:00:00.000Z", updatedBy: "Admin" }
        ],
        clientId: null,
        appointmentId: null,
        taskId: null,
        createdAt: "2025-12-15T15:00:00.000Z",
        updatedAt: "2025-12-15T15:00:00.000Z"
    },
    {
        id: 8,
        name: "فيديو توضيحي لتمارين السكوات.mp4",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        extension: "mp4",
        size: 15480000, // ~14.7MB
        owner: "Coach",
        category: "Videos",
        tags: ["سكوات", "تعليمي", "فيديو"],
        isFavorite: false,
        isArchived: false,
        versions: [
            { version: 1, url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", size: 15480000, updatedAt: "2026-07-08T16:40:00.000Z", updatedBy: "Coach" }
        ],
        clientId: null,
        appointmentId: null,
        taskId: null,
        createdAt: "2026-07-08T16:40:00.000Z",
        updatedAt: "2026-07-08T16:40:00.000Z"
    },
    {
        id: 9,
        name: "تعليمات صوتية لبرنامج الكارديو.mp3",
        url: "https://example.com/files/cardio_instructions.mp3",
        extension: "mp3",
        size: 3450000, // ~3.3MB
        owner: "Coach",
        category: "Audio",
        tags: ["كارديو", "صوتي", "تعليمات"],
        isFavorite: false,
        isArchived: false,
        versions: [
            { version: 1, url: "https://example.com/files/cardio_instructions.mp3", size: 3450000, updatedAt: "2026-07-09T07:10:00.000Z", updatedBy: "Coach" }
        ],
        clientId: 4,
        appointmentId: null,
        taskId: null,
        createdAt: "2026-07-09T07:10:00.000Z",
        updatedAt: "2026-07-09T07:10:00.000Z"
    }
];

export default documentsMock;
