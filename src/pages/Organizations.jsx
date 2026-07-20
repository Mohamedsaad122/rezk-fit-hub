import React, { useState } from 'react';
import { useOrganizations } from '@/hooks/use-organizations';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { toastService } from '@/services/toast.service';
import { Building, Plus, SwitchCamera, CheckCircle, Globe, Settings, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Organizations = () => {
    const { organizations, createOrganization, activeOrganizationId, switchOrganization, isLoading } = useOrganizations();
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCreateOrg = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            toastService.error('الرجاء تعبئة اسم المنظمة');
            return;
        }

        setIsSubmitting(true);
        try {
            await createOrganization({
                name,
                status: 'Active',
                settings: {
                    timezone: 'Asia/Riyadh',
                    currency: 'SAR',
                    logoUrl: null,
                    primaryColor: '#0ea5e9'
                }
            });
            toastService.success('تم تسجيل المنظمة الجديدة بنجاح');
            setName('');
        } catch (error) {
            console.error(error);
            toastService.error('فشل تسجيل المنظمة الجديدة');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSwitchOrg = (id, orgName) => {
        switchOrganization(id);
        toastService.success(`تم التبديل بنجاح إلى منظمة: ${orgName}`);
    };

    return (
        <div className="container mx-auto p-6 space-y-6" dir="rtl">
            <SEO title="إدارة المنظمات والشركاء (Organizations)" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-primary/10 via-primary/5 to-background p-6 rounded-xl border border-primary/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <Building className="h-6 w-6 text-primary" />
                        مركز إدارة المنظمات والمؤسسات الشريكة
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        إعداد المنظمات المستقلة التابعة لبيئتك السحابية، وتهيئة الفروع والمجموعات التشغيلية.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form to Register Organization */}
                <Card className="border border-border h-full">
                    <CardHeader className="text-right">
                        <CardTitle className="text-base font-bold flex items-center gap-1.5 flex-row-reverse justify-end">
                            <Plus className="h-4 w-4 text-primary" />
                            تسجيل منظمة جديدة
                        </CardTitle>
                        <CardDescription>إنشاء منظمة فرعية أو نادي إضافي مستقل إدارياً.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreateOrg} className="space-y-4 text-sm text-right">
                            <div className="space-y-1">
                                <label className="font-semibold block">اسم المنظمة</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="مثال: فرع غرب الرياض الرئيسي"
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

                {/* Organizations List */}
                <div className="lg:col-span-2 space-y-4">
                    {isLoading ? (
                        <div className="text-center py-12 text-muted-foreground">جاري تحميل المنظمات...</div>
                    ) : (
                        organizations.map((org) => (
                            <Card key={org.id} className={`border ${org.id === activeOrganizationId ? 'border-primary bg-primary/5 shadow' : 'border-border'}`}>
                                <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="space-y-1 text-right">
                                        <div className="flex items-center gap-2 justify-start flex-row-reverse">
                                            {org.id === activeOrganizationId && (
                                                <Badge className="bg-primary text-white text-[9px] px-1.5 py-0.5">المنظمة النشطة حالياً</Badge>
                                            )}
                                            <h3 className="font-bold text-base text-foreground">{org.name}</h3>
                                        </div>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1.5 justify-start">
                                            <Globe className="h-3.5 w-3.5" />
                                            المنطقة الزمنية: {org.settings?.timezone || 'Asia/Riyadh'} | العملة: {org.settings?.currency || 'SAR'}
                                        </p>
                                        <div className="text-[10px] text-muted-foreground">
                                            تاريخ الإنشاء: {new Date(org.createdAt).toLocaleDateString('ar-EG')}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        <Badge variant={org.status === 'Active' ? 'default' : 'destructive'} className="text-[10px] font-semibold">
                                            {org.status === 'Active' ? 'نشط' : 'معلق'}
                                        </Badge>

                                        {org.id !== activeOrganizationId ? (
                                            <Button 
                                                onClick={() => handleSwitchOrg(org.id, org.name)} 
                                                variant="outline" 
                                                size="sm" 
                                                className="h-8 gap-1.5 text-xs"
                                            >
                                                <SwitchCamera className="h-3.5 w-3.5" />
                                                تبديل البيئة
                                            </Button>
                                        ) : (
                                            <Badge variant="outline" className="h-8 text-xs border-primary text-primary px-3 flex items-center gap-1">
                                                <CheckCircle className="h-3 w-3" />
                                                مفعلة
                                            </Badge>
                                        )}

                                        <Button asChild variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                                            <Link to={`/organizations/${org.id}`}>
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                        </Button>
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

export default Organizations;
