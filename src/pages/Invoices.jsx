import React from 'react';
import { useInvoices } from '@/hooks/use-invoices';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { toastService } from '@/services/toast.service';
import { ClipboardList, Eye, RefreshCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Invoices = () => {
    const { invoices, refundInvoice, isLoading } = useInvoices();

    const handleRefund = async (invoiceId, totalAmount) => {
        const reason = window.prompt('الرجاء إدخال سبب الاسترجاع المالي (مطلوب):');
        if (!reason || !reason.trim()) {
            toastService.error('سبب الاسترجاع مطلوب لإتمام العملية');
            return;
        }

        try {
            await refundInvoice({ invoiceId, amount: totalAmount, reason });
            toastService.success('تمت عملية الاسترجاع المالي بنجاح وقيدت في الدفاتر');
        } catch (error) {
            console.error(error);
            toastService.error('فشل معالجة الاسترجاع المالي');
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6" dir="rtl">
            <SEO title="الفواتير والمستندات المالية" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-primary/10 via-primary/5 to-background p-6 rounded-xl border border-primary/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <ClipboardList className="h-6 w-6 text-primary" />
                        سجلات الفواتير والمستندات المحاسبية
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        متابعة حركة الفواتير المصدرة، المبالغ المستحقة، عمليات الإرجاع المالي والخصومات الصادرة.
                    </p>
                </div>
            </div>

            <Card className="border border-border">
                <CardHeader className="text-right">
                    <CardTitle className="text-base font-bold">فواتير اشتراك المنصة</CardTitle>
                    <CardDescription>عرض كشف الفواتير والمدفوعات التاريخي.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="text-center py-12 text-muted-foreground">جاري تحميل الفواتير...</div>
                    ) : (
                        <div className="divide-y divide-border text-right text-sm">
                            {invoices.map((invoice) => (
                                <div key={invoice.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="space-y-1 min-w-0 flex-1">
                                        <div className="flex items-center gap-2 justify-start flex-row-reverse">
                                            <Badge variant={
                                                invoice.status === 'Paid' ? 'default' : 
                                                invoice.status === 'Pending' ? 'outline' : 'destructive'
                                            } className="text-[10px] px-1.5 py-0.5">
                                                {invoice.status === 'Paid' ? 'مدفوعة' : 
                                                 invoice.status === 'Pending' ? 'بانتظار السداد' : 
                                                 invoice.status === 'Cancelled' ? 'مسترجعة/ملغاة' : 'فشلت عملية الدفع'}
                                            </Badge>
                                            <h3 className="font-bold text-base text-foreground">{invoice.invoiceNumber}</h3>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            الفترة: {invoice.billingPeriod} | تاريخ الإصدار: {new Date(invoice.issueDate).toLocaleDateString('ar-EG')}
                                        </p>
                                        <div className="text-xs font-bold text-foreground">
                                            الإجمالي: {invoice.total} {invoice.currency}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        <Button asChild variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                                            <Link to={`/billing/invoices/${invoice.id}`}>
                                                <Eye className="h-3.5 w-3.5" />
                                                معاينة وتنزيل
                                            </Link>
                                        </Button>

                                        {invoice.status === 'Paid' && (
                                            <Button
                                                onClick={() => handleRefund(invoice.id, invoice.total)}
                                                variant="outline"
                                                size="sm"
                                                className="h-8 gap-1.5 text-xs text-destructive border-destructive/20 hover:bg-destructive/10"
                                            >
                                                <RefreshCcw className="h-3.5 w-3.5" />
                                                استرجاع مالي
                                            </Button>
                                        )}
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

export default Invoices;
