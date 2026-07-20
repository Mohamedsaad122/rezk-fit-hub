import React, { useState } from 'react';
import { Users, Lock, Tag, Eye, Cpu } from 'lucide-react';
import { usePresenceStore } from '../store/presence.store';
import { useCalendarPresenceStore } from '../store/calendar-presence.store';
import { useAllLocks } from '../hooks/use-collaboration';
import { ActivityTimeline } from '../components/ActivityTimeline';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import SEO from '../components/SEO';

export const Collaboration = () => {
    const { onlineUsers } = usePresenceStore();
    const { viewers, editors, cursors } = useCalendarPresenceStore();
    const { locks } = useAllLocks();
    const [activeTab, setActiveTab] = useState('team');

    // Calculate status counts
    const onlineUsersList = Object.entries(onlineUsers).map(([id, u]) => ({
        id: Number(id),
        ...u
    }));

    const statusCounts = {
        online: onlineUsersList.filter(u => u.status === 'online').length,
        away: onlineUsersList.filter(u => u.status === 'away').length,
        busy: onlineUsersList.filter(u => u.status === 'busy').length,
        offline: onlineUsersList.filter(u => u.status === 'offline').length
    };

    const statusColors = {
        online: 'bg-green-500',
        away: 'bg-amber-500',
        busy: 'bg-red-500',
        offline: 'bg-zinc-400'
    };

    const statusLabels = {
        online: 'نشط الآن',
        away: 'خارج العمل',
        busy: 'مشغول / عدم الإزعاج',
        offline: 'غير متصل'
    };

    const userNames = {
        1: 'سارة أحمد',
        2: 'محمد علي',
        3: 'فاطمة حسن',
        4: 'الكوتش أحمد',
        5: 'أخصائي التغذية'
    };

    const userAvatars = {
        1: '👩‍⚕️',
        2: '👤',
        3: '👤',
        4: '👨‍و',
        5: '🍎'
    };

    return (
        <div className="container mx-auto p-6 space-y-6 text-right dir-rtl">
            <SEO 
                title="مركز التعاون الفوري - Rezk Fit Hub" 
                description="لوحة التحكم لمراقبة تواجد أعضاء الفريق والأقفال النشطة والتعديل المتزامن."
            />

            {/* Header */}
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
                    مركز التعاون الفوري (Collaboration Center)
                </h1>
                <p className="text-zinc-500 text-sm">
                    مراقبة حالة تواجد أعضاء الفريق، الأقفال النشطة، التعديل المشترك للبيانات والأنشطة الفورية.
                </p>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="rounded-2xl border-border bg-card">
                    <CardContent className="p-4 flex items-center justify-between flex-row-reverse">
                        <div className="p-3 rounded-xl bg-green-500/10 text-green-600">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-[10px] text-zinc-500 block">فريق العمل النشط</span>
                            <span className="text-2xl font-bold text-foreground">
                                {statusCounts.online + statusCounts.away + statusCounts.busy} متصلين
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl border-border bg-card">
                    <CardContent className="p-4 flex items-center justify-between flex-row-reverse">
                        <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600">
                            <Lock className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-[10px] text-zinc-500 block">الأقفال الفعالة</span>
                            <span className="text-2xl font-bold text-foreground">
                                {locks.length} أقفال تعديل
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl border-border bg-card">
                    <CardContent className="p-4 flex items-center justify-between flex-row-reverse">
                        <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600">
                            <Eye className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-[10px] text-zinc-500 block">مراقبو جدول التقويم</span>
                            <span className="text-2xl font-bold text-foreground">
                                {viewers.length} مستخدمين
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl border-border bg-card">
                    <CardContent className="p-4 flex items-center justify-between flex-row-reverse">
                        <div className="p-3 rounded-xl bg-purple-500/10 text-purple-600">
                            <Cpu className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-[10px] text-zinc-500 block">معدلو التقويم الفعليون</span>
                            <span className="text-2xl font-bold text-foreground">
                                {Object.keys(editors).length} محررين
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Layout Main */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left timeline section (1 col) */}
                <div className="space-y-6 order-last lg:order-first">
                    <Card className="rounded-2xl border-border bg-card">
                        <CardHeader className="border-b pb-3">
                            <CardTitle className="text-base font-bold flex items-center gap-2 flex-row-reverse">
                                <Tag className="w-4 h-4 text-primary" />
                                سجل النشاطات الفورية
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 max-h-[500px] overflow-y-auto">
                            <ActivityTimeline entityType="Client" entityId={1} />
                        </CardContent>
                    </Card>
                </div>

                {/* Right dashboard section (2 cols) */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="rounded-2xl border-border bg-card p-2">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid grid-cols-3 rounded-xl bg-muted p-1">
                                <TabsTrigger value="cursors" className="rounded-lg text-xs font-semibold py-2">مؤشرات المطورين</TabsTrigger>
                                <TabsTrigger value="locks" className="rounded-lg text-xs font-semibold py-2">أقفال التعديل</TabsTrigger>
                                <TabsTrigger value="team" className="rounded-lg text-xs font-semibold py-2">حالة تواجد الفريق</TabsTrigger>
                            </TabsList>

                            {/* Team Status Tab */}
                            <TabsContent value="team" className="p-4 space-y-4">
                                <h3 className="text-sm font-bold text-foreground mb-3">
                                    تحديثات التواجد اللحظية لفريق العمل والعملاء:
                                </h3>
                                {onlineUsersList.length === 0 ? (
                                    <div className="text-center py-8 text-zinc-400 text-xs">
                                        لا توجد بيانات تواجد نشطة حالياً.
                                    </div>
                                ) : (
                                    <div className="divide-y divide-border/60">
                                        {onlineUsersList.map(user => {
                                            const name = userNames[user.id] || `مستخدم #${user.id}`;
                                            const avatar = userAvatars[user.id] || '👤';
                                            return (
                                                <div key={user.id} className="flex items-center justify-between py-3 flex-row-reverse">
                                                    <div className="flex items-center gap-3 flex-row-reverse">
                                                        <div className="relative">
                                                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg border border-border">
                                                                {avatar}
                                                            </div>
                                                            <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-background ${statusColors[user.status] || 'bg-zinc-400'}`} />
                                                        </div>
                                                        <div>
                                                            <span className="font-bold text-sm block text-foreground">{name}</span>
                                                            <span className="text-[10px] text-zinc-500">مستخدم النظام الأساسي</span>
                                                        </div>
                                                    </div>
                                                    <span className={`text-xs px-2.5 py-1 rounded-full text-white font-medium ${statusColors[user.status] || 'bg-zinc-400'}`}>
                                                        {statusLabels[user.status] || 'غير متصل'}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </TabsContent>

                            {/* Locks Tab */}
                            <TabsContent value="locks" className="p-4 space-y-4">
                                <h3 className="text-sm font-bold text-foreground mb-3">
                                    المستندات والعناصر المقفلة للتعديل لمنع تعارض الحفظ:
                                </h3>
                                {locks.length === 0 ? (
                                    <div className="text-center py-8 text-zinc-400 text-xs border border-dashed rounded-xl">
                                        لا توجد عناصر مقفلة حالياً. جميع المستندات والملفات متاحة للتعديل.
                                    </div>
                                ) : (
                                    <div className="border border-border rounded-xl overflow-hidden">
                                        <div className="grid grid-cols-4 bg-muted p-2.5 text-xs font-bold text-muted-foreground text-center border-b">
                                            <div>الوقت المتبقي</div>
                                            <div>المحرر الحالي</div>
                                            <div>العنصر / المفتاح</div>
                                            <div>نوع العنصر</div>
                                        </div>
                                        <div className="divide-y divide-border">
                                            {locks.map(lock => (
                                                <div key={lock.entityKey} className="grid grid-cols-4 p-3 text-xs text-center items-center">
                                                    <div className="text-red-600 font-bold">{lock.remainingTime} ثانية</div>
                                                    <div className="flex items-center gap-2 justify-center flex-row-reverse">
                                                        <span>{lock.lockedBy}</span>
                                                        <span>{lock.lockedByAvatar}</span>
                                                    </div>
                                                    <div className="font-semibold text-zinc-700">{lock.entityId}</div>
                                                    <div>
                                                        <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] font-bold">
                                                            {lock.entityType}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </TabsContent>

                            {/* Cursors simulation Tab */}
                            <TabsContent value="cursors" className="p-4 space-y-4 text-center">
                                <h3 className="text-sm font-bold text-foreground text-right mb-1">
                                    مراقبة مؤشرات الفارة للمستخدمين الآخرين (Developer Cursors Simulation):
                                </h3>
                                <p className="text-xs text-zinc-500 text-right mb-4">
                                    تظهر هذه اللوحة إحداثيات مؤشر الماوس وسلوك التحديد للمطورين والمدربين داخل النظام بشكل حي.
                                </p>

                                <div className="border border-border/80 bg-zinc-50 dark:bg-zinc-950/20 rounded-2xl p-6 relative min-h-[220px] overflow-hidden flex flex-col items-center justify-center">
                                    {Object.entries(cursors).length === 0 ? (
                                        <div className="text-zinc-400 text-xs">
                                            لا توجد مؤشرات نشطة حالياً. قم بتمكين المحاكاة من لوحة المطورين بالأسفل.
                                        </div>
                                    ) : (
                                        Object.entries(cursors).map(([user, cursor]) => (
                                            <div
                                                key={user}
                                                className="absolute p-2 bg-primary text-white text-xs font-bold rounded-lg pointer-events-none transition-all duration-300 shadow-lg flex items-center gap-1.5"
                                                style={{
                                                    top: `${Math.max(10, Math.min(180, cursor.y || 50))}px`,
                                                    left: `${Math.max(10, Math.min(480, cursor.x || 50))}px`
                                                }}
                                            >
                                                <span className="w-2 h-2 bg-green-400 rounded-full animate-ping" />
                                                <span>{user} ({cursor.x}, {cursor.y})</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </Card>
                </div>

            </div>
        </div>
    );
};

export default Collaboration;
