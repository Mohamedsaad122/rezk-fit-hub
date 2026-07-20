import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAdminStore } from '@/store/admin.store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { toastService } from '@/services/toast.service';
import { 
    Settings as SettingsIcon, Shield, Bell, Paintbrush, Globe, 
    Save, RefreshCw 
} from 'lucide-react';

export const Settings = () => {
    const { settings, updateSettings, resetStore } = useAdminStore();
    const [activeTab, setActiveTab] = useState('general');
    
    // Local form states
    const [general, setGeneral] = useState(settings.general);
    const [security, setSecurity] = useState(settings.security);
    const [notifications, setNotifications] = useState(settings.notifications);
    const [appearance, setAppearance] = useState(settings.appearance);
    const [localization, setLocalization] = useState(settings.localization);

    const handleSave = (tab) => {
        try {
            if (tab === 'general') {
                updateSettings('general', general);
            } else if (tab === 'security') {
                updateSettings('security', security);
            } else if (tab === 'notifications') {
                updateSettings('notifications', notifications);
            } else if (tab === 'appearance') {
                updateSettings('appearance', appearance);
            } else if (tab === 'localization') {
                updateSettings('localization', localization);
            }
            toastService.success('تم حفظ التغييرات بنجاح');
        } catch (error) {
            console.error(error);
            toastService.error('حدث خطأ أثناء حفظ الإعدادات');
        }
    };

    const handleReset = () => {
        resetStore();
        setGeneral(settings.general);
        setSecurity(settings.security);
        setNotifications(settings.notifications);
        setAppearance(settings.appearance);
        setLocalization(settings.localization);
        toastService.success('تمت إعادة تعيين إعدادات النظام الافتراضية');
    };

    const tabs = [
        { id: 'general', label: 'الإعدادات العامة', icon: SettingsIcon },
        { id: 'security', label: 'الحماية والأمان', icon: Shield },
        { id: 'notifications', label: 'التنبيهات والإشعارات', icon: Bell },
        { id: 'appearance', label: 'المظهر والتصميم', icon: Paintbrush },
        { id: 'localization', label: 'اللغة والمنطقة', icon: Globe }
    ];

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6 rtl text-right" dir="rtl">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-5">
                <div>
                    <h1 className="text-3xl font-extrabold text-foreground tracking-tight">إعدادات النظام</h1>
                    <p className="text-muted-foreground text-sm mt-1">تكوين معلمات المنصة العامة، الأمان، والتنبيهات.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
                        <RefreshCw className="w-4 h-4" />
                        إعادة تعيين الافتراضي
                    </Button>
                </div>
            </div>

            {/* Layout Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
                {/* Tabs Sidebar */}
                <div className="flex md:flex-col overflow-x-auto md:overflow-visible gap-1 bg-card border border-border p-2 rounded-xl">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all text-right whitespace-nowrap md:w-full
                                    ${activeTab === tab.id 
                                        ? 'bg-primary text-primary-foreground shadow-md font-semibold' 
                                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }
                                `}
                            >
                                <Icon className="w-4 h-4 shrink-0" />
                                <span>{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Settings Panel Content */}
                <div className="md:col-span-3">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab === 'general' && (
                            <Card className="shadow-lg border-border">
                                <CardHeader>
                                    <CardTitle className="text-xl">الإعدادات العامة للشركة</CardTitle>
                                    <CardDescription>المعلومات الأساسية وبيانات المراسلة لمنصة Rezk Fit Hub.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="siteName">اسم المنصة / الشركة</Label>
                                        <Input 
                                            id="siteName" 
                                            value={general.siteName} 
                                            onChange={(e) => setGeneral({ ...general, siteName: e.target.value })} 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="supportEmail">البريد الإلكتروني للدعم</Label>
                                        <Input 
                                            id="supportEmail" 
                                            type="email"
                                            value={general.supportEmail} 
                                            onChange={(e) => setGeneral({ ...general, supportEmail: e.target.value })} 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="contactPhone">رقم هاتف التواصل</Label>
                                        <Input 
                                            id="contactPhone" 
                                            value={general.contactPhone} 
                                            onChange={(e) => setGeneral({ ...general, contactPhone: e.target.value })} 
                                        />
                                    </div>
                                    <Button onClick={() => handleSave('general')} className="mt-4 gap-2">
                                        <Save className="w-4 h-4" />
                                        حفظ الإعدادات العامة
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {activeTab === 'security' && (
                            <Card className="shadow-lg border-border">
                                <CardHeader>
                                    <CardTitle className="text-xl">خيارات الأمان وحماية الحسابات</CardTitle>
                                    <CardDescription>تكوين شروط كلمة المرور والتحقق الثنائي ومُدد الجلسات.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="passwordExpiry">مدة صلاحية كلمة المرور (أيام)</Label>
                                        <Input 
                                            id="passwordExpiry" 
                                            type="number"
                                            value={security.passwordExpiryDays} 
                                            onChange={(e) => setSecurity({ ...security, passwordExpiryDays: Number(e.target.value) })} 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="sessionTimeout">انتهاء مهلة الجلسة (دقائق)</Label>
                                        <Input 
                                            id="sessionTimeout" 
                                            type="number"
                                            value={security.sessionTimeoutMinutes} 
                                            onChange={(e) => setSecurity({ ...security, sessionTimeoutMinutes: Number(e.target.value) })} 
                                        />
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                                        <div className="space-y-0.5">
                                            <Label className="text-base">تفعيل المصادقة الثنائية (2FA)</Label>
                                            <p className="text-xs text-muted-foreground">فرض التحقق بخطوتين لجميع حسابات المشرفين والمدربين.</p>
                                        </div>
                                        <input 
                                            type="checkbox" 
                                            className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                                            checked={security.enableTwoFactor} 
                                            onChange={(e) => setSecurity({ ...security, enableTwoFactor: e.target.checked })}
                                        />
                                    </div>
                                    <Button onClick={() => handleSave('security')} className="mt-4 gap-2">
                                        <Save className="w-4 h-4" />
                                        حفظ إعدادات الأمان
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {activeTab === 'notifications' && (
                            <Card className="shadow-lg border-border">
                                <CardHeader>
                                    <CardTitle className="text-xl">تنبيهات وإشعارات النظام</CardTitle>
                                    <CardDescription>تحديد قنوات تسليم الإشعارات التلقائية للمدربين والمتدربين.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                                        <div>
                                            <Label className="text-base">إشعارات البريد الإلكتروني</Label>
                                            <p className="text-xs text-muted-foreground">إرسال تقارير وجداول الاشتراكات عبر البريد.</p>
                                        </div>
                                        <input 
                                            type="checkbox" 
                                            className="w-5 h-5 rounded"
                                            checked={notifications.emailAlerts} 
                                            onChange={(e) => setNotifications({ ...notifications, emailAlerts: e.target.checked })}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                                        <div>
                                            <Label className="text-base">رسائل SMS القصيرة</Label>
                                            <p className="text-xs text-muted-foreground">إرسال رسائل تذكير بالمواعيد واللقاءات الهامة.</p>
                                        </div>
                                        <input 
                                            type="checkbox" 
                                            className="w-5 h-5 rounded"
                                            checked={notifications.smsAlerts} 
                                            onChange={(e) => setNotifications({ ...notifications, smsAlerts: e.target.checked })}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                                        <div>
                                            <Label className="text-base">الإشعارات الفورية (Push Notifications)</Label>
                                            <p className="text-xs text-muted-foreground">عرض الإشعارات المباشرة داخل المتصفح والتطبيق.</p>
                                        </div>
                                        <input 
                                            type="checkbox" 
                                            className="w-5 h-5 rounded"
                                            checked={notifications.pushAlerts} 
                                            onChange={(e) => setNotifications({ ...notifications, pushAlerts: e.target.checked })}
                                        />
                                    </div>
                                    <Button onClick={() => handleSave('notifications')} className="mt-4 gap-2">
                                        <Save className="w-4 h-4" />
                                        حفظ تفضيلات الإشعارات
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {activeTab === 'appearance' && (
                            <Card className="shadow-lg border-border">
                                <CardHeader>
                                    <CardTitle className="text-xl">مظهر المنصة والتصميم</CardTitle>
                                    <CardDescription>التحكم بنظام الألوان العام للمنصة والسمات الافتراضية.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>السمة الافتراضية للمنصة</Label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {['light', 'dark', 'system'].map((t) => (
                                                <button
                                                    key={t}
                                                    type="button"
                                                    onClick={() => setAppearance({ ...appearance, theme: t })}
                                                    className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all
                                                        ${appearance.theme === t 
                                                            ? 'border-primary bg-primary/10 text-primary' 
                                                            : 'border-border bg-card hover:bg-muted'
                                                        }
                                                    `}
                                                >
                                                    {t === 'light' ? 'نهاري' : t === 'dark' ? 'ليلي' : 'تلقائي'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>اللون الرئيسي لواجهة المستخدم</Label>
                                        <div className="grid grid-cols-4 gap-2">
                                            {['blue', 'violet', 'emerald', 'amber'].map((c) => (
                                                <button
                                                    key={c}
                                                    type="button"
                                                    onClick={() => setAppearance({ ...appearance, primaryColor: c })}
                                                    className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all capitalize
                                                        ${appearance.primaryColor === c 
                                                            ? 'border-primary bg-primary/10 text-primary' 
                                                            : 'border-border bg-card hover:bg-muted'
                                                        }
                                                    `}
                                                >
                                                    {c === 'blue' ? 'أزرق' : c === 'violet' ? 'بنفسجي' : c === 'emerald' ? 'أخضر' : 'ذهبي'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <Button onClick={() => handleSave('appearance')} className="mt-4 gap-2">
                                        <Save className="w-4 h-4" />
                                        حفظ تفضيلات المظهر
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {activeTab === 'localization' && (
                            <Card className="shadow-lg border-border">
                                <CardHeader>
                                    <CardTitle className="text-xl">اللغة والمنطقة الزمنية</CardTitle>
                                    <CardDescription>المنطقة الزمنية الافتراضية، صيغة عرض التواريخ، والترجمات.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>اللغة الافتراضية للوحة التحكم</Label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {[
                                                { id: 'ar', label: 'العربية (RTL)' },
                                                { id: 'en', label: 'English (LTR)' }
                                            ].map((lang) => (
                                                <button
                                                    key={lang.id}
                                                    type="button"
                                                    onClick={() => setLocalization({ ...localization, defaultLanguage: lang.id })}
                                                    className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all
                                                        ${localization.defaultLanguage === lang.id 
                                                            ? 'border-primary bg-primary/10 text-primary' 
                                                            : 'border-border bg-card hover:bg-muted'
                                                        }
                                                    `}
                                                >
                                                    {lang.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="timezone">المنطقة الزمنية للنظام</Label>
                                        <Input 
                                            id="timezone" 
                                            value={localization.timezone} 
                                            onChange={(e) => setLocalization({ ...localization, timezone: e.target.value })} 
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="dateFormat">تنسيق التاريخ الافتراضي</Label>
                                        <Input 
                                            id="dateFormat" 
                                            value={localization.dateFormat} 
                                            onChange={(e) => setLocalization({ ...localization, dateFormat: e.target.value })} 
                                        />
                                    </div>

                                    <Button onClick={() => handleSave('localization')} className="mt-4 gap-2">
                                        <Save className="w-4 h-4" />
                                        حفظ خيارات اللغة والمنطقة
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
