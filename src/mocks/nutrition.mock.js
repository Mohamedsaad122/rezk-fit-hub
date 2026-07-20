export const nutritionPlans = [
    {
        id: 1,
        name: "برنامج بناء العضلات",
        description: "نظام غذائي مصمم لزيادة الكتلة العضلية",
        duration: "12 أسبوع",
        participants: 45,
        calories: 2800,
        image: "💪",
        macros: {
            protein: { value: 35, color: "bg-red-500" },
            carbs: { value: 45, color: "bg-yellow-500" },
            fats: { value: 20, color: "bg-blue-500" }
        },
        meals: [
            { name: "الإفطار", time: "07:00", calories: 650 },
            { name: "وجبة خفيفة", time: "10:00", calories: 300 },
            { name: "الغداء", time: "13:00", calories: 800 },
            { name: "ما قبل التمرين", time: "16:00", calories: 250 },
            { name: "ما بعد التمرين", time: "18:30", calories: 400 },
            { name: "العشاء", time: "20:00", calories: 400 }
        ]
    },
    {
        id: 2,
        name: "برنامج حرق الدهون",
        description: "نظام غذائي لخسارة الوزن والحفاظ على العضلات",
        duration: "8 أسابيع",
        participants: 62,
        calories: 1800,
        image: "🔥",
        macros: {
            protein: { value: 40, color: "bg-red-500" },
            carbs: { value: 30, color: "bg-yellow-500" },
            fats: { value: 30, color: "bg-blue-500" }
        },
        meals: [
            { name: "الإفطار", time: "07:00", calories: 400 },
            { name: "وجبة خفيفة", time: "10:00", calories: 200 },
            { name: "الغداء", time: "13:00", calories: 500 },
            { name: "وجبة خفيفة", time: "16:00", calories: 150 },
            { name: "العشاء", time: "19:00", calories: 450 },
            { name: "وجبة خفيفة", time: "21:00", calories: 100 }
        ]
    },
    {
        id: 3,
        name: "برنامج الرياضيين",
        description: "تغذية متخصصة للرياضيين المحترفين",
        duration: "16 أسبوع",
        participants: 28,
        calories: 3500,
        image: "🏆",
        macros: {
            protein: { value: 30, color: "bg-red-500" },
            carbs: { value: 50, color: "bg-yellow-500" },
            fats: { value: 20, color: "bg-blue-500" }
        },
        meals: [
            { name: "الإفطار المبكر", time: "06:00", calories: 600 },
            { name: "الإفطار الثاني", time: "08:30", calories: 500 },
            { name: "وجبة خفيفة", time: "11:00", calories: 300 },
            { name: "الغداء", time: "13:30", calories: 900 },
            { name: "ما قبل التمرين", time: "15:30", calories: 400 },
            { name: "ما بعد التمرين", time: "18:00", calories: 500 },
            { name: "العشاء", time: "20:00", calories: 300 }
        ]
    },
    {
        id: 4,
        name: "برنامج الصحة العامة",
        description: "نظام متوازن للحفاظ على الصحة العامة",
        duration: "مستمر",
        participants: 89,
        calories: 2200,
        image: "🌱",
        macros: {
            protein: { value: 25, color: "bg-red-500" },
            carbs: { value: 50, color: "bg-yellow-500" },
            fats: { value: 25, color: "bg-blue-500" }
        },
        meals: [
            { name: "الإفطار", time: "07:30", calories: 500 },
            { name: "وجبة خفيفة", time: "10:30", calories: 200 },
            { name: "الغداء", time: "13:00", calories: 700 },
            { name: "وجبة خفيفة", time: "16:00", calories: 200 },
            { name: "العشاء", time: "19:30", calories: 600 }
        ]
    }
];
export default nutritionPlans;
