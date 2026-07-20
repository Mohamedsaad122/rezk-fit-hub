export const mockClientGrowth = [
    { name: 'يناير', clients: 40 },
    { name: 'فبراير', clients: 45 },
    { name: 'مارس', clients: 58 },
    { name: 'أبريل', clients: 70 },
    { name: 'مايو', clients: 72 },
    { name: 'يونيو', clients: 85 },
    { name: 'يوليو', clients: 95 }
];

export const mockRevenue = [
    { name: 'يناير', revenue: 5000 },
    { name: 'فبراير', revenue: 5800 },
    { name: 'مارس', revenue: 7500 },
    { name: 'أبريل', revenue: 9000 },
    { name: 'مايو', revenue: 9400 },
    { name: 'يونيو', revenue: 11200 },
    { name: 'يوليو', revenue: 12500 }
];

export const mockTaskCompletion = [
    { name: 'الأسبوع 1', completed: 12, pending: 4 },
    { name: 'الأسبوع 2', completed: 18, pending: 3 },
    { name: 'الأسبوع 3', completed: 15, pending: 6 },
    { name: 'الأسبوع 4', completed: 22, pending: 2 }
];

export const mockWorkoutDistribution = [
    { name: 'قوة بدنية', value: 45, color: '#3b82f6' },
    { name: 'كارديو وتنحيف', value: 25, color: '#10b981' },
    { name: 'فتنس ومرونة', value: 15, color: '#f59e0b' },
    { name: 'تحمل وعضلات', value: 15, color: '#8b5cf6' }
];

export const mockNutritionCompliance = [
    { name: 'الأسبوع 1', compliance: 75 },
    { name: 'الأسبوع 2', compliance: 80 },
    { name: 'الأسبوع 3', compliance: 82 },
    { name: 'الأسبوع 4', compliance: 88 }
];

export const mockAttendance = [
    { name: 'الأحد', attendance: 90 },
    { name: 'الاثنين', attendance: 85 },
    { name: 'الثلاثاء', attendance: 88 },
    { name: 'الأربعاء', attendance: 94 },
    { name: 'الخميس', attendance: 82 },
    { name: 'الجمعة', attendance: 60 },
    { name: 'السبت', attendance: 75 }
];

export const mockTopPerformers = {
    topClients: [
        { id: 1, name: 'سارة أحمد', score: '98%', detail: 'فئة تمارين القوة' },
        { id: 2, name: 'محمد علي', score: '92%', detail: 'فئة التحمل' },
        { id: 3, name: 'فاطمة حسن', score: '88%', detail: 'فئة اللياقة' }
    ],
    topCoaches: [
        { id: 1, name: 'الكوتش أحمد', score: '96%', detail: '24 متدرب نشط' },
        { id: 2, name: 'الكوتش محمد', score: '90%', detail: '18 متدرب نشط' }
    ],
    mostActiveClients: [
        { id: 1, name: 'أحمد خالد', score: '28 جلسة', detail: 'هذا الشهر' },
        { id: 4, name: 'سارة أحمد', score: '24 جلسة', detail: 'هذا الشهر' }
    ],
    mostCompletedTasks: [
        { id: 1, name: 'سارة أحمد', score: '15 مهمة', detail: 'اكتملت بالكامل' },
        { id: 2, name: 'محمد علي', score: '12 مهمة', detail: 'اكتملت بالكامل' }
    ],
    bestWorkoutPrograms: [
        { id: 1, name: 'برنامج الحديد الشامل', score: '92%', detail: 'معدل رضا المتدربين' },
        { id: 2, name: 'برنامج حرق الدهون السريع', score: '88%', detail: 'معدل رضا المتدربين' }
    ],
    bestNutritionPlans: [
        { id: 1, name: 'نظام عالي البروتين', score: '95%', detail: 'معدل التزام ممتاز' },
        { id: 2, name: 'نظام الصيام المتقطع', score: '85%', detail: 'معدل التزام متوسط' }
    ]
};

export default {
    mockClientGrowth,
    mockRevenue,
    mockTaskCompletion,
    mockWorkoutDistribution,
    mockNutritionCompliance,
    mockAttendance,
    mockTopPerformers
};
