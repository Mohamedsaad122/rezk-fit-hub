import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { toastService } from '@/services/toast.service';
import { ArrowLeft, Trash2, Shield, Laptop } from 'lucide-react';
import { Link } from 'react-router-dom';
import ROUTES from '@/constants/routes.constants';
import { DeviceService } from '@/services/device.service';

export const TrustedDevices = () => {
    const [devices, setDevices] = useState([]);

    const fetchDevices = async () => {
        try {
            const list = await DeviceService.getDevices();
            setDevices(list);
        } catch {
            // ignore
        }
    };

    useEffect(() => {
        fetchDevices();
    }, []);

    const handleDelete = async (id) => {
        try {
            await DeviceService.deleteDevice(id);
            toastService.success('تم حذف الجهاز الموثوق المختار بنجاح');
            fetchDevices();
        } catch {
            toastService.error('فشل إزالة الجهاز الموثوق');
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6 text-right" dir="rtl">
            <SEO title="الأجهزة الموثوقة (Trusted Devices)" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-red-500/10 via-primary/5 to-background p-6 rounded-xl border border-red-500/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <Laptop className="h-6 w-6 text-red-500" />
                        سجلات الأجهزة الموثوقة (Trusted Devices Management)
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        قائمة الهواتف الذكية والأجهزة اللوحية المصرح لها بتخطي المصادقة الثنائية (Remember Device).
                    </p>
                </div>
                <Button asChild variant="outline" size="sm">
                    <Link to={ROUTES.SECURITY_CENTER} className="gap-1">
                        <ArrowLeft className="h-4 w-4" />
                        العودة للمركز
                    </Link>
                </Button>
            </div>

            <Card className="border border-border">
                <CardHeader className="text-right">
                    <CardTitle className="text-base font-bold">الأجهزة الموثوقة والمسجلة ({devices.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {devices.length === 0 ? (
                        <div className="text-center py-16 text-muted-foreground text-xs">لا توجد أجهزة مسجلة حالياً كأجهزة موثوقة.</div>
                    ) : (
                        devices.map(d => (
                            <div key={d.id} className="p-4 border border-border rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 flex-row-reverse text-right text-xs bg-muted/5">
                                <div className="space-y-2 w-full md:w-auto">
                                    <div className="flex items-center gap-2 flex-row-reverse justify-end">
                                        <strong className="text-foreground font-bold">{d.name}</strong>
                                        <Badge variant="default" className="text-[9px]">جهاز معتمد</Badge>
                                    </div>
                                    <div className="flex flex-col text-[10px] text-muted-foreground space-y-0.5">
                                        <span>نظام التشغيل: {d.os}</span>
                                        <span>المتصفح: {d.browser}</span>
                                        <span>رمز البصمة الفريد: {d.fingerprint.substring(0, 20)}...</span>
                                    </div>
                                    <div className="text-[9px] text-muted-foreground">
                                        <span>تاريخ التوثيق: {new Date(d.trustedAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <Button size="xs" variant="destructive" onClick={() => handleDelete(d.id)} className="w-full md:w-auto gap-1">
                                    <Trash2 className="h-3.5 w-3.5" />
                                    إزالة الثقة
                                </Button>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default TrustedDevices;
