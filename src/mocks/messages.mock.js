export const initialConversations = [
    {
        id: 1,
        clientId: 1,
        clientName: "سارة أحمد",
        clientAvatar: "👩",
        lastMessage: "شكراً كوتش، سأبدأ بالخطة غداً",
        lastMessageAt: "2026-07-14T02:00:00Z",
        unreadCount: 0,
        isPinned: true,
        isArchived: false,
        status: "online",
        typing: false
    },
    {
        id: 2,
        clientId: 2,
        clientName: "محمد علي",
        clientAvatar: "👨",
        lastMessage: "هل يمكنني استبدال وجبة الشوفان؟",
        lastMessageAt: "2026-07-13T18:30:00Z",
        unreadCount: 2,
        isPinned: false,
        isArchived: false,
        status: "offline",
        typing: false
    },
    {
        id: 3,
        clientId: 3,
        clientName: "فاطمة حسن",
        clientAvatar: "👩",
        lastMessage: "تم تأكيد موعد جلسة التقييم البدني",
        lastMessageAt: "2026-07-12T10:15:00Z",
        unreadCount: 0,
        isPinned: false,
        isArchived: false,
        status: "online",
        typing: true
    }
];

export const initialMessages = [
    {
        id: 1,
        conversationId: 1,
        sender: "Coach",
        text: "مرحباً سارة، كيف تشعرين بعد تمرين اليوم؟",
        timestamp: "2026-07-14T01:45:00Z",
        read: true
    },
    {
        id: 2,
        conversationId: 1,
        sender: "Client",
        text: "مرحباً كوتش! التمرين كان ممتازاً وشعرت بنشاط كبير.",
        timestamp: "2026-07-14T01:50:00Z",
        read: true
    },
    {
        id: 3,
        conversationId: 1,
        sender: "Coach",
        text: "ممتاز جداً! تذكري شرب كميات كافية من الماء والالتزام بوجبة الاستشفاء العضلية.",
        timestamp: "2026-07-14T01:55:00Z",
        read: true
    },
    {
        id: 4,
        conversationId: 1,
        sender: "Client",
        text: "شكراً كوتش، سأبدأ بالخطة غداً",
        timestamp: "2026-07-14T02:00:00Z",
        read: true
    },
    
    // Conversation 2
    {
        id: 5,
        conversationId: 2,
        sender: "Coach",
        text: "محمد، هل قمت بقياس الوزن هذا الأسبوع؟",
        timestamp: "2026-07-13T18:10:00Z",
        read: true
    },
    {
        id: 6,
        conversationId: 2,
        sender: "Client",
        text: "نعم كوتش، الوزن الحالي 88.0 كجم.",
        timestamp: "2026-07-13T18:20:00Z",
        read: true
    },
    {
        id: 7,
        conversationId: 2,
        sender: "Client",
        text: "هل يمكنني استبدال وجبة الشوفان؟",
        timestamp: "2026-07-13T18:30:00Z",
        read: false
    },
    
    // Conversation 3
    {
        id: 8,
        conversationId: 3,
        sender: "System",
        text: "تنبيه نظام: تم جدولة جلسة تقييم بدني جديدة بتاريخ 2026-07-15",
        timestamp: "2026-07-12T10:00:00Z",
        read: true
    },
    {
        id: 9,
        conversationId: 3,
        sender: "Client",
        text: "تم تأكيد موعد جلسة التقييم البدني",
        timestamp: "2026-07-12T10:15:00Z",
        read: true
    }
];

export default {
    initialConversations,
    initialMessages
};
