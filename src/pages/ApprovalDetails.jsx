import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { toastService } from '@/services/toast.service';
import { ArrowLeft, Check, X, ShieldAlert } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ROUTES from '@/constants/routes.constants';
import { ApprovalService } from '@/services/approval.service';
import ApprovalTimeline from '@/components/workflow/ApprovalTimeline';

export const ApprovalDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [request, setRequest] = useState(null);
    const [comment, setComment] = useState('');

    const fetchDetail = async () => {
        try {
            const list = await ApprovalService.getApprovals();
            const found = list.find(a => String(a.id) === String(id));
            setRequest(found);
        } catch {
            // ignore
        }
    };

    useEffect(() => {
        fetchDetail();
    }, [id]);

    const handleDecision = async (decision) => {
        if (!request) return;
        try {
            await ApprovalService.submitDecision(request.id, 'Admin User', decision, comment);
            toastService.success(`تم تسجيل قرار ${decision === 'Approved' ? 'الموافقة والاعتماد' : 'الرفض للطلب'} بنجاح`);
            fetchDetail();
        } catch {
            toastService.error('فشل حفظ القرار');
        }
    };

    const handleEscalate = async () => {
        if (!request) return;
        try {
            await ApprovalService.escalateApproval(request.id);
            toastService.success('تم تصعيد طلب الاعتماد للمستوى الأعلى بنجاح');
            fetchDetail();
        } catch {
            toastService.error('فشل تصعيد الطلب');
        }
    };

    if (!request) {
        return (
            <div className="container mx-auto p-6 text-center text-muted-foreground text-xs">
                تحميل تفاصيل الطلب...
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6 text-right" dir="rtl">
            <SEO title="تفاصيل طلب الاعتماد" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-red-500/10 via-primary/5 to-background p-6 rounded-xl border border-red-500/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        طلب اعتماد: {request.title}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        مراجعة التغييرات واتخاذ القرارات الإدارية المناسبة بخصوص الملف المرفق.
                    </p>
                </div>
                <Button asChild variant="outline" size="sm">
                    <Link to="/security-center/approvals" className="gap-1">
                        <ArrowLeft className="h-4 w-4" />
                        العودة للمركز
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs text-right">
                {/* Details card */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border border-border">
                        <CardHeader>
                            <div className="flex justify-between items-center flex-row-reverse">
                                <Badge variant={request.status === 'Approved' ? 'default' : request.status === 'Rejected' ? 'destructive' : 'outline'}>
                                    {request.status}
                                </Badge>
                                <CardTitle className="text-base font-bold">ملخص محتوى الطلب</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-muted-foreground leading-relaxed">{request.description}</p>

                            {request.status === 'Pending' && (
                                <div className="border-t border-border pt-4 space-y-4">
                                    <div className="space-y-1">
                                        <label className="font-semibold block text-foreground">تعليق أو مبرر القرار (اختياري):</label>
                                        <textarea
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            placeholder="أدخل أي ملاحظات ترغب في توثيقها مع القرار..."
                                            className="w-full p-2 border bg-background text-foreground text-xs rounded h-20 text-right"
                                        />
                                    </div>

                                    <div className="flex flex-wrap gap-2 justify-end">
                                        <Button size="sm" variant="outline" onClick={handleEscalate} className="gap-1">
                                            <ShieldAlert className="h-4 w-4 text-amber-500" />
                                            تصعيد الطلب
                                        </Button>
                                        <Button size="sm" variant="destructive" onClick={() => handleDecision('Rejected')} className="gap-1">
                                            <X className="h-4 w-4" />
                                            رفض الطلب
                                        </Button>
                                        <Button size="sm" onClick={() => handleDecision('Approved')} className="gap-1">
                                            <Check className="h-4 w-4" />
                                            اعتماد وموافقة
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Timeline status track */}
                <div className="space-y-6">
                    <Card className="border border-border">
                        <CardContent className="p-6">
                            <ApprovalTimeline approval={request} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ApprovalDetails;
