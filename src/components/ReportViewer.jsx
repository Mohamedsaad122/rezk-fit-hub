import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { EyeOff } from 'lucide-react';

const COLUMN_TRANSLATIONS = {
    // Clients
    name: 'الاسم',
    progress: 'التقدم (%)',
    workouts: 'التمارين المكتملة',
    streak: 'أيام الالتزام متتالية',
    goal: 'الهدف الرياضي',
    email: 'البريد الإلكتروني',
    phone: 'رقم الهاتف',
    age: 'العمر',
    currentWeight: 'الوزن الحالي (كجم)',
    targetWeight: 'الوزن المستهدف',
    subscriptionStatus: 'حالة الاشتراك',
    joinDate: 'تاريخ الانضمام',

    // Calendar
    title: 'عنوان الجلسة',
    date: 'التاريخ',
    startTime: 'وقت البدء',
    endTime: 'وقت الانتهاء',
    status: 'الحالة',
    type: 'نوع الجلسة',
    coachName: 'اسم المدرب',
    clientName: 'اسم المتدرب',

    // Tasks
    assignedTo: 'المسند إليه',
    priority: 'الأهمية',
    startDate: 'تاريخ البدء',
    dueDate: 'تاريخ الاستحقاق',
    category: 'الفئة',

    // Nutrition
    duration: 'المدة',
    participants: 'المشاركين الفعّالين',
    calories: 'السعرات (kcal)',
    protein: 'البروتين (g)',
    carbs: 'الكربوهيدرات (g)',
    fats: 'الدهون (g)',

    // Exercises
    difficulty: 'الصعوبة',
    durationMinutes: 'الزمن بالدقائق',
    sets: 'الجولات',
    reps: 'التكرارات',

    // Messages
    senderName: 'المرسل',
    receiverName: 'المستلم',
    content: 'المحتوى',
    timestamp: 'التوقيت',

    // Analytics
    amount: 'المبلغ (SAR)',
    client: 'العميل المستفيد',

    // Documents
    uploadedBy: 'تم الرفع بواسطة',
    uploadedAt: 'تاريخ الرفع',
    sizeBytes: 'الحجم',

    // Audit logs
    action: 'العملية الإدارية',
    entity: 'القسم المستهدف',
    user: 'المشرف المسؤول',
    details: 'تفاصيل العملية'
};

const getHeaderLabel = (field) => {
    return COLUMN_TRANSLATIONS[field] || field;
};

export const ReportViewer = ({ dataRows, fields }) => {
    if (!dataRows || dataRows.length === 0) {
        return (
            <Card className="border-dashed border-2 py-12">
                <CardContent className="flex flex-col items-center justify-center space-y-3">
                    <EyeOff className="h-10 w-10 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">لا توجد بيانات مطابقة للفلاتر المحددة</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="overflow-x-auto rounded-lg border border-border bg-card">
            <table className="w-full text-right text-sm border-collapse" dir="rtl">
                <thead>
                    <tr className="bg-muted/40 border-b border-border">
                        {fields.map((field) => (
                            <th key={field} className="p-3 font-semibold text-muted-foreground border-l border-border/40 last:border-l-0">
                                {getHeaderLabel(field)}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {dataRows.map((row, idx) => (
                        <tr key={idx} className="border-b border-border/40 last:border-b-0 hover:bg-muted/30 transition-colors">
                            {fields.map((field) => {
                                let val = row[field];
                                if (field === 'sizeBytes' && typeof val === 'number') {
                                    val = `${(val / 1024).toFixed(1)} KB`;
                                }
                                if (field === 'date' || field === 'joinDate' || field === 'uploadedAt' || field === 'timestamp') {
                                    if (val) val = new Date(val).toLocaleDateString('ar-EG');
                                }
                                return (
                                    <td key={field} className="p-3 text-foreground border-l border-border/40 last:border-l-0">
                                        {val === undefined || val === null ? '-' : String(val)}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ReportViewer;
