import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { toastService } from '@/services/toast.service';
import { Plus, Trash2, ArrowLeft, Copy, ArrowLeftRight, Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import ROUTES from '@/constants/routes.constants';
import { DeveloperService } from '@/services/developer.service';

export const OAuthApps = () => {
    const [apps, setApps] = useState([]);
    const [name, setName] = useState('');
    const [redirectUri, setRedirectUri] = useState('');

    const fetchApps = async () => {
        try {
            const list = await DeveloperService.getApps();
            setApps(list);
        } catch {
            // ignore
        }
    };

    useEffect(() => {
        fetchApps();
    }, []);

    const handleCreateApp = async (e) => {
        e.preventDefault();
        if (!name || !redirectUri) return;

        try {
            await DeveloperService.registerApp(name, null, [redirectUri]);
            setName('');
            setRedirectUri('');
            toastService.success('تم تسجيل تطبيق OAuth جديد بنجاح');
            fetchApps();
        } catch {
            toastService.error('فشل تسجيل التطبيق');
        }
    };

    const handleDeleteApp = async (id) => {
        try {
            await DeveloperService.deleteApp(id);
            toastService.success('تم حذف التطبيق بنجاح');
            fetchApps();
        } catch {
            toastService.error('فشل حذف التطبيق');
        }
    };

    const handleCopy = (val) => {
        navigator.clipboard.writeText(val);
        toastService.success('تم نسخ القيمة للحافظة');
    };

    return (
        <div className="container mx-auto p-6 space-y-6 text-right" dir="rtl">
            <SEO title="تطبيقات OAuth (OAuth Apps)" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-primary/10 via-primary/5 to-background p-6 rounded-xl border border-primary/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <ArrowLeftRight className="h-6 w-6 text-primary" />
                        بوابة تطبيقات الطرف الثالث والوصول الفيدرالي (OAuth 2.0 / OIDC)
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        تسجيل وإدارة تطبيقات الشركاء لتوفير الوصول المعتمد على Scopes لبيانات العملاء.
                    </p>
                </div>
                <Button asChild variant="outline" size="sm">
                    <Link to={ROUTES.DEVELOPER_PORTAL} className="gap-1">
                        <ArrowLeft className="h-4 w-4" />
                        العودة للبوابة
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* App Registration Form */}
                <Card className="border border-border">
                    <CardHeader className="text-right">
                        <CardTitle className="text-base font-bold">تسجيل تطبيق OAuth جديد</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreateApp} className="space-y-4 text-xs text-right">
                            <div className="space-y-1">
                                <label className="font-semibold block">اسم التطبيق</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="مثال: تطبيق الجوال المساعد للمدربين"
                                    className="w-full p-2 border bg-background text-foreground text-xs rounded"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="font-semibold block">رابط إعادة التوجيه المعتمد (Callback URL)</label>
                                <input
                                    type="url"
                                    value={redirectUri}
                                    onChange={(e) => setRedirectUri(e.target.value)}
                                    placeholder="https://yourapp.com/oauth/callback"
                                    className="w-full p-2 border bg-background text-foreground text-xs rounded"
                                    required
                                />
                            </div>

                            <Button type="submit" className="w-full gap-2 text-xs">
                                <Plus className="h-4 w-4" />
                                تسجيل التطبيق
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Registered Apps List */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border border-border">
                        <CardHeader className="text-right">
                            <CardTitle className="text-base font-bold">التطبيقات المسجلة</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {apps.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground text-xs">لا توجد تطبيقات مسجلة حالياً.</div>
                            ) : (
                                apps.map(app => (
                                    <div key={app.id} className="p-4 border border-border rounded-xl flex flex-col gap-4 text-right text-xs bg-muted/5">
                                        <div className="flex justify-between items-center flex-row-reverse">
                                            <div className="flex items-center gap-2 flex-row-reverse">
                                                <strong className="text-base text-foreground font-bold">{app.name}</strong>
                                                <Badge variant="default" className="text-[9px]">نشط</Badge>
                                            </div>
                                            <Button size="xs" variant="destructive" onClick={() => handleDeleteApp(app.id)} className="gap-1">
                                                <Trash2 className="h-3.5 w-3.5" />
                                                إلغاء التطبيق
                                            </Button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-border pt-4">
                                            <div className="space-y-1">
                                                <span className="text-muted-foreground font-semibold block text-[10px]">Client ID:</span>
                                                <div className="flex items-center gap-1.5 font-mono text-[10px] text-primary justify-end">
                                                    <span>{app.clientId}</span>
                                                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleCopy(app.clientId)}>
                                                        <Copy className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-muted-foreground font-semibold block text-[10px]">Client Secret:</span>
                                                <div className="flex items-center gap-1.5 font-mono text-[10px] text-primary justify-end">
                                                    <span className="truncate max-w-[150px]">{app.clientSecret}</span>
                                                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleCopy(app.clientSecret)}>
                                                        <Copy className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="border-t border-border pt-2 space-y-1">
                                            <span className="text-muted-foreground font-semibold block text-[10px]">Callback URLs:</span>
                                            {app.redirectUris.map((uri, idx) => (
                                                <div key={idx} className="flex items-center gap-1 text-[10px] font-mono text-foreground justify-end">
                                                    <span>{uri}</span>
                                                    <LinkIcon className="h-3 w-3 text-muted-foreground" />
                                                </div>
                                            ))}
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

export default OAuthApps;
