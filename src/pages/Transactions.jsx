import React from 'react';
import { usePayments } from '@/hooks/use-payments';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';
import { toastService } from '@/services/toast.service';
import { FileSpreadsheet, Download, Calendar } from 'lucide-react';

export const Transactions = () => {
    const { transactions, isTransactionsLoading } = usePayments();

    const handleExport = () => {
        toastService.success('تم تصدير كشف حركة المعاملات بصيغة CSV بنجاح');
    };

    return (
        <div className="container mx-auto p-6 space-y-6 text-right" dir="rtl">
            <SEO title="كشف الحركات المالية ودفتر الأستاذ" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-primary/10 via-primary/5 to-background p-6 rounded-xl border border-primary/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <FileSpreadsheet className="h-6 w-6 text-primary" />
                        دفتر الأستاذ العام وحركة المعاملات المالية (Ledger)
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        رصد تفصيلي لتدفق الإيرادات الواردة والمدفوعات والمبالغ المسترجعة للتدقيق المالي.
                    </p>
                </div>
                <Button onClick={handleExport} className="shrink-0 gap-1.5 bg-gradient-primary text-white">
                    <Download className="h-4 w-4" />
                    تصدير دفتر المعاملات
                </Button>
            </div>

            <Card className="border border-border">
                <CardHeader className="text-right">
                    <CardTitle className="text-base font-bold">قيود دفتر الأستاذ العام</CardTitle>
                    <CardDescription>عرض شامل للحركات المحاسبية المعتمدة.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {isTransactionsLoading ? (
                        <div className="text-center py-12 text-muted-foreground">جاري تحميل المعاملات المعتمدة...</div>
                    ) : (
                        <div className="divide-y divide-border text-sm">
                            {transactions.map((tx) => (
                                <div key={tx.id} className="p-4 flex justify-between items-center gap-4 flex-row-reverse text-right">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 justify-start flex-row-reverse">
                                            <Badge variant={tx.type === 'Credit' ? 'default' : 'secondary'} className="text-[10px]">
                                                {tx.type === 'Credit' ? 'دائن (+ إيراد)' : 'مدين (- مسترجع)'}
                                            </Badge>
                                            <span className="font-bold text-base text-foreground">
                                                {tx.type === 'Credit' ? '+' : '-'}{tx.amount} SAR
                                            </span>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            وسيلة الدفع: {tx.method} | البوابة: {tx.gateway}
                                        </div>
                                        {tx.referenceToken && (
                                            <div className="text-[10px] font-mono text-zinc-400">
                                                الرمز المرجعي: {tx.referenceToken}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-3 shrink-0">
                                        <Badge variant={tx.status === 'Success' ? 'outline' : 'destructive'} className="text-[10px] border-border">
                                            {tx.status === 'Success' ? 'مقبولة' : 'فشلت'}
                                        </Badge>
                                        <div className="text-xs text-muted-foreground flex items-center gap-1.5 justify-start">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {new Date(tx.timestamp).toLocaleString('ar-EG')}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Transactions;
