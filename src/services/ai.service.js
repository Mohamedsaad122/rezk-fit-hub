export const AIService = {
    config: {
        activeProvider: 'Mock',
        modelName: 'gpt-4o',
        temperature: 0.7
    },

    setProviderConfig: (newConfig) => {
        AIService.config = { ...AIService.config, ...newConfig };
    },

    getProviderConfig: () => AIService.config,

    generateText: async (prompt, systemPrompt = '') => {
        const provider = AIService.config.activeProvider;
        const temp = AIService.config.temperature;

        switch (provider) {
            case 'OpenAI':
                return `[OpenAI ${AIService.config.modelName} (temp: ${temp})]: ${prompt}`;
            case 'AzureOpenAI':
                return `[AzureOpenAI]: ${prompt}`;
            case 'Claude':
                return `[Claude]: ${prompt}`;
            case 'Gemini':
                return `[Gemini]: ${prompt}`;
            case 'DeepSeek':
                return `[DeepSeek]: ${prompt}`;
            case 'Ollama':
                return `[Local Ollama]: ${prompt}`;
            case 'Mock':
            default:
                if (prompt.toLowerCase().includes('chest') || prompt.toLowerCase().includes('workout')) {
                    return 'خطة التمرين المقترحة: 4 جولات تمرين بنش مسطح، 3 جولات رفرفة جانبي.';
                }
                if (prompt.toLowerCase().includes('meal') || prompt.toLowerCase().includes('nutrition') || prompt.toLowerCase().includes('diet')) {
                    return 'خطة الوجبات المقترحة: وجبة 1: شوفان مع الموز والبروتين. وجبة 2: صدر دجاج مع الأرز البسمتي وسلطة خضراء.';
                }
                return `[Mock AI Response for]: ${prompt}`;
        }
    },

    generateJSON: async (prompt, schema, systemPrompt = '') => {
        const responseText = await AIService.generateText(prompt, systemPrompt);
        
        if (prompt.toLowerCase().includes('workout') || prompt.toLowerCase().includes('exercises') || prompt.includes('تمرين') || prompt.includes('رياضي') || prompt.includes('عضلات')) {
            return {
                name: 'خطة القوة والتحمل للمحترفين',
                exercises: [
                    { name: 'بنش برس مسطح (Bench Press)', sets: 4, reps: '8-12', restSeconds: 90 },
                    { name: 'ضغط أكتاف بالدمبل (Shoulder Press)', sets: 3, reps: '10-12', restSeconds: 75 }
                ],
                durationMinutes: 45,
                targetMuscleGroup: 'Chest & Shoulders',
                notes: 'احرص على الإحماء الجيد قبل البدء بالتمارين الثقيلة.'
            };
        }

        if (prompt.toLowerCase().includes('nutrition') || prompt.toLowerCase().includes('meal') || prompt.toLowerCase().includes('diet') || prompt.includes('وجبات') || prompt.includes('غذاء') || prompt.includes('طعام') || prompt.includes('غذائي')) {
            return {
                meals: [
                    { name: 'وجبة الإفطار الرياضية', ingredients: ['شوفان 80 جرام', 'حليب خالي الدسم 200 مل', 'سكوب بروتين'], calories: 450, macros: { protein: 35, carbs: 55, fats: 8 } },
                    { name: 'وجبة الغداء المتكاملة', ingredients: ['صدر دجاج مشوي 150 جرام', 'أرز أبيض مطبوخ 150 جرام', 'زيت زيتون ملعقة صغيرة'], calories: 550, macros: { protein: 42, carbs: 60, fats: 10 } }
                ],
                advice: 'اشرب ما لا يقل عن 3 لترات من الماء يومياً للمساعدة في الاستشفاء العضلي.',
                dailyTarget: { calories: 2200, protein: 150, carbs: 250, fats: 60 }
            };
        }

        return {
            analysis: `تحليل مالي وفني للمؤشرات: ${responseText}`,
            suggestions: ['جدولة اتصال للمتابعة', 'تحديث خطة التمرين'],
            timestamp: new Date().toISOString()
        };
    },

    streamText: async (prompt, onChunk, systemPrompt = '') => {
        const fullResponse = await AIService.generateText(prompt, systemPrompt);
        const words = fullResponse.split(' ');
        
        for (let i = 0; i < words.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 30));
            onChunk(words[i] + ' ');
        }
        return fullResponse;
    }
};

export default AIService;
