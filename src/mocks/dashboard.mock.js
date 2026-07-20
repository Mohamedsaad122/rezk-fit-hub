import { Users, Dumbbell, Apple, Trophy } from "lucide-react";

export const stats = [
    {
        title: "إجمالي المتدربين",
        value: "247",
        change: "+12%",
        trend: "up",
        icon: Users,
        color: "text-blue-600",
        bgColor: "bg-blue-100 dark:bg-blue-900/30"
    },
    {
        title: "التمارين النشطة",
        value: "45",
        change: "+8%",
        trend: "up",
        icon: Dumbbell,
        color: "text-green-600",
        bgColor: "bg-green-100 dark:bg-green-900/30"
    },
    {
        title: "الأنظمة الغذائية",
        value: "28",
        change: "+5%",
        trend: "up",
        icon: Apple,
        color: "text-orange-600",
        bgColor: "bg-orange-100 dark:bg-orange-900/30"
    },
    {
        title: "معدل الإنجاز",
        value: "89%",
        change: "+3%",
        trend: "up",
        icon: Trophy,
        color: "text-purple-600",
        bgColor: "bg-purple-100 dark:bg-purple-900/30"
    }
];

export const recentActivities = [
    {
        id: 1,
        type: "تمرين جديد",
        description: "تم إضافة تمرين 'تقوية عضلات الكور'",
        time: "منذ ساعتين",
        icon: Dumbbell,
        color: "text-blue-500"
    },
    {
        id: 2,
        type: "متدرب جديد",
        description: "انضمام أحمد محمد إلى البرنامج التدريبي",
        time: "منذ 3 ساعات",
        icon: Users,
        color: "text-green-500"
    },
    {
        id: 3,
        type: "نظام غذائي",
        description: "تحديث برنامج حرق الدهون",
        time: "منذ 5 ساعات",
        icon: Apple,
        color: "text-orange-500"
    },
    {
        id: 4,
        type: "إنجاز",
        description: "فاطمة أحمد حققت هدفها الشهري",
        time: "منذ يوم واحد",
        icon: Trophy,
        color: "text-purple-500"
    }
];

export const monthlyProgress = [
    { month: "يناير", trainees: 180, workouts: 520, nutrition: 85 },
    { month: "فبراير", trainees: 195, workouts: 580, nutrition: 88 },
    { month: "مارس", trainees: 210, workouts: 640, nutrition: 92 },
    { month: "أبريل", trainees: 225, workouts: 720, nutrition: 95 },
    { month: "مايو", trainees: 240, workouts: 800, nutrition: 89 },
    { month: "يونيو", trainees: 247, workouts: 850, nutrition: 94 }
];

export const topTrainees = [
    { name: "سارة أحمد", progress: 95, workouts: 28, streak: 15 },
    { name: "محمد علي", progress: 92, workouts: 26, streak: 12 },
    { name: "فاطمة حسن", progress: 89, workouts: 24, streak: 18 },
    { name: "أحمد خالد", progress: 87, workouts: 22, streak: 10 },
    { name: "نورا سامي", progress: 85, workouts: 25, streak: 14 }
];
