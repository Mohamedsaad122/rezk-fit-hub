import React, { useState } from 'react';
import { useMembers } from '@/hooks/use-members';
import { useOrganizations } from '@/hooks/use-organizations';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { toastService } from '@/services/toast.service';
import { User, Users, Shield, ShieldAlert, KeyRound, Ban, CheckCircle, Trash2 } from 'lucide-react';

export const Members = () => {
    const { members, changeRole, suspendMember, reactivateMember, deleteMember, isLoading } = useMembers();
    const { activeOrganizationId, transferOwnership } = useOrganizations();

    const handleRoleChange = async (id, newRole) => {
        try {
            await changeRole({ id, role: newRole });
            toastService.success('تم تعديل دور العضو بنجاح');
        } catch (error) {
            console.error(error);
            toastService.error('فشل تعديل دور العضو');
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        try {
            if (currentStatus === 'Active') {
                await suspendMember(id);
                toastService.success('تم إيقاف حساب العضو بنجاح');
            } else {
                await reactivateMember(id);
                toastService.success('تم تنشيط حساب العضو بنجاح');
            }
        } catch (error) {
            console.error(error);
            toastService.error('فشل تعديل حالة الحساب');
        }
    };

    const handleTransferOwnership = async (targetId) => {
        // Find current owner
        const currentOwner = members.find(m => m.role === 'Owner');
        if (!currentOwner) {
            toastService.error('لم يتم العثور على المالك الحالي للمنظمة');
            return;
        }

        if (!window.confirm('هل أنت متأكد من رغبتك في نقل ملكية المنظمة بالكامل لهذا العضو؟ سيتم خفض رتبتك إلى مدير (Administrator).')) return;
        try {
            await transferOwnership({
                orgId: activeOrganizationId,
                currentOwnerId: currentOwner.id,
                targetMemberId: targetId
            });
            toastService.success('تم نقل الملكية بنجاح');
        } catch (error) {
            console.error(error);
            toastService.error(error.message || 'فشل نقل ملكية المنظمة');
        }
    };

    const handleDeleteMember = async (id) => {
        if (!window.confirm('هل أنت متأكد من حذف حساب العضو واستبعاده نهائياً؟')) return;
        try {
            await deleteMember(id);
            toastService.success('تم حذف العضو بنجاح');
        } catch (error) {
            console.error(error);
            toastService.error('فشل حذف العضو');
        }
    };

    const rolesList = ['Owner', 'Administrator', 'Coach', 'Nutritionist', 'Reception', 'Trainer', 'Viewer', 'Custom Role'];

    return (
        <div className="container mx-auto p-6 space-y-6" dir="rtl">
            <SEO title="إدارة أعضاء المنظمة (Members)" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-primary/10 via-primary/5 to-background p-6 rounded-xl border border-primary/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <Users className="h-6 w-6 text-primary" />
                        أعضاء الكادر والموظفين بالمنظمة
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        إدارة صلاحيات الموظفين والمدربين، حظر الحسابات، ونقل ملكية المنظمة.
                    </p>
                </div>
            </div>

            <Card className="border border-border">
                <CardHeader className="text-right">
                    <CardTitle className="text-base font-bold">جدول الكوادر والوظائف الحاليين ({members.length})</CardTitle>
                    <CardDescription>التحكم الكامل بالصلاحيات والأدوار الممنوحة.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="text-center py-12 text-muted-foreground">جاري تحميل الأعضاء...</div>
                    ) : (
                        <div className="divide-y divide-border">
                            {members.map((member) => (
                                <div key={member.id} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-right">
                                    <div className="space-y-1 min-w-0">
                                        <div className="flex items-center gap-2 justify-start flex-row-reverse">
                                            <Badge variant={member.status === 'Active' ? 'default' : 'destructive'} className="text-[10px] px-1.5 py-0.5">
                                                {member.status === 'Active' ? 'نشط' : 'موقوف'}
                                            </Badge>
                                            <h3 className="font-bold text-base text-foreground">{member.name}</h3>
                                        </div>
                                        <p className="text-xs text-muted-foreground">{member.email}</p>
                                        <div className="text-[10px] text-muted-foreground">
                                            تاريخ الانضمام: {new Date(member.joinedAt).toLocaleDateString('ar-EG')}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3">
                                        {/* Role Editor */}
                                        <div className="flex items-center gap-1">
                                            <Shield className="h-4 w-4 text-muted-foreground" />
                                            <select
                                                value={member.role}
                                                onChange={(e) => handleRoleChange(member.id, e.target.value)}
                                                disabled={member.role === 'Owner'}
                                                className="p-1.5 rounded border bg-background text-xs"
                                            >
                                                {rolesList.map(r => (
                                                    <option key={r} value={r}>{r}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Suspend Toggle */}
                                        <Button
                                            onClick={() => handleToggleStatus(member.id, member.status)}
                                            variant={member.status === 'Active' ? 'outline' : 'default'}
                                            size="sm"
                                            disabled={member.role === 'Owner'}
                                            className="h-8 gap-1 text-xs"
                                        >
                                            {member.status === 'Active' ? (
                                                <>
                                                    <Ban className="h-3.5 w-3.5" />
                                                    إيقاف
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle className="h-3.5 w-3.5" />
                                                    تنشيط
                                                </>
                                            )}
                                        </Button>

                                        {/* Transfer Ownership */}
                                        {member.role !== 'Owner' && member.status === 'Active' && (
                                            <Button
                                                onClick={() => handleTransferOwnership(member.id)}
                                                variant="outline"
                                                size="sm"
                                                className="h-8 gap-1 text-xs border-amber-500/50 hover:bg-amber-500/10 text-amber-600"
                                            >
                                                <KeyRound className="h-3.5 w-3.5" />
                                                نقل الملكية
                                            </Button>
                                        )}

                                        {/* Delete Member */}
                                        <Button
                                            onClick={() => handleDeleteMember(member.id)}
                                            variant="ghost"
                                            size="icon"
                                            disabled={member.role === 'Owner'}
                                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
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

export default Members;
