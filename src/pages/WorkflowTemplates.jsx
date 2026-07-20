import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';
import { toastService } from '@/services/toast.service';
import { ArrowLeft, Sparkles, Copy } from 'lucide-react';
import { Link } from 'react-router-dom';
import ROUTES from '@/constants/routes.constants';
import { WorkflowService } from '@/services/workflow.service';

export const WorkflowTemplates = () => {
    const templates = [
        {
            title: 'رسالة ترحيبية وتعيين التمارين تلقائياً',
            desc: 'عند تسجيل عميل جديد، يتم الانتظار لمدة 10 ثوانٍ ثم إرسال بريد ترحيبي وتعيين جدول التمارين للمبتدئين.',
            trigger: 'ClientCreated',
            nodes: [
                { id: 't1', type: 'Trigger', label: 'حدث: تسجيل العميل' },
                { id: 'd1', type: 'Delay', label: 'انتظار 10 ثوانٍ', parameters: { seconds: 10 } },
                { id: 'a1', type: 'Action', label: 'إرسال بريد ترحيبي' }
            ],
            edges: [
                { source: 't1', target: 'd1' },
                { source: 'd1', target: 'a1' }
            ]
        },
        {
            title: 'اعتماد الفواتير الكبيرة',
            desc: 'عند صدور فاتورة تزيد عن 5000 ريال، يتم إرسال طلب اعتماد للمدير المالي قبل إصدار الإيصال النهائي.',
            trigger: 'InvoiceGenerated',
            nodes: [
                { id: 't1', type: 'Trigger', label: 'حدث: صدور الفاتورة' },
                { id: 'c1', type: 'Condition', label: 'الشرط: القيمة > 5000' },
                { id: 'ap1', type: 'Approval', label: 'طلب اعتماد المدير المالي' }
            ],
            edges: [
                { source: 't1', target: 'c1' },
                { source: 'c1', target: 'ap1' }
            ]
        }
    ];

    const handleImport = async (tpl) => {
        try {
            await WorkflowService.createWorkflow(tpl.title, tpl.desc, tpl.trigger, tpl.nodes, tpl.edges);
            toastService.success('تم استيراد مخطط القالب وحفظه كمسودة بنجاح');
        } catch {
            toastService.error('فشل استيراد قالب الأتمتة');
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6 text-right" dir="rtl">
            <SEO title="قوالب الأتمتة ومسارات العمل" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-red-500/10 via-primary/5 to-background p-6 rounded-xl border border-red-500/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <Sparkles className="h-6 w-6 text-red-500" />
                        مكتبة قوالب أتمتة الأعمال (Workflow Templates)
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        مجموعة مميزة من مسارات العمل المعرفة مسبقاً لتسريع التهيئة وإدارة علاقات العملاء والفواتير تلقائياً.
                    </p>
                </div>
                <Button asChild variant="outline" size="sm">
                    <Link to={ROUTES.SECURITY_CENTER} className="gap-1">
                        <ArrowLeft className="h-4 w-4" />
                        العودة للمركز
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-right">
                {templates.map((tpl, i) => (
                    <Card key={i} className="border border-border flex flex-col justify-between">
                        <CardHeader>
                            <CardTitle className="text-base font-bold text-primary">{tpl.title}</CardTitle>
                            <CardDescription className="text-xs">{tpl.desc}</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-2 flex justify-between items-center flex-row-reverse border-t border-border mt-4">
                            <span className="font-mono text-muted-foreground">Trigger: {tpl.trigger}</span>
                            <Button size="xs" onClick={() => handleImport(tpl)} className="gap-1">
                                <Copy className="h-3.5 w-3.5" />
                                استيراد هذا القالب
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default WorkflowTemplates;
