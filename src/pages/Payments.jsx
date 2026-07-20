import React from 'react';
import { usePayments } from '@/hooks/use-payments';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { CreditCard, Calendar } from 'lucide-react';

export const Payments = () => {
    const { payments, isPaymentsLoading } = usePayments();

    return (
        <div className="container mx-auto p-6 space-y-6 text-right" dir="rtl">
            <SEO title="سجل المدفوعات والتحويلات" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-primary/10 via-primary/5 to-background p-6 rounded-xl border border-primary/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <CreditCard className="h-6 w-6 text-primary" />
                        سجلات المدفوعات وتأكيدات بوابات الدفع
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        كشف عمليات التحصيل المالي، الدفع الإلكتروني، وتأكيدات التحويلات البنكية.
                    </p>
                </div>
            </div>

            <Card className="border border-border">
                <CardHeader className="text-right">
                    <CardTitle className="text-base font-bold">عمليات الدفع والتسوية الأخيرة ({payments.length})</CardTitle>
                    <CardDescription>عرض حالة وسجل العمليات الصادرة والواردة.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {isPaymentsLoading ? (
                        <div className="text-center py-12 text-muted-foreground">جاري تحميل المدفوعات...</div>
                    ) : (
                        <div className="divide-y divide-border text-sm">
                            {payments.map((payment) => (
                                <div key={payment.id} className="p-4 flex justify-between items-center gap-4 flex-row-reverse text-right">
                                    <div className="space-y-1">
                                        <div className="font-bold text-base text-foreground">
                                            +{payment.amount} SAR
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            الوسيلة: {payment.method} | البوابة: {payment.gateway}
                                        </div>
                                        {payment.gatewayToken && (
                                            <div className="text-[10px] font-mono text-zinc-400">
                                                الرمز المرجعي: {payment.gatewayToken}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-3 shrink-0">
                                        <Badge variant={payment.status === 'Success' ? 'default' : 'destructive'} className="text-[10px]">
                                            {payment.status === 'Success' ? 'مقبولة' : 
                                             payment.status === 'Pending' ? 'معلقة' : 'فشلت'}
                                        </Badge>
                                        <div className="text-xs text-muted-foreground flex items-center gap-1.5 justify-start">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {new Date(payment.timestamp).toLocaleString('ar-EG')}
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

export default Payments;
