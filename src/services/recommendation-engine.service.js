import { AIInsightsRepository } from '@/repositories/ai-insights.repository';
import { AIService } from '@/services/ai.service';
import { PromptBuilderService } from '@/services/prompt-builder.service';

export const RecommendationEngineService = {
    assessClientRisk: async (clientId, clientName, attendanceRate, completedTasksRate) => {
        try {
            let riskScore = 100 - (attendanceRate * 0.6 + completedTasksRate * 0.4);
            riskScore = Math.max(0, Math.min(100, Math.round(riskScore)));

            let riskLevel = 'Low';
            let indicators = [];
            let mitigationStrategy = 'الاستمرار في الخطة التدريبية المعتادة ومكافأة المتدرب على تميزه.';

            if (riskScore >= 75) {
                riskLevel = 'Critical';
                indicators = ['غياب متكرر لأكثر من 14 يوماً متواصلة', 'عدم إتمام أي مهمة غذائية أو رياضية'];
                mitigationStrategy = 'جدولة اتصال هاتفي عاجل ومراجعة أسباب التعثر وتعديل النظام الغذائي للتسهيل.';
            } else if (riskScore >= 50) {
                riskLevel = 'High';
                indicators = ['انخفاض نسبة الحضور إلى أقل من 50%', 'تراجع إكمال المهام بنسبة 40%'];
                mitigationStrategy = 'إرسال رسالة تشجيعية عبر التطبيق وجدولة جلسة قياس أداء مجانية.';
            } else if (riskScore >= 25) {
                riskLevel = 'Medium';
                indicators = ['تأخر طفيف في تسجيل الالتزام اليومي', 'تفويت حصة تدريبية واحدة'];
                mitigationStrategy = 'إرسال تنبيه تذكيري لطيف وإعادة هيكلة جدول المواعيد.';
            }

            const prompt = `قيم حالة المتدرب ${clientName} الذي تبلغ نسبة التزامه بالحضور ${attendanceRate}% وإكمال المهام ${completedTasksRate}%`;
            const systemPrompt = PromptBuilderService.buildSystemPrompt('Insights');
            const analysisText = await AIService.generateText(prompt, systemPrompt);

            const newInsight = await AIInsightsRepository.createInsight({
                type: 'Risk',
                title: `تقييم مخاطر انسحاب المتدرب: ${clientName}`,
                content: `مستوى الخطورة: ${riskLevel} (${riskScore}%). مؤشرات: ${indicators.join('، ')}. التحليل: ${analysisText}`,
                score: riskScore,
                recommendedActions: [mitigationStrategy, 'جدولة موعد مراجعة']
            });

            return {
                clientId,
                clientName,
                riskScore,
                riskLevel,
                indicators,
                mitigationStrategy,
                insightId: newInsight.id
            };
        } catch (error) {
            console.error('Error assessing client risk:', error);
            throw error;
        }
    },

    suggestAppointments: async (clientId, historyLogs = []) => {
        try {
            const prompt = `اقترح مواعيد حصص تدريبية جديدة بناءً على كشف التزام المتدرب وتكرار الجلسات السابقة: ${JSON.stringify(historyLogs)}`;
            const systemPrompt = PromptBuilderService.buildSystemPrompt('Coach');
            const suggestion = await AIService.generateText(prompt, systemPrompt);

            return {
                clientId,
                suggestedSlots: ['الاثنين 4:00 مساءً', 'الخميس 6:00 مساءً'],
                reason: suggestion
            };
        } catch (error) {
            console.error('Error suggesting appointments:', error);
            throw error;
        }
    }
};

export default RecommendationEngineService;
