import React, { useState } from 'react';
import { useInvitations } from '@/hooks/use-invitations';
import { useOrganizations } from '@/hooks/use-organizations';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { toastService } from '@/services/toast.service';
import { Mail, Plus, Send, XCircle, CheckSquare, Trash2 } from 'lucide-react';

export const Invitations = () => {
    const { invitations, inviteMember, acceptInvitation, declineInvitation, cancelInvitation, isLoading } = useInvitations();
    const { activeOrganizationId } = useOrganizations();
    
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('Viewer');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSendInvite = async (e) => {
        e.preventDefault();
        if (!email.trim()) {
            toastService.error('الرجاء تعبئة البريد الإلكتروني');
            return;
        }

        setIsSubmitting(true);
        try {
            await inviteMember({
                email,
                organizationId: activeOrganizationId,
                role
            });
            toastService.success('تم إرسال دعوة الانضمام بنجاح');
            setEmail('');
        } catch (error) {
            console.error(error);
            toastService.error('فشل إرسال دعوة الانضمام');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAcceptInvite = async (id) => {
        try {
            await acceptInvitation(id);
            toastService.success('تمت الموافقة وقبول العضو في المنظمة بنجاح');
        } catch (error) {
            console.error(error);
            toastService.error('فشل قبول الدعوة');
        }
    };

    const handleDeclineInvite = async (id) => {
        try {
            await declineInvitation(id);
            toastService.success('تم رفض دعوة الانضمام بنجاح');
        } catch (error) {
            console.error(error);
            toastService.error('فشل رفض الدعوة');
        }
    };

    const handleCancelInvite = async (id) => {
        if (!window.confirm('هل أنت متأكد من سحب/إلغاء دعوة الانضمام هذه؟')) return;
        try {
            await cancelInvitation(id);
            toastService.success('تم سحب الدعوة بنجاح');
        } catch (error) {
            console.error(error);
            toastService.error('فشل سحب الدعوة');
        }
    };

    const rolesList = ['Owner', 'Administrator', 'Coach', 'Nutritionist', 'Reception', 'Trainer', 'Viewer', 'Custom Role'];

    return (
        <div className="container mx-auto p-6 space-y-6" dir="rtl">
            <SEO title="إدارة دعوات الانضمام (Invitations)" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-primary/10 via-primary/5 to-background p-6 rounded-xl border border-primary/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <Mail className="h-6 w-6 text-primary" />
                        دعوات الانضمام والربط بالمنظمة
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        دعوة موظفين أو مدربين جدد للمنظمة، ومتابعة حالة قبول أو رفض الدعوات المرسلة.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Send Invite Form Card */}
                <Card className="border border-border h-full">
                    <CardHeader className="text-right">
                        <CardTitle className="text-base font-bold flex items-center gap-1.5 flex-row-reverse justify-end">
                            <Plus className="h-4 w-4 text-primary" />
                            إرسال دعوة جديدة
                        </CardTitle>
                        <CardDescription>سيصل رابط انضمام بالبريد للمستخدم المستهدف.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSendInvite} className="space-y-4 text-sm text-right">
                            <div className="space-y-1">
                                <label className="font-semibold block">البريد الإلكتروني للقرين</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="coach@example.com"
                                    className="w-full p-2 rounded border bg-background"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="font-semibold block">الدور الممنوح عند الانضمام</label>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full p-2 rounded border bg-background"
                                    required
                                >
                                    {rolesList.map(r => (
                                        <option key={r} value={r}>{r}</option>
                                    ))}
                                </select>
                            </div>

                            <Button type="submit" disabled={isSubmitting} className="w-full gap-2">
                                <Send className="h-4 w-4" />
                                {isSubmitting ? 'جاري الإرسال...' : 'إرسال دعوة الانضمام'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Invitations List */}
                <div className="lg:col-span-2 space-y-4">
                    {isLoading ? (
                        <div className="text-center py-12 text-muted-foreground">جاري تحميل الدعوات...</div>
                    ) : (
                        invitations.map((invite) => (
                            <Card key={invite.id} className="border border-border">
                                <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="space-y-1 text-right flex-1 min-w-0">
                                        <div className="flex items-center gap-2 justify-start flex-row-reverse">
                                            <Badge variant={
                                                invite.status === 'Pending' ? 'outline' : 
                                                invite.status === 'Accepted' ? 'default' : 'destructive'
                                            } className="text-[9px] px-1.5 py-0.5">
                                                {invite.status === 'Pending' ? 'معلقة' : 
                                                 invite.status === 'Accepted' ? 'مقبولة' : 'مرفوضة'}
                                            </Badge>
                                            <h3 className="font-bold text-base text-foreground truncate">{invite.email}</h3>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            الدور المقترح: <span className="font-semibold">{invite.role}</span> | تاريخ الإرسال: {new Date(invite.sentAt).toLocaleDateString('ar-EG')}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        {invite.status === 'Pending' && (
                                            <>
                                                <Button
                                                    onClick={() => handleAcceptInvite(invite.id)}
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 gap-1.5 text-xs text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10"
                                                >
                                                    <CheckSquare className="h-3.5 w-3.5" />
                                                    قبول (محاكاة)
                                                </Button>

                                                <Button
                                                    onClick={() => handleDeclineInvite(invite.id)}
                                                    variant="outline"
                                                    size="sm"
                                                    className="h-8 gap-1.5 text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
                                                >
                                                    <XCircle className="h-3.5 w-3.5" />
                                                    رفض (محاكاة)
                                                </Button>
                                            </>
                                        )}

                                        <Button
                                            onClick={() => handleCancelInvite(invite.id)}
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:bg-muted"
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Invitations;
