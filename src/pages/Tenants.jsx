import React, { useState } from 'react';
import { useTenants } from '@/hooks/use-tenants';
import { useTenantStore } from '@/store/tenant.store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { toastService } from '@/services/toast.service';
import { Users, Plus, ShieldCheck, Settings, ShieldAlert, Globe } from 'lucide-react';

export const Tenants = () => {
    const { tenants, createTenant, isLoading } = useTenants();
    const { activeTenantId, setActiveTenantId } = useTenantStore();
    const [name, setName] = useState('');
    const [domain, setDomain] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCreateTenant = async (e) => {
        e.preventDefault();
        if (!name.trim() || !domain.trim() || !contactEmail.trim()) {
            toastService.error('الرجاء تعبئة كافة الحقول المطلوبة');
            return;
        }

        setIsSubmitting(true);
        try {
            await createTenant({
                name,
                domain,
                contactEmail,
                planId: 'Starter',
                status: 'Active'
            });
            toastService.success('تم إنشاء المؤسسة الجديدة بنجاح');
            setName('');
            setDomain('');
            setContactEmail('');
        } catch (error) {
            console.error(error);
            toastService.error('فشل إنشاء المؤسسة الجديدة');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSwitchTenant = (id, tenantName) => {
        setActiveTenantId(id);
        toastService.success(`تم التبديل بنجاح إلى بيئة: ${tenantName}`);
    };

    return (
        <div className="container mx-auto p-6 space-y-6" dir="rtl">
            <SEO title="إدارة المؤسسات والشركاء (SaaS Tenants)" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-primary/10 via-primary/5 to-background p-6 rounded-xl border border-primary/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <Users className="h-6 w-6 text-primary" />
                        مركز التحكم بالـ SaaS Tenants (المؤسسات)
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        إضافة وإدارة الشركات والمؤسسات الرياضية الشريكة، وإعداد النطاقات والاشتراكات.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form to Create Tenant */}
                <Card className="border border-border h-full">
                    <CardHeader className="text-right">
                        <CardTitle className="text-base font-bold flex items-center gap-1.5 flex-row-reverse justify-end">
                            <Plus className="h-4 w-4 text-primary" />
                            تسجيل مؤسسة جديدة
                        </CardTitle>
                        <CardDescription>أدخل بيانات الحساب الإداري والمجال الافتراضي.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreateTenant} className="space-y-4 text-sm text-right">
                            <div className="space-y-1">
                                <label className="font-semibold block">اسم المؤسسة (Company Name)</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="مثال: نادي الحديد والرشاقة"
                                    className="w-full p-2 rounded border bg-background"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="font-semibold block">النطاق والربط (Domain)</label>
                                <input
                                    type="text"
                                    value={domain}
                                    onChange={(e) => setDomain(e.target.value)}
                                    placeholder="مثال: iron.rezkfit.com"
                                    className="w-full p-2 rounded border bg-background"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="font-semibold block">البريد الإلكتروني الإداري</label>
                                <input
                                    type="email"
                                    value={contactEmail}
                                    onChange={(e) => setContactEmail(e.target.value)}
                                    placeholder="manager@iron.com"
                                    className="w-full p-2 rounded border bg-background"
                                    required
                                />
                            </div>

                            <Button type="submit" disabled={isSubmitting} className="w-full">
                                {isSubmitting ? 'جاري التسجيل...' : 'تأكيد التسجيل والتفعيل'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Tenants List */}
                <div className="lg:col-span-2 space-y-4">
                    {isLoading ? (
                        <div className="text-center py-12 text-muted-foreground">جاري تحميل المؤسسات...</div>
                    ) : (
                        tenants.map((t) => (
                            <Card key={t.id} className={`border ${t.id === activeTenantId ? 'border-primary bg-primary/5 shadow' : 'border-border'}`}>
                                <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="space-y-1 text-right">
                                        <div className="flex items-center gap-2 justify-start flex-row-reverse">
                                            {t.id === activeTenantId && (
                                                <Badge className="bg-primary text-white text-[9px] px-1.5 py-0.5">البيئة الحالية</Badge>
                                            )}
                                            <h3 className="font-bold text-base text-foreground">{t.name}</h3>
                                        </div>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1.5 justify-start">
                                            <Globe className="h-3.5 w-3.5" />
                                            النطاق: <span className="font-mono">{t.domain}</span> | المسؤول: {t.contactEmail}
                                        </p>
                                        <div className="text-[10px] text-muted-foreground">
                                            تاريخ التسجيل: {new Date(t.createdAt).toLocaleDateString('ar-EG')}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        <Badge variant={t.status === 'Active' ? 'default' : 'destructive'} className="text-[10px] font-semibold">
                                            {t.status === 'Active' ? 'نشط' : 'معلق'}
                                        </Badge>
                                        {t.id !== activeTenantId ? (
                                            <Button size="sm" variant="outline" onClick={() => handleSwitchTenant(t.id, t.name)}>
                                                تبديل إلى البيئة
                                            </Button>
                                        ) : (
                                            <Button size="sm" disabled variant="ghost" className="text-primary font-bold">
                                                <ShieldCheck className="h-4 w-4 mr-1" />
                                                متصل
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Tenants;
