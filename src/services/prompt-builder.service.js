export const PromptBuilderService = {
    compile: (templateText, variables = {}) => {
        let compiled = templateText;
        Object.keys(variables).forEach(key => {
            compiled = compiled.replace(new RegExp(`{${key}}`, 'g'), variables[key]);
        });
        return compiled;
    },

    buildSystemPrompt: (assistantType) => {
        switch (assistantType) {
            case 'Coach':
                return 'أنت مساعد تدريب رياضي خبير في المساعدة بجدولة التمارين وتحليل تقدم الأداء للمتدربين.';
            case 'Nutrition':
                return 'أنت أخصائي تغذية رياضية معتمد ومستشار تخطيط الوجبات وحساب السعرات الحرارية.';
            case 'Insights':
                return 'أنت خبير تحليل بيانات وسلوكيات المتدربين وتقييم التزامهم ومخاطر توقفهم عن ممارسة الرياضة.';
            default:
                return 'أنت مساعد ذكي مخصص لمنصة Rezk Fit Hub الرياضية.';
        }
    }
};

export default PromptBuilderService;
