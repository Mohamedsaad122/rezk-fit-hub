import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { ArrowLeft, ShieldAlert, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';
import ROUTES from '@/constants/routes.constants';

export const RateLimits = () => {
    const limits = [
        { tier: 'Default Tier (مفاتيح API العادية)', limit: '60 request / minute', window: '1 Minute', desc: 'الحد الافتراضي المطبق لجميع حسابات المطورين الجدد لحماية الموارد.' },
        { tier: 'OAuth Application Token', limit: '300 request / minute', window: '1 Minute', desc: 'الحد المطبق للوصول الفيدرالي للشركاء.' },
        { tier: 'GraphQL Queries', limit: '100 request / minute', window: '1 Minute', desc: 'الحد المطبق لاستعلامات GraphQL المدمجة لحماية السيرفر من الاستعلامات العميقة.' },
        { tier: 'Webhooks delivery', limit: '10 request / second', window: '1 Second', desc: 'حد الإرسال الأقصى لمحرك الخطافات السحابية.' }
    ];

    return (
        <div className="container mx-auto p-6 space-y-6 text-right" dir="rtl">
            <SEO title="سياسات حدود الاستهلاك (Rate Limits)" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-primary/10 via-primary/5 to-background p-6 rounded-xl border border-primary/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <Cpu className="h-6 w-6 text-primary" />
                        حدود الاستهلاك وسياسات المرور (Rate Limiting Policies)
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        مراجعة القواعد والقيود الزمنية المفروضة على بوابات الشبكة لحماية خوادم ريزك فيت هب.
                    </p>
                </div>
                <Button asChild variant="outline" size="sm">
                    <Link to={ROUTES.DEVELOPER_PORTAL} className="gap-1">
                        <ArrowLeft className="h-4 w-4" />
                        العودة للبوابة
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {limits.map((lim, idx) => (
                    <Card key={idx} className="border border-border">
                        <CardHeader className="text-right pb-2">
                            <div className="flex justify-between items-center flex-row-reverse">
                                <CardTitle className="text-sm font-bold">{lim.tier}</CardTitle>
                                <Badge variant="warning">{lim.limit}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-2 text-xs text-right">
                            <div className="flex justify-between items-center flex-row-reverse border-b border-border pb-2">
                                <span className="text-muted-foreground font-semibold">النافذة الزمنية (Window):</span>
                                <span className="font-bold text-foreground">{lim.window}</span>
                            </div>
                            <p className="text-[10px] text-muted-foreground pt-1">{lim.desc}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default RateLimits;
