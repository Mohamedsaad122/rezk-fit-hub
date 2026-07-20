export const notificationsMock = [
    {
        id: 1,
        title: "تم تعيين برنامج تمارين جديد",
        description: "تم تعيين جدول تمارين الحديد الشامل للمتدربة سارة أحمد.",
        type: "Workout Assigned",
        priority: "Normal",
        status: "Unread",
        createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 mins ago
        readAt: null,
        actionUrl: "/clients/1",
        clientId: 1,
        icon: "💪",
        color: "purple"
    },
    {
        id: 2,
        title: "موعد جلسة تدريب قادمة",
        description: "تذكير: جلسة تدريب شخصي مع المتدرب محمد علي تبدأ بعد 15 دقيقة.",
        type: "Appointment Reminder",
        priority: "High",
        status: "Unread",
        createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 mins ago
        readAt: null,
        actionUrl: "/calendar",
        clientId: 2,
        icon: "📅",
        color: "blue"
    },
    {
        id: 3,
        title: "تحديث الخطة الغذائية",
        description: "تم تعيين خطة طعام منخفضة الكربوهيدرات للمتدرب أحمد خالد.",
        type: "Nutrition Assigned",
        priority: "Normal",
        status: "Unread",
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
        readAt: null,
        actionUrl: "/clients/4",
        clientId: 4,
        icon: "🍎",
        color: "orange"
    },
    {
        id: 4,
        title: "تحقيق هدف الوزن",
        description: "تهانينا! حققت المتدربة فاطمة حسن هدفها الأسبوعي ووصلت إلى 62.3 كجم.",
        type: "Goal Achieved",
        priority: "High",
        status: "Read",
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
        readAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        actionUrl: "/clients/3",
        clientId: 3,
        icon: "🏆",
        color: "amber"
    },
    {
        id: 5,
        title: "إلغاء موعد الجلسة",
        description: "تم إلغاء جلسة الاستشارة الغذائية مع المتدربة نورا سامي.",
        type: "Appointment Cancelled",
        priority: "Critical",
        status: "Unread",
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
        readAt: null,
        actionUrl: "/calendar",
        clientId: 5,
        icon: "❌",
        color: "red"
    },
    {
        id: 6,
        title: "إشعار من الإدارة",
        description: "تمت صيانة النظام بنجاح وتفعيل واجهة التنبيهات المؤسسية.",
        type: "System Announcement",
        priority: "Low",
        status: "Archived",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        readAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
        actionUrl: null,
        clientId: null,
        icon: "📢",
        color: "rose"
    }
];

export default notificationsMock;
