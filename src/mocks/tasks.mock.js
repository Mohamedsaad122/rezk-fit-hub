export const tasksMock = [
    {
        id: 1,
        title: "متابعة الالتزام بالخطة الغذائية",
        description: "مراجعة وجبات الأسبوع وتعديل السعرات الحرارية للمتدربة سارة أحمد.",
        clientId: 1,
        appointmentId: null,
        assignedTo: "Coach",
        priority: "Medium",
        status: "Todo",
        category: "Nutrition",
        startDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +2 days
        completedAt: null,
        estimatedMinutes: 30,
        actualMinutes: 0,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 2,
        title: "إجراء التقييم البدني الدوري",
        description: "قياس الوزن، ونسبة الدهون، وحساب مؤشر كتلة الجسم BMI للمتدرب محمد علي.",
        clientId: 2,
        appointmentId: null,
        assignedTo: "Coach",
        priority: "High",
        status: "In Progress",
        category: "Assessment",
        startDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +1 day
        completedAt: null,
        estimatedMinutes: 45,
        actualMinutes: 15,
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 3,
        title: "إعداد برنامج تمارين الحديد الشامل",
        description: "تصميم برنامج دفع-سحب-أرجل مخصص لزيادة الكتلة العضلية للمتدربة فاطمة حسن.",
        clientId: 3,
        appointmentId: null,
        assignedTo: "Coach",
        priority: "Critical",
        status: "Overdue",
        category: "Workout",
        startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // yesterday
        completedAt: null,
        estimatedMinutes: 60,
        actualMinutes: 0,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 4,
        title: "مكالمة هاتفية دورية للمتابعة",
        description: "الاتصال بالمتدرب أحمد خالد لمعرفة مدى رضاه وسير البرنامج الرياضي.",
        clientId: 4,
        appointmentId: null,
        assignedTo: "Coach",
        priority: "Low",
        status: "Completed",
        category: "Phone Call",
        startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedMinutes: 15,
        actualMinutes: 20,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 5,
        title: "اجتماع مناقشة وتحديد الأهداف",
        description: "عقد لقاء مع المدراء وأعضاء الفريق لمناقشة أداء الربع الحالي وتطوير ميزات النظام.",
        clientId: null,
        appointmentId: null,
        assignedTo: "Admin",
        priority: "Medium",
        status: "Todo",
        category: "Meeting",
        startDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +5 days
        completedAt: null,
        estimatedMinutes: 90,
        actualMinutes: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

export default tasksMock;
