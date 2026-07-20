export const exerciseCategories = [
    {
        id: "gym",
        name: "تمارين الجيم",
        description: "تمارين القوة والمقاومة",
        color: "bg-blue-500",
        exercises: [
            {
                id: 1,
                name: "تمرين الصدر بالدامبل",
                duration: "45 دقيقة",
                difficulty: "متوسط",
                participants: 12,
                sets: "4 مجموعات × 12 تكرار",
                image: "💪"
            },
            {
                id: 2,
                name: "تمرين الظهر بالبار",
                duration: "50 دقيقة",
                difficulty: "متقدم",
                participants: 8,
                sets: "5 مجموعات × 10 تكرار",
                image: "🏋️"
            },
            {
                id: 3,
                name: "تمرين الأرجل السكوات",
                duration: "40 دقيقة",
                difficulty: "مبتدئ",
                participants: 15,
                sets: "3 مجموعات × 15 تكرار",
                image: "🦵"
            }
        ]
    },
    {
        id: "cardio",
        name: "تمارين الكارديو",
        description: "تمارين القلب والأوعية الدموية",
        color: "bg-red-500",
        exercises: [
            {
                id: 4,
                name: "الجري على الآلة",
                duration: "30 دقيقة",
                difficulty: "مبتدئ",
                participants: 20,
                sets: "مستمر لمدة 30 دقيقة",
                image: "🏃"
            },
            {
                id: 5,
                name: "تمرين HIIT",
                duration: "25 دقيقة",
                difficulty: "متقدم",
                participants: 10,
                sets: "8 دورات × 30 ثانية",
                image: "⚡"
            }
        ]
    },
    {
        id: "flexibility",
        name: "تمارين المرونة",
        description: "تمارين الإطالة واليوجا",
        color: "bg-green-500",
        exercises: [
            {
                id: 6,
                name: "يوجا الصباح",
                duration: "60 دقيقة",
                difficulty: "مبتدئ",
                participants: 25,
                sets: "15 وضعية مختلفة",
                image: "🧘"
            },
            {
                id: 7,
                name: "تمارين الإطالة",
                duration: "20 دقيقة",
                difficulty: "مبتدئ",
                participants: 30,
                sets: "10 تمارين إطالة",
                image: "🤸"
            }
        ]
    }
];
export default exerciseCategories;
