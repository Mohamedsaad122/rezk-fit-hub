export const aiPromptsMock = [
    {
        id: 1,
        name: 'مولد النظام الغذائي المخصص',
        category: 'Nutrition',
        templateText: 'صمم نظاماً غذائياً للمتدرب {name}، البالغ من العمر {age} عاماً بوزن {weight} كجم وهدف {goal}.',
        variables: ['name', 'age', 'weight', 'goal']
    },
    {
        id: 2,
        name: 'محلل تقدم الأداء المطور',
        category: 'Workout',
        templateText: 'حلل أداء التمارين الأخيرة لـ {name} مع هدف {goal}، واقترح تعديلات على الأوزان والتكرارات.',
        variables: ['name', 'goal']
    }
];
