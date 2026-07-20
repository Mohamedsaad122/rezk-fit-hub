import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { toastService } from '@/services/toast.service';
import { Laptop, Plus, HardDrive, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { OfflineService } from '@/services/offline.service';
import { formatNumber } from '@/utils/formatNumber';

export const DeviceManager = () => {
    const [devices, setDevices] = useState([]);
    const [newDeviceName, setNewDeviceName] = useState('');

    const fetchDevices = async () => {
        try {
            const list = await OfflineService.getDevices();
            setDevices(list);
        } catch {
            // ignore
        }
    };

    useEffect(() => {
        fetchDevices();
    }, []);

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!newDeviceName) return;

        try {
            await OfflineService.registerCurrentDevice(newDeviceName, 'MacOS / Windows (Chrome Browser)');
            setNewDeviceName('');
            toastService.success('تم تسجيل جهاز الوصول المؤسسي الجديد بنجاح');
            fetchDevices();
        } catch {
            toastService.error('فشل تسجيل الجهاز');
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6 text-right" dir="rtl">
            <SEO title="إدارة الأجهزة المتصلة (Device Manager)" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-primary/10 via-primary/5 to-background p-6 rounded-xl border border-primary/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <Laptop className="h-6 w-6 text-primary" />
                        إدارة أجهزة الوصول والعمل دون اتصال (Device Manager)
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        مراقبة وإدارة جميع الأجهزة المصرح لها بمزامنة البيانات والعمل أوفلاين لحساب المؤسسة.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form to register current device */}
                <Card className="border border-border h-full">
                    <CardHeader className="text-right">
                        <CardTitle className="text-base font-bold">تسجيل جهاز حالي جديد</CardTitle>
                        <CardDescription className="text-xs">تسجيل هذا المتصفح كجهاز معتمد للوصول المشفر.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleRegister} className="space-y-4 text-sm text-right">
                            <div className="space-y-1">
                                <label className="font-semibold block">اسم الجهاز المميز</label>
                                <input
                                    type="text"
                                    value={newDeviceName}
                                    onChange={(e) => setNewDeviceName(e.target.value)}
                                    placeholder="مثال: لابتوب الإدارة الرئيسي"
                                    className="w-full p-2 rounded border bg-background text-foreground text-xs"
                                    required
                                />
                            </div>

                            <Button type="submit" className="w-full gap-2">
                                <Plus className="h-4 w-4" />
                                تسجيل هذا الجهاز
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Device Lists */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border border-border">
                        <CardHeader className="text-right">
                            <CardTitle className="text-base font-bold">الأجهزة المسجلة والمصرح لها</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {devices.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground text-xs">لا يوجد أجهزة مسجلة حالياً للمؤسسة.</div>
                            ) : (
                                devices.map(device => (
                                    <div key={device.id} className="p-3 border border-border rounded-xl flex justify-between items-center flex-row-reverse text-right text-xs">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 flex-row-reverse">
                                                <strong className="text-foreground font-bold">{device.name}</strong>
                                                <Badge variant={device.status === 'Active' ? 'default' : 'secondary'} className="text-[9px]">
                                                    {device.status === 'Active' ? 'نشط ومصرح' : 'معطل'}
                                                </Badge>
                                            </div>
                                            <p className="text-[10px] text-muted-foreground">نظام التشغيل: {device.os}</p>
                                            <p className="text-[10px] text-muted-foreground">آخر مزامنة: {device.lastSyncTime || 'لم تتم المزامنة بعد'}</p>
                                        </div>
                                        <div className="text-left font-semibold text-muted-foreground">
                                            سعة الملفات: {formatNumber(Math.round(device.storageUsedBytes / 1024))} KB
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DeviceManager;
