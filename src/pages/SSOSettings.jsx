import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { toastService } from '@/services/toast.service';
import { ArrowLeft, Globe, Plus, Trash2, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import ROUTES from '@/constants/routes.constants';
import { SsoService } from '@/services/sso.service';

export const SSOSettings = () => {
    const [configs, setConfigs] = useState([]);
    const [providerType, setProviderType] = useState('SAML2');
    const [providerName, setProviderName] = useState('AzureAD');
    const [entryPoint, setEntryPoint] = useState('');
    const [issuer, setIssuer] = useState('');

    const fetchSso = async () => {
        try {
            const list = await SsoService.getSettings();
            setConfigs(list);
        } catch {
            // ignore
        }
    };

    useEffect(() => {
        fetchSso();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!entryPoint || !issuer) return;

        try {
            const newConfig = {
                id: configs.length + 1,
                providerType,
                providerName,
                entryPoint,
                issuer,
                status: 'Active',
                createdAt: new Date().toISOString()
            };
            const updatedList = [...configs, newConfig];
            await SsoService.saveSettings(updatedList);
            setEntryPoint('');
            setIssuer('');
            toastService.success('تمت إضافة موصل الهوية الموحد (SSO Provider) بنجاح');
            fetchSso();
        } catch {
            toastService.error('فشل إعداد الربط الموحد');
        }
    };

    const handleDelete = async (id) => {
        try {
            const updatedList = configs.filter(c => c.id !== id);
            await SsoService.saveSettings(updatedList);
            toastService.success('تم إيقاف وحذف موصل الهوية الموحد بنجاح');
            fetchSso();
        } catch {
            toastService.error('فشل إزالة الموصل');
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6 text-right" dir="rtl">
            <SEO title="إعدادات الهوية الموحدة (SSO)" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-red-500/10 via-primary/5 to-background p-6 rounded-xl border border-red-500/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <Globe className="h-6 w-6 text-red-500" />
                        بوابة الهوية الموحدة وتسجيل الدخول الفيدرالي (SSO / OIDC)
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        تكامل سلس لربط تسجيل دخول موظفي وعملاء المؤسسة بمزودي الخدمة المركزيين (Azure AD / Okta).
                    </p>
                </div>
                <Button asChild variant="outline" size="sm">
                    <Link to={ROUTES.SECURITY_CENTER} className="gap-1">
                        <ArrowLeft className="h-4 w-4" />
                        العودة للمركز
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs text-right">
                {/* Configuration form */}
                <Card className="border border-border">
                    <CardHeader>
                        <CardTitle className="text-base font-bold">ربط موصل هوية جديد</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div className="space-y-1">
                                <label className="font-semibold block">نوع موصل الربط:</label>
                                <select
                                    value={providerType}
                                    onChange={(e) => setProviderType(e.target.value)}
                                    className="w-full p-2 border bg-background text-foreground text-xs rounded"
                                >
                                    <option value="SAML2">SAML 2.0 Identity Provider</option>
                                    <option value="OIDC">OpenID Connect (OIDC)</option>
                                    <option value="OAuth2">OAuth2 Integration</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="font-semibold block">مزود الخدمة:</label>
                                <select
                                    value={providerName}
                                    onChange={(e) => setProviderName(e.target.value)}
                                    className="w-full p-2 border bg-background text-foreground text-xs rounded"
                                >
                                    <option value="AzureAD">Microsoft Entra ID (Azure AD)</option>
                                    <option value="GoogleWorkspace">Google Workspace SSO</option>
                                    <option value="Okta">Okta Identity</option>
                                    <option value="Auth0">Auth0 Service</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="font-semibold block">رابط المدخل المركزي (SSO Entry Point):</label>
                                <input
                                    type="url"
                                    value={entryPoint}
                                    onChange={(e) => setEntryPoint(e.target.value)}
                                    placeholder="https://identity.provider.com/sso/login"
                                    className="w-full p-2 border bg-background text-foreground text-xs rounded font-mono"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="font-semibold block">معرف الجهة المصدرة (Issuer URL / Entity ID):</label>
                                <input
                                    type="text"
                                    value={issuer}
                                    onChange={(e) => setIssuer(e.target.value)}
                                    placeholder="https://identity.provider.com/metadata"
                                    className="w-full p-2 border bg-background text-foreground text-xs rounded font-mono"
                                    required
                                />
                            </div>

                            <Button type="submit" className="w-full text-xs gap-1">
                                <Plus className="h-4 w-4" />
                                ربط المزود
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* List of active connectors */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border border-border">
                        <CardHeader>
                            <CardTitle className="text-base font-bold">موصلات الربط النشطة</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {configs.length === 0 ? (
                                <div className="text-center py-16 text-muted-foreground text-xs">لا توجد موصلات هوية نشطة حالياً.</div>
                            ) : (
                                configs.map(c => (
                                    <div key={c.id} className="p-4 border border-border rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 flex-row-reverse text-right text-xs bg-muted/5">
                                        <div className="space-y-2 w-full md:w-auto">
                                            <div className="flex items-center gap-2 flex-row-reverse justify-end">
                                                <strong className="text-foreground font-bold">{c.providerName} ({c.providerType})</strong>
                                                <Badge variant="default" className="text-[9px]">نشط</Badge>
                                            </div>
                                            <div className="flex flex-col text-[10px] text-muted-foreground space-y-0.5 font-mono">
                                                <span>Entry: {c.entryPoint}</span>
                                                <span>Issuer: {c.issuer}</span>
                                            </div>
                                        </div>
                                        <Button size="xs" variant="destructive" onClick={() => handleDelete(c.id)} className="w-full md:w-auto gap-1">
                                            <Trash2 className="h-3.5 w-3.5" />
                                            إلغاء الموصل
                                        </Button>
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

export default SSOSettings;
