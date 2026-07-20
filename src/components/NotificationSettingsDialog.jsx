import React, { useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNotificationSettings } from "@/hooks/use-notifications";
import { useForm, Controller } from "react-hook-form";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Bell, Volume2, Monitor, ShieldAlert, Clock } from "lucide-react";

export const NotificationSettingsDialog = ({ open, onOpenChange }) => {
    const { settings, isLoading, updateSettings, isUpdating } = useNotificationSettings();
    const { control, handleSubmit, reset } = useForm();

    useEffect(() => {
        if (settings) {
            reset({
                muteReminders: settings.muteReminders ?? false,
                reminderTiming: settings.reminderTiming ? String(settings.reminderTiming) : "15",
                soundEnabled: settings.soundEnabled ?? true,
                desktopNotifications: settings.desktopNotifications ?? true,
                categories: {
                    appointment: settings.categories?.appointment ?? true,
                    workout: settings.categories?.workout ?? true,
                    nutrition: settings.categories?.nutrition ?? true,
                    client: settings.categories?.client ?? true,
                    assessment: settings.categories?.assessment ?? true,
                    progress: settings.categories?.progress ?? true,
                    system: settings.categories?.system ?? true,
                }
            });
        }
    }, [settings, reset]);

    const onSubmit = async (data) => {
        try {
            await updateSettings({
                ...data,
                reminderTiming: Number(data.reminderTiming),
            });
            onOpenChange(false);
        } catch {
            // Error is handled by mutation onError toast
        }
    };

    if (isLoading) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="rtl text-right sm:max-w-[425px]">
                    <div className="flex justify-center py-8">
                        <LoadingSpinner message="جاري تحميل الإعدادات..." />
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="rtl text-right sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <Bell className="w-5 h-5 text-primary" />
                        إعدادات التنبيهات
                    </DialogTitle>
                    <DialogDescription>
                        تخصيص الإشعارات الفورية وفئات التنبيهات وتفضيلات الصوت والرسائل.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
                    {/* General Settings */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-muted-foreground border-b pb-1">الإعدادات العامة</h4>

                        {/* Mute Toggles */}
                        <div className="flex items-center justify-between py-2">
                            <div className="space-y-0.5">
                                <Label htmlFor="muteReminders" className="text-sm font-bold flex items-center gap-2 cursor-pointer">
                                    <ShieldAlert className="w-4 h-4 text-muted-foreground" />
                                    كتم جميع التنبيهات
                                </Label>
                                <span className="text-xs text-muted-foreground">
                                    تعطيل جميع التنبيهات والرسائل الفورية مؤقتاً.
                                </span>
                            </div>
                            <Controller
                                name="muteReminders"
                                control={control}
                                render={({ field }) => (
                                    <Switch
                                        id="muteReminders"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        aria-label="Mute all notifications"
                                    />
                                )}
                            />
                        </div>

                        {/* Sound Toggle */}
                        <div className="flex items-center justify-between py-2">
                            <div className="space-y-0.5">
                                <Label htmlFor="soundEnabled" className="text-sm font-bold flex items-center gap-2 cursor-pointer">
                                    <Volume2 className="w-4 h-4 text-muted-foreground" />
                                    تفعيل الأصوات
                                </Label>
                                <span className="text-xs text-muted-foreground">
                                    تشغيل تأثيرات صوتية عند استلام إشعارات جديدة.
                                </span>
                            </div>
                            <Controller
                                name="soundEnabled"
                                control={control}
                                render={({ field }) => (
                                    <Switch
                                        id="soundEnabled"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        aria-label="Enable sound notification alerts"
                                    />
                                )}
                            />
                        </div>

                        {/* Desktop Alerts */}
                        <div className="flex items-center justify-between py-2">
                            <div className="space-y-0.5">
                                <Label htmlFor="desktopNotifications" className="text-sm font-bold flex items-center gap-2 cursor-pointer">
                                    <Monitor className="w-4 h-4 text-muted-foreground" />
                                    إشعارات سطح المكتب
                                </Label>
                                <span className="text-xs text-muted-foreground">
                                    إظهار تنبيهات منبثقة على شاشتك عند تصغير المتصفح.
                                </span>
                            </div>
                            <Controller
                                name="desktopNotifications"
                                control={control}
                                render={({ field }) => (
                                    <Switch
                                        id="desktopNotifications"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        aria-label="Enable desktop notifications"
                                    />
                                )}
                            />
                        </div>

                        {/* Reminder Timing */}
                        <div className="flex items-center justify-between py-2">
                            <div className="space-y-0.5">
                                <Label className="text-sm font-bold flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-muted-foreground" />
                                    توقيت التذكير بالجلسات
                                </Label>
                                <span className="text-xs text-muted-foreground">
                                    تحديد وقت إرسال التنبيه قبل موعد اللقاء المجدول.
                                </span>
                            </div>
                            <div className="w-[120px]">
                                <Controller
                                    name="reminderTiming"
                                    control={control}
                                    render={({ field }) => (
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger aria-label="Reminder timing select selector">
                                                <SelectValue placeholder="اختر الوقت" />
                                            </SelectTrigger>
                                            <SelectContent className="rtl text-right">
                                                <SelectItem value="5">قبل 5 دقائق</SelectItem>
                                                <SelectItem value="15">قبل 15 دقيقة</SelectItem>
                                                <SelectItem value="30">قبل 30 دقيقة</SelectItem>
                                                <SelectItem value="60">قبل ساعة</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Notification Categories */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-muted-foreground border-b pb-1">الفئات المفعلة</h4>

                        {/* Category: Appointments */}
                        <div className="flex items-center justify-between py-1">
                            <div className="space-y-0.5">
                                <Label htmlFor="cat-appointment" className="text-sm font-medium cursor-pointer">تنبيهات المواعيد واللقاءات</Label>
                                <p className="text-[11px] text-muted-foreground">تأكيد، إلغاء، أو نقل مواعيد الجلسات.</p>
                            </div>
                            <Controller
                                name="categories.appointment"
                                control={control}
                                render={({ field }) => (
                                    <Switch
                                        id="cat-appointment"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        aria-label="Toggle appointment alerts"
                                    />
                                )}
                            />
                        </div>

                        {/* Category: Workouts */}
                        <div className="flex items-center justify-between py-1">
                            <div className="space-y-0.5">
                                <Label htmlFor="cat-workout" className="text-sm font-medium cursor-pointer">البرامج التدريبية والتمارين</Label>
                                <p className="text-[11px] text-muted-foreground">تعيين جداول تمارين جديدة أو اكتمالها.</p>
                            </div>
                            <Controller
                                name="categories.workout"
                                control={control}
                                render={({ field }) => (
                                    <Switch
                                        id="cat-workout"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        aria-label="Toggle workout assignment alerts"
                                    />
                                )}
                            />
                        </div>

                        {/* Category: Nutrition */}
                        <div className="flex items-center justify-between py-1">
                            <div className="space-y-0.5">
                                <Label htmlFor="cat-nutrition" className="text-sm font-medium cursor-pointer">الأنظمة الغذائية والتغذية</Label>
                                <p className="text-[11px] text-muted-foreground">تعيين أو تحديث خطط وجبات المتدربين.</p>
                            </div>
                            <Controller
                                name="categories.nutrition"
                                control={control}
                                render={({ field }) => (
                                    <Switch
                                        id="cat-nutrition"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        aria-label="Toggle nutrition plan alerts"
                                    />
                                )}
                            />
                        </div>

                        {/* Category: Client Management */}
                        <div className="flex items-center justify-between py-1">
                            <div className="space-y-0.5">
                                <Label htmlFor="cat-client" className="text-sm font-medium cursor-pointer">إدارة المتدربين والعملاء</Label>
                                <p className="text-[11px] text-muted-foreground">تسجيل متدربين جدد أو إزالتهم وتحديث بياناتهم.</p>
                            </div>
                            <Controller
                                name="categories.client"
                                control={control}
                                render={({ field }) => (
                                    <Switch
                                        id="cat-client"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        aria-label="Toggle client management events notifications"
                                    />
                                )}
                            />
                        </div>

                        {/* Category: Goals & Progress */}
                        <div className="flex items-center justify-between py-1">
                            <div className="space-y-0.5">
                                <Label htmlFor="cat-progress" className="text-sm font-medium cursor-pointer">الأهداف والتقدم البدني</Label>
                                <p className="text-[11px] text-muted-foreground">تحقيق مستويات الوزن، قياسات BMI والتقدم.</p>
                            </div>
                            <Controller
                                name="categories.progress"
                                control={control}
                                render={({ field }) => (
                                    <Switch
                                        id="cat-progress"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        aria-label="Toggle user fitness progress updates notifications"
                                    />
                                )}
                            />
                        </div>

                        {/* Category: System Updates */}
                        <div className="flex items-center justify-between py-1">
                            <div className="space-y-0.5">
                                <Label htmlFor="cat-system" className="text-sm font-medium cursor-pointer">إعلانات وتحديثات النظام</Label>
                                <p className="text-[11px] text-muted-foreground">تنبيهات الصيانة، التحديثات العامة والميزات الجديدة.</p>
                            </div>
                            <Controller
                                name="categories.system"
                                control={control}
                                render={({ field }) => (
                                    <Switch
                                        id="cat-system"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        aria-label="Toggle technical system notifications"
                                    />
                                )}
                            />
                        </div>
                    </div>

                    <DialogFooter className="flex flex-row gap-2 justify-end pt-2 border-t">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            إلغاء
                        </Button>
                        <Button type="submit" disabled={isUpdating}>
                            {isUpdating ? "جاري الحفظ..." : "حفظ التغييرات"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default NotificationSettingsDialog;
