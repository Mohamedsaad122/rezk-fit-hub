import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { toastService } from '@/services/toast.service';
import { ArrowLeft, Download, Code, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import ROUTES from '@/constants/routes.constants';
import { SdkGeneratorService } from '@/services/sdk-generator.service';
import { ApiKeyService } from '@/services/api-key.service';

export const SDKDownloads = () => {
    const [languages] = useState([
        'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'PHP', 'Java', 'C#', 'Flutter'
    ]);
    const [selectedLanguage, setSelectedLanguage] = useState('JavaScript');
    const [keys, setKeys] = useState([]);
    const [selectedKey, setSelectedKey] = useState('');
    const [generatedCode, setGeneratedCode] = useState('');

    const fetchKeys = async () => {
        try {
            const list = await ApiKeyService.getKeys();
            setKeys(list);
            if (list.length > 0) {
                setSelectedKey(list[0].value);
            }
        } catch {
            // ignore
        }
    };

    useEffect(() => {
        fetchKeys();
    }, []);

    useEffect(() => {
        const code = SdkGeneratorService.generateSdkCode(selectedLanguage, selectedKey);
        setGeneratedCode(code);
    }, [selectedLanguage, selectedKey]);

    const handleDownload = () => {
        toastService.success(`جاري تنزيل حزمة SDK الخاصة بـ ${selectedLanguage}...`);
    };

    return (
        <div className="container mx-auto p-6 space-y-6 text-right" dir="rtl">
            <SEO title="تنزيل حزم المطورين (SDK Downloads)" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-primary/10 via-primary/5 to-background p-6 rounded-xl border border-primary/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <Code className="h-6 w-6 text-primary" />
                        بوابة وحزم المطورين البرمجية (SDK Generator)
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        توليد حزم الاتصال والدمج بلغات برمجية متعددة وتضمين مفاتيح الوصول تلقائياً.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                        <Link to={ROUTES.DEVELOPER_PORTAL} className="gap-1">
                            <ArrowLeft className="h-4 w-4" />
                            العودة للبوابة
                        </Link>
                    </Button>
                    <Button onClick={handleDownload} className="gap-2 text-xs">
                        <Download className="h-4 w-4" />
                        تنزيل الحزمة
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Configuration panel */}
                <div className="space-y-6">
                    <Card className="border border-border">
                        <CardHeader className="text-right">
                            <CardTitle className="text-base font-bold">إعدادات الحزمة البرمجية</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-xs text-right">
                            {/* Choose language */}
                            <div className="space-y-1">
                                <label className="font-semibold block">اختر لغة البرمجة أو إطار العمل:</label>
                                <select
                                    value={selectedLanguage}
                                    onChange={(e) => setSelectedLanguage(e.target.value)}
                                    className="w-full p-2 border bg-background text-foreground text-xs rounded"
                                >
                                    {languages.map(lang => (
                                        <option key={lang} value={lang}>{lang}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Choose API Key */}
                            <div className="space-y-1">
                                <label className="font-semibold block">تضمين مفتاح الوصول (API Key):</label>
                                {keys.length === 0 ? (
                                    <div className="text-amber-500 text-[10px] bg-amber-500/10 border border-amber-500/20 p-2 rounded">
                                        يرجى توليد مفتاح API Key أولاً ليتم تضمينه في حزمتك تلقائياً.
                                    </div>
                                ) : (
                                    <select
                                        value={selectedKey}
                                        onChange={(e) => setSelectedKey(e.target.value)}
                                        className="w-full p-2 border bg-background text-foreground text-xs rounded font-mono text-primary"
                                    >
                                        {keys.map(k => (
                                            <option key={k.id} value={k.value}>{k.label} ({k.value.substring(0, 15)}...)</option>
                                        ))}
                                    </select>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Boilerplate Display */}
                <div className="lg:col-span-2">
                    <Card className="border border-border">
                        <CardHeader className="text-right pb-2">
                            <CardTitle className="text-sm font-bold flex items-center gap-1.5 flex-row-reverse justify-end">
                                <Code className="h-4 w-4 text-primary" />
                                كود التهيئة السريع ({selectedLanguage} Boilerplate)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <pre className="w-full h-[350px] p-4 font-mono text-[11px] bg-zinc-950 text-sky-400 rounded-lg border border-border overflow-y-auto text-left" dir="ltr">
                                {generatedCode}
                            </pre>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SDKDownloads;
