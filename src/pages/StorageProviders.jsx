import React, { useState } from 'react';
import { useIntegrationsStore } from '@/store/integrations.store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';
import { toastService } from '@/services/toast.service';
import { HardDrive, Server } from 'lucide-react';

export const StorageProviders = () => {
    const { storageProvider, setStorageProvider } = useIntegrationsStore();
    const [bucketName, setBucketName] = useState('rezk-fit-hub-enterprise');
    const [region, setRegion] = useState('us-east-1');

    const handleSave = (e) => {
        e.preventDefault();
        toastService.success('تم ربط وتوثيق خادم التخزين السحابي الجديد للمنصة');
    };

    return (
        <div className="container mx-auto p-6 space-y-6 text-right" dir="rtl">
            <SEO title="إعدادات التخزين السحابي والمرفقات" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-primary/10 via-primary/5 to-background p-6 rounded-xl border border-primary/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <HardDrive className="h-6 w-6 text-primary" />
                        بوابات التخزين السحابي والمستندات
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        تخزين صور المتدربين، التقارير الطبية، ونسخ الفواتير السنوية المشفرة.
                    </p>
                </div>
            </div>

            <Card className="border border-border max-w-xl mx-auto">
                <CardHeader className="text-right">
                    <CardTitle className="text-base font-bold flex items-center gap-1.5 flex-row-reverse justify-end">
                        <Server className="h-5 w-5 text-primary" />
                        تهيئة الربط مع التخزين الخارجي
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSave} className="space-y-4 text-sm text-right">
                        <div className="space-y-1">
                            <label className="font-semibold block">المزود النشط (Storage Provider)</label>
                            <select
                                value={storageProvider}
                                onChange={(e) => setStorageProvider(e.target.value)}
                                className="w-full p-2 rounded border bg-background text-foreground"
                            >
                                <option value="AWS_S3">Amazon Web Services S3</option>
                                <option value="GoogleDrive">Google Drive Storage</option>
                                <option value="Dropbox">Dropbox Storage</option>
                                <option value="Cloudinary">Cloudinary (Media Optimized)</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="font-semibold block">اسم الحاوية / الباكت (Bucket / Folder Name)</label>
                            <input
                                type="text"
                                value={bucketName}
                                onChange={(e) => setBucketName(e.target.value)}
                                className="w-full p-2 rounded border bg-background text-foreground text-xs"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="font-semibold block">المنطقة الجغرافية (Region / Cloud Name)</label>
                            <input
                                type="text"
                                value={region}
                                onChange={(e) => setRegion(e.target.value)}
                                className="w-full p-2 rounded border bg-background text-foreground text-xs"
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full">
                            تأكيد وربط الحاوية
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default StorageProviders;
