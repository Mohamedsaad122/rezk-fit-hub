import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { toastService } from '@/services/toast.service';
import { Key, Plus, Trash2, Shield, Eye, Copy, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import ROUTES from '@/constants/routes.constants';
import { ApiKeyService } from '@/services/api-key.service';
import { DeveloperDocsService } from '@/services/developer-docs.service';

export const APIKeys = () => {
    const [keys, setKeys] = useState([]);
    const [label, setLabel] = useState('');
    const [selectedScopes, setSelectedScopes] = useState([]);
    const [scopesList, setScopesList] = useState([]);

    const fetchKeys = async () => {
        try {
            const list = await ApiKeyService.getKeys();
            setKeys(list);
        } catch {
            // ignore
        }
    };

    useEffect(() => {
        fetchKeys();
        setScopesList(DeveloperDocsService.getScopes());
    }, []);

    const handleCreateKey = async (e) => {
        e.preventDefault();
        if (!label) return;

        try {
            await ApiKeyService.generateKey(label, selectedScopes);
            setLabel('');
            setSelectedScopes([]);
            toastService.success('تم إنشاء مفتاح API Key جديد بنجاح');
            fetchKeys();
        } catch {
            toastService.error('فشل إنشاء مفتاح الوصول');
        }
    };

    const handleRevokeKey = async (id) => {
        try {
            await ApiKeyService.revokeKey(id);
            toastService.success('تم إلغاء صلاحية مفتاح الوصول بنجاح');
            fetchKeys();
        } catch {
            toastService.error('فشل إلغاء مفتاح الوصول');
        }
    };

    const handleCopy = (val) => {
        navigator.clipboard.writeText(val);
        toastService.success('تم نسخ مفتاح الوصول إلى الحافظة');
    };

    const toggleScope = (scope) => {
        if (selectedScopes.includes(scope)) {
            setSelectedScopes(selectedScopes.filter(s => s !== scope));
        } else {
            setSelectedScopes([...selectedScopes, scope]);
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6 text-right" dir="rtl">
            <SEO title="مفاتيح الوصول (API Keys)" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-primary/10 via-primary/5 to-background p-6 rounded-xl border border-primary/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <Key className="h-6 w-6 text-primary" />
                        إدارة مفاتيح المطورين والوصول المباشر (API Keys)
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        توليد وتعيين أذونات Scopes للمفاتيح البرمجية للاتصال الآمن ببوابات النظام.
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
                {/* Form to generate Key */}
                <Card className="border border-border">
                    <CardHeader className="text-right">
                        <CardTitle className="text-base font-bold">توليد مفتاح وصول جديد</CardTitle>
                        <CardDescription className="text-xs">تأكد من تخصيص النطاقات بدقة حسب مبدأ الصلاحيات الأقل.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreateKey} className="space-y-4 text-xs text-right">
                            <div className="space-y-1">
                                <label className="font-semibold block">اسم ووصف المفتاح</label>
                                <input
                                    type="text"
                                    value={label}
                                    onChange={(e) => setLabel(e.target.value)}
                                    placeholder="مثال: مفتاح تكامل المتجر الإلكتروني"
                                    className="w-full p-2 border bg-background text-foreground text-xs rounded"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="font-semibold block">صلاحيات النطاقات (Scopes):</label>
                                <div className="space-y-2 border border-border p-3 rounded-lg bg-muted/5 max-h-[200px] overflow-y-auto">
                                    {scopesList.map(scopeItem => (
                                        <label key={scopeItem.scope} className="flex items-center gap-2 flex-row-reverse justify-end cursor-pointer select-none py-1">
                                            <input
                                                type="checkbox"
                                                checked={selectedScopes.includes(scopeItem.scope)}
                                                onChange={() => toggleScope(scopeItem.scope)}
                                                className="rounded border-border text-primary focus:ring-primary"
                                            />
                                            <div className="text-right">
                                                <span className="font-mono font-semibold block text-[10px] text-primary">{scopeItem.scope}</span>
                                                <span className="text-[10px] text-muted-foreground">{scopeItem.description}</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <Button type="submit" className="w-full gap-2 text-xs">
                                <Plus className="h-4 w-4" />
                                توليد المفتاح
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* List of Keys */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border border-border">
                        <CardHeader className="text-right">
                            <CardTitle className="text-base font-bold">المفاتيح البرمجية النشطة</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {keys.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground text-xs">لا توجد مفاتيح وصول نشطة حالياً.</div>
                            ) : (
                                keys.map(k => (
                                    <div key={k.id} className="p-4 border border-border rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 flex-row-reverse text-right text-xs bg-muted/5">
                                        <div className="space-y-2 w-full md:w-auto">
                                            <div className="flex items-center gap-2 flex-row-reverse justify-end">
                                                <strong className="text-foreground font-bold">{k.label}</strong>
                                                <Badge variant={k.status === 'Active' ? 'default' : 'secondary'} className="text-[9px]">
                                                    {k.status === 'Active' ? 'نشط' : 'ملغى'}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-1.5 font-mono text-[10px] text-primary justify-end">
                                                <span className="truncate max-w-[200px]">{k.value}</span>
                                                {k.status === 'Active' && (
                                                    <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => handleCopy(k.value)}>
                                                        <Copy className="h-3.5 w-3.5" />
                                                    </Button>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap gap-1 justify-end">
                                                {k.scopes.map(s => (
                                                    <Badge key={s} variant="outline" className="text-[9px] font-mono text-primary bg-primary/5">
                                                        {s}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                        {k.status === 'Active' && (
                                            <Button size="xs" variant="destructive" onClick={() => handleRevokeKey(k.id)} className="w-full md:w-auto gap-1">
                                                <Trash2 className="h-3.5 w-3.5" />
                                                إلغاء الصلاحية
                                            </Button>
                                        )}
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

export default APIKeys;
