import React, { useState } from 'react';
import { useTeams } from '@/hooks/use-teams';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { toastService } from '@/services/toast.service';
import { Users, Plus, ClipboardList, Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Teams = () => {
    const { teams, createTeam, deleteTeam, isLoading } = useTeams();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCreateTeam = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            toastService.error('الرجاء تعبئة اسم الفريق');
            return;
        }

        setIsSubmitting(true);
        try {
            await createTeam({
                name,
                description
            });
            toastService.success('تم إنشاء فريق العمل الجديد بنجاح');
            setName('');
            setDescription('');
        } catch (error) {
            console.error(error);
            toastService.error('فشل إنشاء الفريق');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteTeam = async (id) => {
        if (!window.confirm('هل أنت متأكد من رغبتك في حذف هذا الفريق نهائياً؟')) return;
        try {
            await deleteTeam(id);
            toastService.success('تم حذف فريق العمل بنجاح');
        } catch (error) {
            console.error(error);
            toastService.error('فشل حذف الفريق');
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6" dir="rtl">
            <SEO title="إدارة فرق العمل (Teams)" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-primary/10 via-primary/5 to-background p-6 rounded-xl border border-primary/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <Users className="h-6 w-6 text-primary" />
                        مجموعات وفرق العمل المشتركة
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        تنظيم الكوادر الطبية والرياضية والإدارية في مجموعات عمل لتبسيط التواصل وتوزيع المهام وحصص التدريب.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Create Team Card */}
                <Card className="border border-border h-full">
                    <CardHeader className="text-right">
                        <CardTitle className="text-base font-bold flex items-center gap-1.5 flex-row-reverse justify-end">
                            <Plus className="h-4 w-4 text-primary" />
                            إنشاء فريق عمل جديد
                        </CardTitle>
                        <CardDescription>أدخل مسمى فريق العمل والغرض التشغيلي منه.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreateTeam} className="space-y-4 text-sm text-right">
                            <div className="space-y-1">
                                <label className="font-semibold block">اسم الفريق</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="مثال: مدربي اللياقة البدنية والحديد"
                                    className="w-full p-2 rounded border bg-background"
                                    required
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="font-semibold block">وصف المهام</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="وصف مختصر لمسؤوليات الفريق..."
                                    className="w-full p-2 rounded border bg-background h-24 resize-none"
                                />
                            </div>

                            <Button type="submit" disabled={isSubmitting} className="w-full">
                                {isSubmitting ? 'جاري الإنشاء...' : 'تأكيد الإنشاء والتفعيل'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Teams List */}
                <div className="lg:col-span-2 space-y-4">
                    {isLoading ? (
                        <div className="text-center py-12 text-muted-foreground">جاري تحميل فرق العمل...</div>
                    ) : (
                        teams.map((team) => (
                            <Card key={team.id} className="border border-border">
                                <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="space-y-1 text-right flex-1 min-w-0">
                                        <div className="flex items-center gap-2 justify-start flex-row-reverse">
                                            <Badge variant="secondary" className="text-[9px] px-1.5 py-0.5">
                                                أعضاء الفريق: {team.memberIds?.length || 0}
                                            </Badge>
                                            <h3 className="font-bold text-base text-foreground truncate">{team.name}</h3>
                                        </div>
                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                            {team.description || 'لا يوجد وصف مضاف لفريق العمل.'}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        <Button asChild variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                                            <Link to={`/teams/${team.id}`}>
                                                <Eye className="h-3.5 w-3.5" />
                                                تفاصيل الأعضاء
                                            </Link>
                                        </Button>

                                        <Button 
                                            onClick={() => handleDeleteTeam(team.id)} 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                        >
                                            <Trash2 className="h-4 w-4" />
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

export default Teams;
