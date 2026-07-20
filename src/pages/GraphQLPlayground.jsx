import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { toastService } from '@/services/toast.service';
import { Play, ArrowLeft, Terminal, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import ROUTES from '@/constants/routes.constants';
import { GraphqlService } from '@/services/graphql.service';

export const GraphQLPlayground = () => {
    const [query, setQuery] = useState(`
query {
  clients {
    id
    name
    email
    status
  }
}
    `.trim());
    const [result, setResult] = useState(null);
    const [schema, setSchema] = useState('');

    useEffect(() => {
        setSchema(GraphqlService.getSchema());
    }, []);

    const handleExecute = async () => {
        try {
            const response = await GraphqlService.execute(query);
            setResult(response);
            toastService.success('تم تنفيذ استعلام GraphQL بنجاح');
        } catch (err) {
            setResult({ errors: [{ message: err.message }] });
            toastService.error('فشل تنفيذ الاستعلام');
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6 text-right" dir="rtl">
            <SEO title="بوابة GraphQL (GraphQL Playground)" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-primary/10 via-primary/5 to-background p-6 rounded-xl border border-primary/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <Terminal className="h-6 w-6 text-primary" />
                        بوابة استعلامات ومستكشف GraphQL (Playground)
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        مستكشف تفاعلي لتجربة استعلامات GraphQL الشاملة ومراجعة Schema ومخططات الربط.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                        <Link to={ROUTES.DEVELOPER_PORTAL} className="gap-1">
                            <ArrowLeft className="h-4 w-4" />
                            العودة للبوابة
                        </Link>
                    </Button>
                    <Button onClick={handleExecute} className="gap-2 text-xs">
                        <Play className="h-4 w-4" />
                        تشغيل الاستعلام
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Query Editor */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border border-border">
                        <CardHeader className="text-right pb-2">
                            <CardTitle className="text-sm font-bold flex items-center gap-1.5 flex-row-reverse justify-end">
                                <Terminal className="h-4 w-4 text-primary" />
                                محرر الاستعلامات (GraphQL Query)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <textarea
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="w-full h-[250px] p-4 font-mono text-xs bg-zinc-950 text-emerald-400 rounded-lg border border-border focus:ring-1 focus:ring-primary focus:outline-none"
                                dir="ltr"
                            />
                        </CardContent>
                    </Card>

                    {/* Execution Result */}
                    <Card className="border border-border">
                        <CardHeader className="text-right pb-2">
                            <CardTitle className="text-sm font-bold">مخرجات الاستجابة (JSON Response)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-zinc-950 p-4 rounded-lg border border-border min-h-[150px] overflow-x-auto">
                                {result ? (
                                    <pre className="font-mono text-xs text-sky-400 text-left" dir="ltr">
                                        {JSON.stringify(result, null, 2)}
                                    </pre>
                                ) : (
                                    <div className="text-center py-12 text-zinc-500 text-xs">قم بتشغيل استعلام لعرض النتائج هنا.</div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Schema Documentation Explorer */}
                <Card className="border border-border h-full">
                    <CardHeader className="text-right">
                        <CardTitle className="text-base font-bold flex items-center gap-1.5 flex-row-reverse justify-end">
                            <HelpCircle className="h-5 w-5 text-primary" />
                            مستندات الهيكل (Schema Docs)
                        </CardTitle>
                        <CardDescription className="text-xs">تفاصيل الأنواع وحقول البيانات المتوفرة في المنصة.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <pre className="font-mono text-[10px] text-muted-foreground bg-muted/20 p-3 rounded border border-border text-left" dir="ltr">
                            {schema}
                        </pre>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default GraphQLPlayground;
