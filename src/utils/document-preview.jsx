import React from 'react';
import { getFileCategory } from './file-utils';

export const getDocumentPreviewContent = (document) => {
    if (!document) return null;
    const category = getFileCategory(document.extension);

    switch (category) {
        case 'Images':
            return (
                <div className="flex items-center justify-center p-4 bg-muted/20 rounded-xl border border-dashed h-[400px]">
                    <img 
                        src={document.url} 
                        alt={document.name} 
                        className="max-h-full max-w-full object-contain rounded-lg shadow-md"
                    />
                </div>
            );
        case 'PDF':
            return (
                <div className="w-full h-[500px] border rounded-xl overflow-hidden shadow-inner">
                    <iframe 
                        src={`${document.url}#toolbar=0`} 
                        title={document.name} 
                        className="w-full h-full"
                    />
                </div>
            );
        case 'Videos':
            return (
                <div className="flex items-center justify-center p-2 bg-black rounded-xl h-[400px]">
                    <video 
                        src={document.url} 
                        controls 
                        className="max-h-full max-w-full rounded-lg"
                    />
                </div>
            );
        case 'Audio':
            return (
                <div className="flex flex-col items-center justify-center p-10 bg-muted/20 rounded-xl border h-[250px] space-y-4">
                    <span className="text-5xl animate-bounce">🎵</span>
                    <p className="font-semibold text-sm truncate max-w-xs">{document.name}</p>
                    <audio 
                        src={document.url} 
                        controls 
                        className="w-full max-w-md"
                    />
                </div>
            );
        case 'Excel':
        case 'CSV':
            return (
                <div className="border rounded-xl overflow-hidden bg-background">
                    <div className="p-3 bg-muted/50 border-b flex justify-between items-center">
                        <span className="text-xs font-bold text-muted-foreground">معاينة بيانات جدول البيانات (موجز)</span>
                        <span className="text-[10px] text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full font-semibold">Active Sheet</span>
                    </div>
                    <div className="overflow-x-auto max-h-[350px]">
                        <table className="w-full text-right border-collapse text-xs">
                            <thead>
                                <tr className="border-b bg-muted/30">
                                    <th className="p-2 border-r">الصف #</th>
                                    <th className="p-2 border-r">العمود أ (الاسم / التاريخ)</th>
                                    <th className="p-2 border-r">العمود ب (القياس / السعرات)</th>
                                    <th className="p-2 border-r">العمود ج (النسبة / الحالة)</th>
                                    <th className="p-2">العمود د (ملاحظات)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b hover:bg-muted/10">
                                    <td className="p-2 border-r text-muted-foreground">1</td>
                                    <td className="p-2 border-r">محمد علي</td>
                                    <td className="p-2 border-r">88 كجم</td>
                                    <td className="p-2 border-r">22%</td>
                                    <td className="p-2">قياسات بداية الأسبوع الأول</td>
                                </tr>
                                <tr className="border-b hover:bg-muted/10">
                                    <td className="p-2 border-r text-muted-foreground">2</td>
                                    <td className="p-2 border-r">سارة أحمد</td>
                                    <td className="p-2 border-r">68.5 كجم</td>
                                    <td className="p-2 border-r">19.8%</td>
                                    <td className="p-2">تحديث التزام خطة يوليو</td>
                                </tr>
                                <tr className="border-b hover:bg-muted/10">
                                    <td className="p-2 border-r text-muted-foreground">3</td>
                                    <td className="p-2 border-r">أحمد خالد</td>
                                    <td className="p-2 border-r">94.5 كجم</td>
                                    <td className="p-2 border-r">25%</td>
                                    <td className="p-2">مستوى استهلاك الكارديو</td>
                                </tr>
                                <tr className="hover:bg-muted/10">
                                    <td className="p-2 border-r text-muted-foreground">4</td>
                                    <td className="p-2 border-r">فاطمة حسن</td>
                                    <td className="p-2 border-r">62.3 كجم</td>
                                    <td className="p-2 border-r">18.5%</td>
                                    <td className="p-2">تحديث تمارين المقاومة</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        case 'Word':
            return (
                <div className="p-6 bg-background border rounded-xl shadow-inner space-y-4 text-right">
                    <h3 className="font-bold text-base text-foreground border-b pb-2">{document.name}</h3>
                    <div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
                        <p className="font-bold text-foreground">المستند التعريفي لبرنامج التدريب والتأهيل البدني المتكامل:</p>
                        <p>1. يهدف هذا البرنامج إلى إعادة تشكيل الكتلة العضلية وتخفيض نسب الدهون لأقل مستويات صحية ممكنة بالاعتماد على التمارين الهوائية وتمارين المقاومة بالأوزان الحرة.</p>
                        <p>2. يرجى التركيز التام على شرب المياه والالتزام الصارم بـ 8 ساعات نوم يومية للحفاظ على استقرار هرمونات الاستشفاء العضلي وجدار الأمعاء.</p>
                        <p>3. يتم تعديل هذا المستند بشكل دوري بمعدل مرتين شهرياً وفق استجابة المتدرب البدنية ومعدل الحرق اليومي.</p>
                    </div>
                </div>
            );
        default:
            return (
                <div className="flex flex-col items-center justify-center p-12 bg-muted/20 border border-dashed rounded-xl h-[300px] text-center space-y-3">
                    <span className="text-5xl">📦</span>
                    <h4 className="font-bold text-sm text-foreground">{document.name}</h4>
                    <p className="text-xs text-muted-foreground max-w-xs">هذا الملف ({document.extension.toUpperCase()}) لا يدعم المعاينة المباشرة. يرجى تحميله لجهازك لمراجعته.</p>
                </div>
            );
    }
};

export default {
    getDocumentPreviewContent
};
