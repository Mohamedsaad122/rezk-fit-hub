import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useReportSchedules } from '@/hooks/use-reports';
import { toastService } from '@/services/toast.service';
import { Plus, Trash2, Clock } from 'lucide-react';

export const ScheduleReportDialog = ({ open, onOpenChange, initialModule = 'Clients', initialFilters = {} }) => {
    const [name, setName] = useState('');
    const [schedule, setSchedule] = useState('daily'); // 'daily' | 'weekly' | 'monthly'
    const [format, setFormat] = useState('pdf'); // 'csv' | 'xlsx' | 'pdf'
    const [emailInput, setEmailInput] = useState('');
    const [recipients, setRecipients] = useState(['admin@rezkfit.com']);
    const [retentionDays, setRetentionDays] = useState(30);
    const [isSaving, setIsSaving] = useState(false);

    const { createSchedule } = useReportSchedules();

    useEffect(() => {
        if (open) {
            setName(`تقرير مجدول للمشتركين - ${new Date().toLocaleDateString('ar-EG')}`);
        }
    }, [open]);

    const handleAddEmail = () => {
        const email = emailInput.trim();
        if (!email) return;
        if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            toastService.error('صيغة البريد الإلكتروني غير صحيحة');
            return;
        }
        if (recipients.includes(email)) {
            toastService.error('البريد الإلكتروني مضاف بالفعل');
            return;
        }
        setRecipients([...recipients, email]);
        setEmailInput('');
    };

    const handleRemoveEmail = (emailToRemove) => {
        setRecipients(recipients.filter(email => email !== emailToRemove));
    };

    const handleSave = async () => {
        if (!name.trim()) {
            toastService.error('الرجاء إدخال اسم المجدول');
            return;
        }
        if (recipients.length === 0) {
            toastService.error('يجب إضافة مستلم واحد على الأقل للتقرير');
            return;
        }

        setIsSaving(true);
        try {
            await createSchedule({
                name,
                module: initialModule,
                filters: initialFilters,
                schedule,
                format,
                recipients,
                retentionDays: Number(retentionDays),
                isActive: true
            });
            toastService.success('تمت إضافة الجدولة بنجاح');
            onOpenChange(false);
        } catch (error) {
            console.error(error);
            toastService.error('فشل في حفظ الجدولة');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[480px] text-right font-sans" dir="rtl">
                <DialogHeader className="text-right">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2 justify-start text-foreground">
                        <Clock className="h-5 w-5 text-primary" />
                        إعداد جدولة التقارير التلقائية
                    </DialogTitle>
                </DialogHeader>

                <div className="py-4 space-y-4 text-sm text-foreground">
                    <div className="space-y-1">
                        <label className="font-semibold block">اسم التقرير المجدول</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="مثال: التقرير الإداري للمدربين"
                            className="w-full p-2.5 rounded-lg border border-input bg-background"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="font-semibold block">تكرار التقرير</label>
                            <select
                                value={schedule}
                                onChange={(e) => setSchedule(e.target.value)}
                                className="w-full p-2.5 rounded-lg border border-input bg-background"
                            >
                                <option value="daily">يومي (Daily)</option>
                                <option value="weekly">أسبوعي (Weekly)</option>
                                <option value="monthly">شهري (Monthly)</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="font-semibold block">صيغة التصدير</label>
                            <select
                                value={format}
                                onChange={(e) => setFormat(e.target.value)}
                                className="w-full p-2.5 rounded-lg border border-input bg-background"
                            >
                                <option value="pdf">ملف PDF</option>
                                <option value="xlsx">جدول Excel (xlsx)</option>
                                <option value="csv">ملف نصي CSV</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="font-semibold block">الاحتفاظ بالتقارير (يوم)</label>
                        <input
                            type="number"
                            value={retentionDays}
                            onChange={(e) => setRetentionDays(e.target.value)}
                            min={1}
                            className="w-full p-2.5 rounded-lg border border-input bg-background"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="font-semibold block">قائمة مستلمي التقرير</label>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                value={emailInput}
                                onChange={(e) => setEmailInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddEmail())}
                                placeholder="مثال: manager@fit.com"
                                className="flex-1 p-2.5 rounded-lg border border-input bg-background"
                            />
                            <Button type="button" onClick={handleAddEmail}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="max-h-[100px] overflow-y-auto border border-input rounded-lg p-2 bg-muted/20 space-y-1.5">
                            {recipients.length === 0 ? (
                                <p className="text-muted-foreground text-xs py-2 text-center">لا يوجد مستلمون مضافون حالياً</p>
                            ) : (
                                recipients.map((email, idx) => (
                                    <div key={idx} className="flex items-center justify-between bg-background p-1.5 rounded border text-xs">
                                        <span className="font-mono text-muted-foreground">{email}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveEmail(email)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <DialogFooter className="sm:justify-start gap-2 flex-row-reverse">
                    <Button type="button" onClick={handleSave} disabled={isSaving}>
                        {isSaving ? 'جاري الحفظ...' : 'تأكيد الجدولة والتفعيل'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
                        إلغاء
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ScheduleReportDialog;
