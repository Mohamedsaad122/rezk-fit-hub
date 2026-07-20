import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTeam, useTeams } from '@/hooks/use-teams';
import { useMembers } from '@/hooks/use-members';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toastService } from '@/services/toast.service';
import SEO from '@/components/SEO';
import { Users, ArrowRight, Plus, Minus, UserMinus, UserPlus } from 'lucide-react';

export const TeamDetails = () => {
    const { teamId } = useParams();
    const { team, isLoading: isTeamLoading } = useTeam(teamId);
    const { addMemberToTeam, removeMemberFromTeam } = useTeams();
    const { members, isLoading: isMembersLoading } = useMembers();

    const [selectedMemberId, setSelectedMemberId] = useState('');

    const handleAddMember = async (e) => {
        e.preventDefault();
        if (!selectedMemberId) {
            toastService.error('الرجاء اختيار العضو المراد إضافته');
            return;
        }

        try {
            await addMemberToTeam({
                teamId: Number(teamId),
                memberId: Number(selectedMemberId)
            });
            toastService.success('تمت إضافة العضو إلى الفريق بنجاح');
            setSelectedMemberId('');
        } catch (error) {
            console.error(error);
            toastService.error('فشل إضافة العضو إلى الفريق');
        }
    };

    const handleRemoveMember = async (memberId) => {
        if (!window.confirm('هل أنت متأكد من استبعاد هذا العضو من الفريق؟')) return;
        try {
            await removeMemberFromTeam({
                teamId: Number(teamId),
                memberId: Number(memberId)
            });
            toastService.success('تم استبعاد العضو من الفريق بنجاح');
        } catch (error) {
            console.error(error);
            toastService.error('فشل استبعاد العضو');
        }
    };

    if (isTeamLoading || isMembersLoading) {
        return <div className="text-center py-12 text-muted-foreground">جاري تحميل تفاصيل فريق العمل...</div>;
    }

    if (!team) {
        return (
            <div className="container mx-auto p-6 space-y-6 text-center rtl" dir="rtl">
                <h1 className="text-xl font-bold">الفريق المطلوب غير موجود</h1>
                <Button asChild className="mt-4">
                    <Link to="/teams">العودة إلى فرق العمل</Link>
                </Button>
            </div>
        );
    }

    // Filter members currently in the team
    const teamMembers = members.filter(m => team.memberIds?.includes(m.id));

    // Filter members not in the team for the drop-down selector
    const candidates = members.filter(m => !team.memberIds?.includes(m.id) && m.status === 'Active');

    return (
        <div className="container mx-auto p-6 space-y-6" dir="rtl">
            <SEO title={`أعضاء وتفاصيل ${team.name}`} />

            <div className="flex flex-col sm:flex-row items-center gap-4 text-right">
                <Button asChild variant="ghost" size="icon" className="shrink-0">
                    <Link to="/teams">
                        <ArrowRight className="h-5 w-5" />
                    </Link>
                </Button>
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <Users className="h-6 w-6 text-primary" />
                        فريق: {team.name}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {team.description || 'لا يوجد وصف مضاف لفريق العمل.'}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Add Member Card */}
                <Card className="border border-border h-full">
                    <CardHeader className="text-right">
                        <CardTitle className="text-base font-bold flex items-center gap-1.5 flex-row-reverse justify-end">
                            <Plus className="h-4 w-4 text-primary" />
                            إسناد عضو جديد للفريق
                        </CardTitle>
                        <CardDescription>اختر أحد أعضاء المنظمة النشطين لإسناده للمجموعة.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {candidates.length === 0 ? (
                            <p className="text-xs text-muted-foreground text-center py-4">
                                لا يوجد أعضاء متاحون للإضافة حالياً.
                            </p>
                        ) : (
                            <form onSubmit={handleAddMember} className="space-y-4 text-sm text-right">
                                <div className="space-y-1">
                                    <label className="font-semibold block">اسم العضو</label>
                                    <select
                                        value={selectedMemberId}
                                        onChange={(e) => setSelectedMemberId(e.target.value)}
                                        className="w-full p-2 rounded border bg-background"
                                        required
                                    >
                                        <option value="">-- اختر العضو --</option>
                                        {candidates.map(c => (
                                            <option key={c.id} value={c.id}>{c.name} ({c.role})</option>
                                        ))}
                                    </select>
                                </div>

                                <Button type="submit" className="w-full gap-2">
                                    <UserPlus className="h-4 w-4" />
                                    تأكيد الإسناد والموافقة
                                </Button>
                            </form>
                        )}
                    </CardContent>
                </Card>

                {/* Team Members List */}
                <div className="lg:col-span-2 space-y-4">
                    <Card className="border border-border">
                        <CardHeader className="text-right">
                            <CardTitle className="text-base font-bold">أعضاء الفريق الحاليين ({teamMembers.length})</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            {teamMembers.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground text-sm">
                                    لا يوجد أعضاء مسندين لهذا الفريق حالياً.
                                </div>
                            ) : (
                                <div className="divide-y divide-border">
                                    {teamMembers.map((member) => (
                                        <div key={member.id} className="p-4 flex items-center justify-between gap-4 text-right">
                                            <div className="space-y-1">
                                                <h4 className="font-bold text-sm text-foreground">{member.name}</h4>
                                                <p className="text-xs text-muted-foreground">{member.email}</p>
                                            </div>

                                            <div className="flex items-center gap-3 shrink-0">
                                                <Badge variant="outline" className="text-xs">
                                                    {member.role}
                                                </Badge>

                                                <Button
                                                    onClick={() => handleRemoveMember(member.id)}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 gap-1.5 text-xs text-destructive hover:bg-destructive/10"
                                                >
                                                    <UserMinus className="h-3.5 w-3.5" />
                                                    استبعاد
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default TeamDetails;
