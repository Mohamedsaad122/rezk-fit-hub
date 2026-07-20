import React, { useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useInvoice } from '@/hooks/use-invoices';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { ArrowRight, Printer, Download, CreditCard, Building } from 'lucide-react';

export const InvoiceDetails = () => {
    const { invoiceId } = useParams();
    const { invoice, isLoading } = useInvoice(invoiceId);
    const invoiceRef = useRef(null);

    const handlePrint = () => {
        window.print();
    };

    if (isLoading) {
        return <div className="text-center py-12 text-muted-foreground">جاري تحميل تفاصيل الفاتورة...</div>;
    }

    if (!invoice) {
        return (
            <div className="container mx-auto p-6 space-y-6 text-center rtl" dir="rtl">
                <h1 className="text-xl font-bold">الفاتورة المطلوبة غير موجودة</h1>
                <Button asChild className="mt-4">
                    <Link to="/billing/invoices">العودة إلى الفواتير</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6 text-right" dir="rtl">
            <SEO title={`تفاصيل الفاتورة ${invoice.invoiceNumber}`} />

            <div className="flex flex-col sm:flex-row items-center gap-4 text-right no-print">
                <Button asChild variant="ghost" size="icon" className="shrink-0">
                    <Link to="/billing/invoices">
                        <ArrowRight className="h-5 w-5" />
                    </Link>
                </Button>
                <div className="space-y-1 flex-1">
                    <h1 className="text-2xl font-bold text-foreground">معاينة الفاتورة: {invoice.invoiceNumber}</h1>
                    <p className="text-sm text-muted-foreground">طباعة وتحميل المستندات والمستند المحاسبي.</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={handlePrint} variant="outline" className="gap-1.5 h-9 text-xs">
                        <Printer className="h-4 w-4" />
                        طباعة / PDF
                    </Button>
                </div>
            </div>

            <Card ref={invoiceRef} className="border border-border p-8 space-y-8 bg-card shadow-lg print:border-0 print:shadow-none">
                {/* Invoice Header */}
                <div className="flex flex-col md:flex-row justify-between gap-6 pb-6 border-b border-border">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 justify-start flex-row-reverse">
                            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                                <Building className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-bold text-lg text-foreground">Rezk Fit Hub</span>
                        </div>
                        <p className="text-xs text-muted-foreground">شارع العليا الرئيسي، الرياض، المملكة العربية السعودية</p>
                        <p className="text-xs text-muted-foreground">الرقم الضريبي: 300055599900003</p>
                    </div>

                    <div className="space-y-1 text-left md:text-left">
                        <h2 className="text-xl font-bold text-primary">فاتورة ضريبية مبسطة</h2>
                        <div className="text-sm font-semibold text-foreground">{invoice.invoiceNumber}</div>
                        <div className="text-xs text-muted-foreground">تاريخ الإصدار: {new Date(invoice.issueDate).toLocaleDateString('ar-EG')}</div>
                        <div className="text-xs text-muted-foreground">تاريخ الاستحقاق: {new Date(invoice.dueDate).toLocaleDateString('ar-EG')}</div>
                        <Badge variant={invoice.status === 'Paid' ? 'default' : 'destructive'} className="mt-2 text-xs">
                            {invoice.status === 'Paid' ? 'مدفوعة' : 'غير مدفوعة'}
                        </Badge>
                    </div>
                </div>

                {/* Items Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right">
                        <thead>
                            <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                                <th className="p-3 text-right">البند / الخدمة</th>
                                <th className="p-3 text-center">الكمية</th>
                                <th className="p-3 text-left">سعر الوحدة</th>
                                <th className="p-3 text-left">المجموع</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {invoice.items.map((item, idx) => (
                                <tr key={idx} className="hover:bg-muted/10 text-foreground">
                                    <td className="p-3 font-medium text-right">{item.description}</td>
                                    <td className="p-3 text-center">{item.quantity}</td>
                                    <td className="p-3 text-left">{item.unitPrice} {invoice.currency}</td>
                                    <td className="p-3 text-left font-bold">{item.amount} {invoice.currency}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totals Summary */}
                <div className="flex justify-end pt-4 border-t border-border">
                    <div className="w-full md:w-80 space-y-2 text-sm">
                        <div className="flex justify-between flex-row-reverse text-muted-foreground">
                            <span>المجموع الفرعي:</span>
                            <span>{invoice.subtotal} {invoice.currency}</span>
                        </div>
                        <div className="flex justify-between flex-row-reverse text-muted-foreground">
                            <span>الخصم المطبق:</span>
                            <span>-{invoice.discount || 0} {invoice.currency}</span>
                        </div>
                        <div className="flex justify-between flex-row-reverse text-muted-foreground">
                            <span>ضريبة القيمة المضافة (15%):</span>
                            <span>+{invoice.tax} {invoice.currency}</span>
                        </div>
                        <div className="flex justify-between flex-row-reverse border-t border-border pt-2 text-base font-bold text-foreground">
                            <span>الإجمالي المستحق:</span>
                            <span>{invoice.total} {invoice.currency}</span>
                        </div>
                    </div>
                </div>

                {/* Payment History */}
                {invoice.paymentHistory?.length > 0 && (
                    <div className="pt-6 border-t border-border space-y-3">
                        <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5 justify-start">
                            <CreditCard className="h-4 w-4 text-primary" />
                            سجل عمليات الدفع على الفاتورة
                        </h4>
                        <div className="space-y-2 text-xs">
                            {invoice.paymentHistory.map((p, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-muted/20 p-2 rounded-lg flex-row-reverse">
                                    <span className="font-semibold">{p.amount} {invoice.currency}</span>
                                    <span className="text-muted-foreground">تاريخ السداد: {new Date(p.timestamp).toLocaleString('ar-EG')}</span>
                                    <Badge variant="outline" className="text-[10px] border-emerald-500/20 text-emerald-600">
                                        {p.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default InvoiceDetails;
