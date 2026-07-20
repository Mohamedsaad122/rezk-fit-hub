import { motion } from "framer-motion";
import { TrendingUp, Trophy, Clock, Zap, Activity, Plus, Edit, Trash2, Bell, MessageSquare, Calendar, FileSpreadsheet, HeartPulse, Download, Shield, CreditCard, Key, Users, Plug, Play, AlertTriangle, CheckCircle, Percent, BarChart3, ListOrdered } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/hooks/use-dashboard";
import { useDeleteClient } from "@/hooks/use-clients";
import { useState } from "react";
import { useReports, useReportSchedules, useReportsExports, useSystemHealth, useLiveMetrics } from "@/hooks/use-reports";
import { useTenants } from "@/hooks/use-tenants";
import { useSubscription } from "@/hooks/use-subscriptions";
import { useLicense } from "@/hooks/use-license";
import { useTenantStore } from "@/store/tenant.store";
import { useAuthStore } from "@/store/auth.store";
import { useOrganizations } from "@/hooks/use-organizations";
import { useTeams } from "@/hooks/use-teams";
import { useMembers } from "@/hooks/use-members";
import { useInvitations } from "@/hooks/use-invitations";
import { useWorkflows } from "@/hooks/use-workflows";
import { useWorkflowRuns } from "@/hooks/use-workflow-runs";
import { useAutomation } from "@/hooks/use-automation";
import { useApprovals } from "@/hooks/use-approvals";
import { useQuery } from "@tanstack/react-query";
import { useAlerts } from "@/hooks/use-alerts";
import { useHealth } from "@/hooks/use-health";
import { mockDatabase } from "@/mocks/mockDatabase";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import SEO from "@/components/SEO";
import ErrorState from "@/components/ErrorState";
import AddEditClientDialog from "@/components/AddEditClientDialog";
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog";
import { Link } from "react-router-dom";
import { useUnreadNotifications } from "@/hooks/use-notifications";
import { formatRelativeTime } from "@/components/NotificationItem";
import { useTodayTasks, useTaskStatistics } from "@/hooks/use-tasks";
import { OverdueTasksWidget } from "@/components/OverdueTasksWidget";
import { UpcomingTasksWidget } from "@/components/UpcomingTasksWidget";
import { useActivityFeed } from "@/hooks/use-activity";
import { useConversations } from "@/hooks/use-messages";
import { useDocuments, useStorageUsage } from '@/hooks/use-documents';
import { formatBytes, getFileIcon } from '@/utils/file-utils';
import { FolderOpen, HardDrive, FileUp, Users as UsersIcon, Building as BuildingIcon, Mail as MailIcon, User } from 'lucide-react';
import { useAdminUsers } from "@/hooks/use-admin-users";
import { useBranches } from "@/hooks/use-branches";
import { useAuditLogs } from "@/hooks/use-audit-logs";
import { usePresenceStore } from "@/store/presence.store";
import { useCalendar, useCalendarAnalytics } from '@/modules/calendar/hooks/use-calendar';
import { useAllLocks, useAllComments } from '@/hooks/use-collaboration';
import { AtSign, Lock } from 'lucide-react';


function DashboardCollaborationWidget() {
    const { locks } = useAllLocks();
    const { comments } = useAllComments();

    const mentions = comments.filter(c => c.text.includes('@'));

    return (
        <Card className="bg-gradient-card border-0 shadow-lg h-full text-right rtl">
            <CardHeader className="pb-3 text-right">
                <CardTitle className="flex items-center gap-2 justify-end">
                    <AtSign className="h-5 w-5 text-primary" />
                    <span>نشاط التعاون والمنشن</span>
                </CardTitle>
                <CardDescription>العناصر المقفلة للتعديل والمنشن غير المقروءة</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-right">
                {/* Active Locks */}
                <div>
                    <span className="text-xs font-bold text-zinc-500 block mb-2 flex items-center gap-1 flex-row-reverse justify-end">
                        <Lock className="w-3.5 h-3.5" />
                        العناصر قيد التعديل حالياً ({locks.length})
                    </span>
                    {locks.length === 0 ? (
                        <p className="text-[11px] text-zinc-400">لا توجد عناصر مقفلة حالياً</p>
                    ) : (
                        <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1">
                            {locks.map(lock => (
                                <div key={lock.entityKey} className="text-xs flex justify-between items-center bg-muted/20 p-2 rounded-lg flex-row-reverse">
                                    <span className="font-semibold text-zinc-700">{lock.entityType} ({lock.entityId})</span>
                                    <span className="text-[10px] text-zinc-500">بواسطة: {lock.lockedBy} {lock.lockedByAvatar}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Mentions */}
                <div className="pt-3 border-t border-border/50">
                    <span className="text-xs font-bold text-zinc-500 block mb-2">الإشارات والمنشن الأخيرة ({mentions.length})</span>
                    {mentions.length === 0 ? (
                        <p className="text-[11px] text-zinc-400">لا توجد إشارات موجهة إليك</p>
                    ) : (
                        <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                            {mentions.slice(0, 3).map(m => (
                                <div key={m.id} className="text-xs bg-muted/20 p-2 rounded-lg leading-relaxed text-right">
                                    <div className="flex justify-between items-center mb-1 flex-row-reverse">
                                        <span className="font-bold text-primary">{m.author}</span>
                                        <span className="text-[9px] text-zinc-400">{new Date(m.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <p className="text-[11px] text-zinc-600 truncate">{m.text}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

function CurrentOrganizationCard() {
    const { organizations, activeOrganizationId, switchOrganization } = useOrganizations();
    const activeOrg = organizations.find(o => o.id === activeOrganizationId);

    return (
        <Card className="bg-gradient-card border-0 shadow-lg h-full text-right rtl">
            <CardHeader className="pb-3 text-right">
                <CardTitle className="flex items-center gap-2 justify-end">
                    <BuildingIcon className="h-5 w-5 text-primary" />
                    <span>المنظمة النشطة حالياً</span>
                </CardTitle>
                <CardDescription>المنظمة والسياق التشغيلي الفعال للوحة التحكم</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {activeOrg ? (
                    <div className="space-y-2">
                        <div className="text-sm font-bold text-foreground">{activeOrg.name}</div>
                        <div className="text-xs text-muted-foreground">المنطقة الزمنية: {activeOrg.settings?.timezone || 'Asia/Riyadh'}</div>
                        <div className="text-xs text-muted-foreground">العملة الافتراضية: {activeOrg.settings?.currency || 'SAR'}</div>
                    </div>
                ) : (
                    <div className="text-xs text-zinc-400">لم يتم تحديد منظمة نشطة.</div>
                )}
                {organizations.length > 1 && (
                    <div className="pt-2 border-t border-border/50 space-y-1">
                        <label className="text-xs font-bold text-zinc-500 block">تبديل المنظمة السريع:</label>
                        <select
                            value={activeOrganizationId}
                            onChange={(e) => switchOrganization(Number(e.target.value))}
                            className="w-full p-1.5 rounded border bg-background text-xs"
                        >
                            {organizations.map(o => (
                                <option key={o.id} value={o.id}>{o.name}</option>
                            ))}
                        </select>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function DashboardWorkflowAutomationWidget() {
    const { workflows } = useWorkflows();
    const { runs } = useWorkflowRuns();
    const { logs: automationLogs } = useAutomation();
    const { approvals } = useApprovals();

    const { data: backgroundJobs = [] } = useQuery({
        queryKey: ['background-jobs'],
        queryFn: async () => {
            return mockDatabase.saas.backgroundJobs.getAll();
        },
        refetchInterval: 3000
    });

    const runningRuns = runs.filter(r => r.status === 'Running');
    const failedLogs = automationLogs.filter(l => l.status === 'Failed');
    const pendingApprovals = approvals.filter(a => a.status === 'Pending');

    const totalRunsCount = runs.length;
    const completedRunsCount = runs.filter(r => r.status === 'Completed').length;
    const successRate = totalRunsCount > 0 ? Math.round((completedRunsCount / totalRunsCount) * 100) : 100;

    return (
        <Card className="bg-gradient-card border-0 shadow-lg col-span-1 lg:col-span-3 text-right rtl">
            <CardHeader className="pb-3 text-right">
                <CardTitle className="flex items-center gap-2 justify-end">
                    <Zap className="h-5 w-5 text-primary" />
                    <span>منصة أتمتة تدفقات الأعمال (Workflow Automation Center)</span>
                </CardTitle>
                <CardDescription>التحكم بالأتمتة، مسارات العمل المرئية، والاعتمادات المتعددة المستويات</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-right">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-muted/20 rounded-xl border border-border/40 text-right">
                        <div className="flex items-center justify-between flex-row-reverse mb-1">
                            <span className="p-1.5 bg-primary/10 rounded-lg text-primary">
                                <Play className="h-4 w-4" />
                            </span>
                            <span className="text-[10px] text-zinc-500 font-bold">مسارات العمل النشطة</span>
                        </div>
                        <h4 className="text-sm font-bold text-foreground">{runningRuns.length} مسارات جارية</h4>
                        <div className="text-[9px] text-zinc-400 mt-1 max-h-[80px] overflow-y-auto space-y-1">
                            {runningRuns.slice(0, 3).map(r => (
                                <div key={r.id} className="flex justify-between items-center flex-row-reverse bg-background/40 p-1 rounded">
                                    <span>Run #{r.id}</span>
                                    <span className="text-emerald-500">جاري التشغيل</span>
                                </div>
                            ))}
                            {runningRuns.length === 0 && <span>لا توجد مسارات جارية حالياً</span>}
                        </div>
                    </div>

                    <div className="p-3 bg-muted/20 rounded-xl border border-border/40 text-right">
                        <div className="flex items-center justify-between flex-row-reverse mb-1">
                            <span className="p-1.5 bg-red-500/10 rounded-lg text-red-500">
                                <AlertTriangle className="h-4 w-4" />
                            </span>
                            <span className="text-[10px] text-zinc-500 font-bold">أتمتات فاشلة</span>
                        </div>
                        <h4 className="text-sm font-bold text-red-500">{failedLogs.length} أخطاء أتمتة</h4>
                        <div className="text-[9px] text-zinc-400 mt-1 max-h-[80px] overflow-y-auto space-y-1">
                            {failedLogs.slice(0, 3).map(l => (
                                <div key={l.id} className="flex justify-between items-center flex-row-reverse bg-background/40 p-1 rounded">
                                    <span className="truncate max-w-[120px]">{l.details}</span>
                                    <span className="text-red-500">{l.triggerEvent}</span>
                                </div>
                            ))}
                            {failedLogs.length === 0 && <span>لا توجد أخطاء أتمتة مسجلة</span>}
                        </div>
                    </div>

                    <div className="p-3 bg-muted/20 rounded-xl border border-border/40 text-right">
                        <div className="flex items-center justify-between flex-row-reverse mb-1">
                            <span className="p-1.5 bg-amber-500/10 rounded-lg text-amber-500">
                                <CheckCircle className="h-4 w-4" />
                            </span>
                            <span className="text-[10px] text-zinc-500 font-bold">اعتمادات معلقة</span>
                        </div>
                        <h4 className="text-sm font-bold text-amber-500">{pendingApprovals.length} طلبات معلقة</h4>
                        <div className="text-[9px] text-zinc-400 mt-1 max-h-[80px] overflow-y-auto space-y-1">
                            {pendingApprovals.slice(0, 3).map(a => (
                                <div key={a.id} className="flex justify-between items-center flex-row-reverse bg-background/40 p-1 rounded">
                                    <span className="truncate max-w-[120px]">{a.title}</span>
                                    <span className="text-amber-500">انتظار</span>
                                </div>
                            ))}
                            {pendingApprovals.length === 0 && <span>لا توجد طلبات اعتماد معلقة</span>}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                    <div className="p-3 bg-muted/20 rounded-xl border border-border/40 text-right">
                        <div className="flex items-center justify-between flex-row-reverse mb-1">
                            <span className="p-1.5 bg-emerald-500/10 rounded-lg text-emerald-500">
                                <Percent className="h-4 w-4" />
                            </span>
                            <span className="text-[10px] text-zinc-500 font-bold">نسبة نجاح مسارات العمل</span>
                        </div>
                        <h4 className="text-sm font-bold text-emerald-500">{successRate}% نسبة النجاح</h4>
                        <div className="mt-2.5">
                            <Progress value={successRate} className="h-1.5" />
                        </div>
                        <span className="text-[8px] text-zinc-400 block mt-2 text-left">
                            إجمالي المسارات: {totalRunsCount} | المكتملة: {completedRunsCount}
                        </span>
                    </div>

                    <div className="p-3 bg-muted/20 rounded-xl border border-border/40 text-right">
                        <div className="flex items-center justify-between flex-row-reverse mb-1">
                            <span className="p-1.5 bg-sky-500/10 rounded-lg text-sky-500">
                                <BarChart3 className="h-4 w-4" />
                            </span>
                            <span className="text-[10px] text-zinc-500 font-bold">إحصائيات الأتمتة العامة</span>
                        </div>
                        <div className="space-y-1 text-[10px] text-zinc-300 mt-2">
                            <div className="flex justify-between flex-row-reverse">
                                <span>عدد التدفقات:</span>
                                <strong className="text-foreground">{workflows.length}</strong>
                            </div>
                            <div className="flex justify-between flex-row-reverse">
                                <span>عمليات التشغيل:</span>
                                <strong className="text-foreground">{runs.length}</strong>
                            </div>
                            <div className="flex justify-between flex-row-reverse">
                                <span>طلبات الاعتماد:</span>
                                <strong className="text-foreground">{approvals.length}</strong>
                            </div>
                        </div>
                    </div>

                    <div className="p-3 bg-muted/20 rounded-xl border border-border/40 text-right">
                        <div className="flex items-center justify-between flex-row-reverse mb-1">
                            <span className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-500">
                                <ListOrdered className="h-4 w-4" />
                            </span>
                            <span className="text-[10px] text-zinc-500 font-bold">طابور التنفيذ المجدول</span>
                        </div>
                        <div className="text-[9px] text-zinc-400 max-h-[85px] overflow-y-auto space-y-1 mt-1">
                            {backgroundJobs.slice(0, 3).map(j => (
                                <div key={j.id} className="flex justify-between items-center flex-row-reverse bg-background/40 p-1 rounded font-mono">
                                    <span className="truncate max-w-[100px]">{j.jobType || j.name}</span>
                                    <span className={j.status === 'Completed' ? 'text-emerald-500' : j.status === 'Failed' ? 'text-red-500' : 'text-amber-500'}>
                                        {j.status}
                                    </span>
                                </div>
                            ))}
                            {backgroundJobs.length === 0 && <span>لا توجد وظائف خلفية مجدولة حالياً</span>}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function TeamsOverviewWidget() {
    const { teams } = useTeams();

    return (
        <Card className="bg-gradient-card border-0 shadow-lg h-full text-right rtl">
            <CardHeader className="pb-3 text-right">
                <CardTitle className="flex items-center gap-2 justify-end">
                    <UsersIcon className="h-5 w-5 text-primary" />
                    <span>نظرة عامة على فرق العمل</span>
                </CardTitle>
                <CardDescription>الفرق التشغيلية المسجلة وحجم أعضائها</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {teams.length === 0 ? (
                    <div className="text-center py-6 text-xs text-zinc-400">لا توجد فرق عمل منشأة حالياً.</div>
                ) : (
                    <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                        {teams.map(t => (
                            <div key={t.id} className="text-xs bg-muted/20 p-2 rounded-lg flex justify-between items-center gap-2 flex-row-reverse">
                                <span className="font-bold text-foreground">{t.name}</span>
                                <Badge variant="secondary" className="text-[9px] px-1.5">{t.memberIds?.length || 0} أعضاء</Badge>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function MembersStatisticsWidget() {
    const { members } = useMembers();
    const activeCount = members.filter(m => m.status === 'Active').length;
    const suspendedCount = members.filter(m => m.status === 'Suspended').length;

    return (
        <Card className="bg-gradient-card border-0 shadow-lg h-full text-right rtl">
            <CardHeader className="pb-3 text-right">
                <CardTitle className="flex items-center gap-2 justify-end">
                    <User className="h-5 w-5 text-primary" />
                    <span>إحصائيات أعضاء المنظمة</span>
                </CardTitle>
                <CardDescription>نسب الأعضاء النشطين والموقوفين بالمنظمة</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between text-xs">
                    <span>النشطين: <strong className="text-emerald-600">{activeCount}</strong></span>
                    <span>المعلقين: <strong className="text-destructive">{suspendedCount}</strong></span>
                </div>
                <Progress value={members.length > 0 ? (activeCount / members.length) * 100 : 0} className="h-2 bg-muted" />
                <div className="text-[10px] text-zinc-400 text-center">إجمالي عدد أعضاء الكادر: {members.length} موظف</div>
            </CardContent>
        </Card>
    );
}

function PendingInvitationsWidget() {
    const { invitations, acceptInvitation, declineInvitation } = useInvitations();
    const pendingInvites = invitations.filter(i => i.status === 'Pending');

    return (
        <Card className="bg-gradient-card border-0 shadow-lg h-full text-right rtl">
            <CardHeader className="pb-3 text-right">
                <CardTitle className="flex items-center gap-2 justify-end">
                    <MailIcon className="h-5 w-5 text-primary" />
                    <span>دعوات الانضمام المعلقة</span>
                </CardTitle>
                <CardDescription>الطلبات والدعوات قيد المراجعة والمتابعة</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {pendingInvites.length === 0 ? (
                    <div className="text-center py-6 text-xs text-zinc-400">لا توجد دعوات انضمام معلقة حالياً.</div>
                ) : (
                    <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                        {pendingInvites.map(i => (
                            <div key={i.id} className="text-xs bg-muted/20 p-2 rounded-lg space-y-1.5">
                                <div className="font-semibold truncate text-right">{i.email}</div>
                                <div className="text-[10px] text-zinc-400 text-right">الدور: {i.role}</div>
                                <div className="flex items-center gap-1.5 justify-end">
                                    <Button
                                        onClick={() => acceptInvitation(i.id)}
                                        size="sm"
                                        variant="outline"
                                        className="h-6 text-[9px] px-1.5 py-0 text-emerald-600 border-emerald-500/20"
                                    >
                                        قبول
                                    </Button>
                                    <Button
                                        onClick={() => declineInvitation(i.id)}
                                        size="sm"
                                        variant="outline"
                                        className="h-6 text-[9px] px-1.5 py-0 text-destructive border-destructive/20"
                                    >
                                        رفض
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function BillingAnalyticsWidget() {
    const mrr = 12500;
    const arr = mrr * 12;
    const growth = 18.5;
    const successRate = 97.4;
    const failedPayments = 2;
    const outstandingInvoices = 4;

    return (
        <Card className="bg-gradient-card border-0 shadow-lg h-full text-right rtl">
            <CardHeader className="pb-3 text-right">
                <CardTitle className="flex items-center gap-2 justify-end">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <span>تحليلات وإحصاءات الإيرادات والفوترة</span>
                </CardTitle>
                <CardDescription>مؤشرات الأداء المالي والاشتراكات السحابية للمنصة</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/20 p-2 rounded-lg">
                        <span className="text-xs text-muted-foreground block">الإيرادات الشهرية (MRR):</span>
                        <strong className="text-foreground text-sm">{mrr.toLocaleString('ar-EG')} SAR</strong>
                    </div>
                    <div className="bg-muted/20 p-2 rounded-lg">
                        <span className="text-xs text-muted-foreground block">الإيرادات السنوية (ARR):</span>
                        <strong className="text-foreground text-sm">{arr.toLocaleString('ar-EG')} SAR</strong>
                    </div>
                    <div className="bg-muted/20 p-2 rounded-lg">
                        <span className="text-xs text-muted-foreground block">معدل النمو الشهري:</span>
                        <strong className="text-emerald-600 text-sm">+{growth}%</strong>
                    </div>
                    <div className="bg-muted/20 p-2 rounded-lg">
                        <span className="text-xs text-muted-foreground block">نجاح المدفوعات:</span>
                        <strong className="text-emerald-600 text-sm">{successRate}%</strong>
                    </div>
                </div>
                <div className="pt-2 border-t border-border/50 flex justify-between text-xs">
                    <span>فواتير بانتظار التحصيل: <strong className="text-amber-600">{outstandingInvoices}</strong></span>
                    <span>عمليات دفع فاشلة: <strong className="text-destructive">{failedPayments}</strong></span>
                </div>
            </CardContent>
        </Card>
    );
}

function AIDailyInsightsWidget() {
    const insights = [
        { title: 'احتمالية انسحاب لمتدربين', desc: 'تم رصد متدربين بمؤشر التزام أقل من 50%. يوصى بجدولة موعد مراجعة.' },
        { title: 'كوبونات الخصم النشطة', desc: 'كوبون SAVE50 تم استخدامه 0 مرة من أصل 200.' }
    ];

    return (
        <Card className="bg-gradient-card border-0 shadow-lg h-full text-right rtl">
            <CardHeader className="pb-3 text-right">
                <CardTitle className="flex items-center gap-2 justify-end">
                    <Zap className="h-5 w-5 text-primary" />
                    <span>توصيات ورسائل المساعد الذكي اليومية</span>
                </CardTitle>
                <CardDescription>التحليلات المقترحة من محرك الذكاء الاصطناعي للمنصة</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm pr-4">
                <div className="space-y-3 text-right">
                    {insights.map((ins, idx) => (
                        <div key={idx} className="bg-muted/15 p-2.5 rounded-lg text-right">
                            <span className="font-bold text-foreground block text-xs">{ins.title}</span>
                            <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{ins.desc}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

function IntegrationsStatusWidget() {
    const services = [
        { name: 'جوجل كلندر (التقويم)', status: 'Connected', health: '98%' },
        { name: 'AWS S3 (التخزين)', status: 'Connected', health: '100%' },
        { name: 'Twilio Gateway (SMS)', status: 'Connected', health: '95%' }
    ];

    return (
        <Card className="bg-gradient-card border-0 shadow-lg h-full text-right rtl">
            <CardHeader className="pb-3 text-right">
                <CardTitle className="flex items-center gap-2 justify-end">
                    <Plug className="h-5 w-5 text-primary" />
                    <span>بوابات الربط والتكامل الفني</span>
                </CardTitle>
                <CardDescription>مؤشرات التزامن والتخزين اللحظية للشركاء</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm pr-4">
                <div className="space-y-3">
                    {services.map((srv, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-muted/15 p-2 rounded-lg text-right flex-row-reverse text-xs">
                            <span className="font-bold text-foreground">{srv.name}</span>
                            <div className="flex gap-2 items-center flex-row-reverse">
                                <span className="text-[10px] text-muted-foreground">كفاءة: {srv.health}</span>
                                <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600 text-[9px] scale-90">متصل</Badge>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

function RecentActivitiesWidget() {
    const { data: activities = [] } = useActivityFeed();
    return (
        <Card className="bg-gradient-card border-0 shadow-lg h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>النشاطات الأخيرة</span>
                </CardTitle>
                <CardDescription>آخر التحديثات والعمليات المسجلة</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3.5 max-h-[350px] overflow-y-auto pr-1">
                    {activities.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground text-xs">لا يوجد نشاطات مسجلة</div>
                    ) : (
                        activities.slice(0, 4).map((activity) => {
                            let label = 'نشاط';
                            let color = 'text-blue-500 bg-blue-500/10';
                            if (activity.category === 'Workout') {
                                label = 'تمرين';
                                color = 'text-purple-500 bg-purple-500/10';
                            } else if (activity.category === 'Nutrition') {
                                label = 'تغذية';
                                color = 'text-orange-500 bg-orange-500/10';
                            } else if (activity.category === 'Appointment') {
                                label = 'موعد';
                                color = 'text-teal-500 bg-teal-500/10';
                            } else if (activity.category === 'Task') {
                                label = 'مهمة';
                                color = 'text-emerald-500 bg-emerald-500/10';
                            }
                            return (
                                <div key={activity.id} className="flex gap-3 p-2.5 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${color}`}>
                                        {label.slice(0, 1)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold text-foreground truncate">{activity.description}</p>
                                        <div className="flex items-center justify-between mt-1 text-[10px] text-muted-foreground">
                                            <span>بواسطة: {activity.actor}</span>
                                            <span>{formatRelativeTime(activity.timestamp)}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

function RecentMessagesWidget() {
    const { data: conversations = [] } = useConversations();
    const [msgFilter, setMsgFilter] = useState('all'); // 'all', 'today'
    const onlineUsers = usePresenceStore((state) => state.onlineUsers);
    const typingUsers = usePresenceStore((state) => state.typingUsers);

    const unreadCount = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

    const filteredConversations = conversations.filter(c => {
        if (msgFilter === 'today') {
            const todayStr = new Date().toISOString().split('T')[0];
            return c.lastMessageAt && c.lastMessageAt.startsWith(todayStr);
        }
        return true;
    });

    const getStatusColor = (statusVal) => {
        switch (statusVal) {
            case 'online': return 'bg-emerald-500';
            case 'away': return 'bg-amber-500';
            case 'busy': return 'bg-red-500';
            default: return 'bg-zinc-400';
        }
    };

    return (
        <Card className="bg-gradient-card border-0 shadow-lg h-full">
            <CardHeader className="flex flex-col pb-3 text-right">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-primary" />
                        <span>الرسائل الأخيرة</span>
                    </CardTitle>
                    {unreadCount > 0 && (
                        <Badge variant="destructive" className="animate-pulse px-2 py-0.5 text-[10px]">
                            {unreadCount} رسائل جديدة
                        </Badge>
                    )}
                </div>
                <CardDescription className="text-xs">متابعة رسائل ومحادثات المتدربين</CardDescription>

                {/* Filter Selector tabs */}
                <div className="flex gap-2 mt-2 border-b border-border/20 pb-2">
                    <button
                        onClick={() => setMsgFilter('all')}
                        className={`text-[10px] font-bold px-2 py-1 rounded transition-colors ${
                            msgFilter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                    >
                        كل المحادثات
                    </button>
                    <button
                        onClick={() => setMsgFilter('today')}
                        className={`text-[10px] font-bold px-2 py-1 rounded transition-colors ${
                            msgFilter === 'today' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                    >
                        محادثات اليوم
                    </button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3.5 max-h-[290px] overflow-y-auto pr-1 scrollbar-thin">
                    {filteredConversations.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground text-xs">لا يوجد محادثات مطابقة</div>
                    ) : (
                        filteredConversations.slice(0, 3).map((conv) => {
                            const userPresence = onlineUsers[conv.clientId];
                            const activeStatus = userPresence ? userPresence.status : conv.status;
                            const isTyping = (typingUsers[conv.id] || []).length > 0;

                            return (
                                <Link
                                    key={conv.id}
                                    to="/messages"
                                    className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors block"
                                >
                                    <div className="relative w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 text-sm">
                                        {conv.clientAvatar || "👤"}
                                        <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-card ${getStatusColor(activeStatus)}`} />
                                    </div>
                                    <div className="flex-1 min-w-0 text-right">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs font-semibold text-foreground truncate">{conv.clientName}</p>
                                            <span className="text-[9px] text-muted-foreground">{formatRelativeTime(conv.lastMessageAt)}</span>
                                        </div>
                                        {isTyping ? (
                                            <p className="text-[10px] text-primary font-bold animate-pulse mt-0.5">يكتب الآن...</p>
                                        ) : (
                                            <p className="text-[10px] text-muted-foreground truncate mt-0.5">{conv.lastMessage}</p>
                                        )}
                                    </div>
                                    {conv.unreadCount > 0 && (
                                        <span className="w-2.5 h-2.5 rounded-full bg-destructive shrink-0 animate-pulse" />
                                    )}
                                </Link>
                            );
                        })
                    )}
                </div>
                <div className="pt-3 border-t mt-3">
                    <Button asChild variant="ghost" className="w-full text-xs font-bold text-primary hover:bg-primary/5 rounded-lg h-8">
                        <Link to="/messages">عرض كل المحادثات</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

function OnlineCoachesWidget() {
    const onlineUsers = usePresenceStore((state) => state.onlineUsers);
    
    // Coaches list mock data matching admin users role
    const coaches = [
        { id: 10, name: "كوتش أحمد (أنت)", role: "المدرب الرئيسي", avatar: "👨", status: "online" },
        { id: 11, name: "كوتش سارة كمال", role: "مدرب مساعد", avatar: "👩", status: "away" },
        { id: 12, name: "د. محمد علي", role: "أخصائي تغذية", avatar: "👨", status: "online" }
    ];

    const getStatusColor = (statusVal) => {
        switch (statusVal) {
            case 'online': return 'bg-emerald-500';
            case 'away': return 'bg-amber-500';
            case 'busy': return 'bg-red-500';
            default: return 'bg-zinc-400';
        }
    };

    const getStatusLabel = (statusVal) => {
        switch (statusVal) {
            case 'online': return 'نشط';
            case 'away': return 'بالخارج';
            case 'busy': return 'مشغول';
            default: return 'غير متصل';
        }
    };

    return (
        <Card className="bg-gradient-card border-0 shadow-lg h-full">
            <CardHeader className="pb-3 text-right">
                <CardTitle className="flex items-center gap-2">
                    <UsersIcon className="h-5 w-5 text-primary" />
                    <span>طاقم التدريب المباشر</span>
                </CardTitle>
                <CardDescription>حالة اتصال الطاقم الطبي والتدريبي الآن</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
                    {coaches.map((coach) => {
                        const livePresence = onlineUsers[coach.id];
                        const activeStatus = livePresence ? livePresence.status : coach.status;
                        return (
                            <div key={coach.id} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/20">
                                <div className="flex items-center gap-3">
                                    <div className="relative w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm shrink-0">
                                        {coach.avatar}
                                        <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-card ${getStatusColor(activeStatus)}`} />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-semibold text-foreground">{coach.name}</p>
                                        <p className="text-[10px] text-muted-foreground">{coach.role}</p>
                                    </div>
                                </div>
                                <Badge variant="secondary" className="text-[9px] px-1.5 py-0 font-bold">
                                    {getStatusLabel(activeStatus)}
                                </Badge>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}

function RecentNotificationsWidget() {
    const { unreadNotifications, unreadCount } = useUnreadNotifications();

    return (
        <Card className="bg-gradient-card border-0 shadow-lg h-full flex flex-col justify-between">
            <CardHeader className="pb-4 text-right">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-primary" />
                        التنبيهات الأخيرة
                    </CardTitle>
                    {unreadCount > 0 && (
                        <Badge variant="destructive" className="animate-pulse px-2 py-0.5 rounded-full text-[10px]">
                            {unreadCount} جديد
                        </Badge>
                    )}
                </div>
                <CardDescription className="text-xs">آخر الإشعارات غير المقروءة الواردة</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                    {unreadNotifications.length > 0 ? (
                        unreadNotifications.slice(0, 3).map((notif) => (
                            <Link
                                key={notif.id}
                                to={notif.actionUrl || "/notifications"}
                                className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors text-right"
                            >
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border text-sm font-sans bg-background">
                                    {notif.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-foreground truncate">{notif.title}</p>
                                    <p className="text-[10px] text-muted-foreground line-clamp-1 mt-0.5">{notif.description}</p>
                                    <span className="text-[9px] text-muted-foreground/80 mt-1 block">
                                        {formatRelativeTime(notif.createdAt)}
                                    </span>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="text-center py-8 text-muted-foreground text-xs space-y-2">
                            <span className="text-2xl">✨</span>
                            <p>أنت على اطلاع بكل شيء!</p>
                        </div>
                    )}
                </div>
                
                <div className="pt-4 border-t mt-4">
                    <Button asChild variant="ghost" className="w-full text-xs font-bold text-primary hover:bg-primary/5 rounded-lg">
                        <Link to="/notifications">
                            عرض جميع التنبيهات
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

function DashboardTaskStatsWidget() {
    const { count: todayCount, data: todayTasks = [] } = useTodayTasks();
    const { data: stats } = useTaskStatistics();

    return (
        <Card className="border border-border/80 bg-card shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3 text-right">
                <CardTitle className="text-sm font-bold text-foreground flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-primary" />
                    <span>مهام اليوم ونسبة الإنجاز</span>
                </CardTitle>
                <CardDescription className="text-xs">تتبع المهام المطلوبة اليوم ومؤشر الأداء</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Stats row */}
                <div className="grid grid-cols-2 gap-3 text-center">
                    <div className="p-3 rounded-lg bg-muted/30 border border-border/60">
                        <span className="text-[10px] text-muted-foreground block">مطلوب اليوم</span>
                        <span className="text-sm font-bold text-foreground">{todayCount} مهام</span>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30 border border-border/60">
                        <span className="text-[10px] text-muted-foreground block">معدل الإنجاز العام</span>
                        <span className="text-sm font-bold text-primary">{stats?.completionRate || 0}%</span>
                    </div>
                </div>

                {/* Today's Tasks list */}
                <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                    {todayTasks.length === 0 ? (
                        <div className="text-center py-4 text-[11px] text-muted-foreground">
                            لا توجد مهام معلقة مستحقة اليوم.
                        </div>
                    ) : (
                        todayTasks.slice(0, 2).map(task => (
                            <div key={task.id} className="flex items-center gap-2 p-2 rounded bg-muted/20 border border-border/40 text-xs">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
                                <span className="font-semibold truncate flex-1">{task.title}</span>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

function DashboardStorageWidget() {
    const { data: storage } = useStorageUsage();
    const storagePercent = storage ? Math.min(100, Math.round((storage.used / storage.limit) * 100)) : 0;

    return (
        <Card className="bg-gradient-card border-0 shadow-lg h-full text-right rtl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <HardDrive className="h-5 w-5 text-primary" />
                    <span>مساحة التخزين</span>
                </CardTitle>
                <CardDescription>متابعة استخدام المساحة المتاحة للملفات</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-foreground">
                            {storage ? formatBytes(storage.used) : '0 B'} مستخدم
                        </span>
                        <span className="text-muted-foreground">من أصل 5 جيجابايت</span>
                    </div>
                    <Progress value={storagePercent} className="h-2.5 bg-muted" />
                    <span className="text-[10px] text-muted-foreground block text-left">{storagePercent}% مستنفذ</span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t text-center">
                    <div className="p-2 bg-muted/20 rounded-lg">
                        <span className="text-[9px] text-muted-foreground block font-bold">الصور</span>
                        <span className="text-xs font-bold text-foreground block">{storage ? formatBytes(storage.breakdown.images) : '0 B'}</span>
                    </div>
                    <div className="p-2 bg-muted/20 rounded-lg">
                        <span className="text-[9px] text-muted-foreground block font-bold">PDF</span>
                        <span className="text-xs font-bold text-foreground block">{storage ? formatBytes(storage.breakdown.pdf) : '0 B'}</span>
                    </div>
                    <div className="p-2 bg-muted/20 rounded-lg">
                        <span className="text-[9px] text-muted-foreground block font-bold">وثائق</span>
                        <span className="text-xs font-bold text-foreground block">{storage ? formatBytes(storage.breakdown.documents) : '0 B'}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function RecentDocumentsWidget() {
    const { data: documents = [] } = useDocuments({ limit: 4 });
    const recentDocs = documents.slice(0, 4);

    return (
        <Card className="bg-gradient-card border-0 shadow-lg h-full text-right rtl">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <FolderOpen className="h-5 w-5 text-primary" />
                        <span>الملفات المرفوعة</span>
                    </CardTitle>
                    <CardDescription>الوصول السريع لآخر المستندات والخطط</CardDescription>
                </div>
            </CardHeader>
            <CardContent className="space-y-3.5">
                <div className="space-y-2">
                    {recentDocs.length === 0 ? (
                        <div className="text-center py-6 text-muted-foreground text-xs">لا يوجد مستندات مرفوعة حالياً</div>
                    ) : (
                        recentDocs.map((doc) => (
                            <Link 
                                key={doc.id}
                                to="/documents"
                                className="flex items-center justify-between p-2.5 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors block"
                            >
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <span className="text-2xl shrink-0">{getFileIcon(doc.extension)}</span>
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-foreground truncate max-w-[150px]">{doc.name}</p>
                                        <span className="text-[9px] text-muted-foreground block mt-0.5">{formatBytes(doc.size)}</span>
                                    </div>
                                </div>
                                <span className="text-[9px] text-muted-foreground">{new Date(doc.createdAt).toLocaleDateString('ar-EG')}</span>
                            </Link>
                        ))
                    )}
                </div>
                <div className="pt-2 border-t">
                    <Button asChild variant="ghost" className="w-full text-xs font-bold text-primary hover:bg-primary/5 rounded-lg h-8">
                        <Link to="/documents">عرض جميع الملفات</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

function RecentUploadsWidget() {
    const { data: documents = [] } = useDocuments({ sortBy: 'Newest' });
    const recentUploads = documents.slice(0, 4);

    return (
        <Card className="bg-gradient-card border-0 shadow-lg h-full text-right rtl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileUp className="h-5 w-5 text-primary" />
                    <span>تاريخ الرفع المباشر</span>
                </CardTitle>
                <CardDescription>آخر تحديثات وعمليات الرفع</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                    {recentUploads.length === 0 ? (
                        <div className="text-center py-6 text-muted-foreground text-xs">لا يوجد تحديثات رفع أخيرة</div>
                    ) : (
                        recentUploads.map((file) => (
                            <div key={file.id} className="flex gap-3 p-2 bg-muted/10 rounded-lg hover:bg-muted/20 transition-all">
                                <div className="text-2xl flex items-center justify-center shrink-0">{getFileIcon(file.extension)}</div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-foreground truncate">{file.name}</p>
                                    <div className="flex justify-between items-center text-[9px] text-muted-foreground mt-1">
                                        <span>بواسطة: {file.owner === 'Coach' ? 'الكوتش أحمد' : 'المتدرب'}</span>
                                        <span>{formatRelativeTime(file.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

function DashboardObservabilityWidget() {
    const { alerts } = useAlerts();
    const { systemHealth } = useHealth();
    
    const activeAlerts = alerts?.filter(a => a.status === 'Active') || [];
    const healthValues = Object.values(systemHealth || {});
    const criticalHealth = healthValues.filter(h => h.status === 'Unhealthy');

    return (
        <Card className="bg-gradient-card border border-border shadow-lg h-full text-right rtl">
            <CardHeader className="pb-3 text-right">
                <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    <span>مرصد عمليات المنصة والمراقبة</span>
                </CardTitle>
                <CardDescription>التحكم والوصول إلى أدوات DevOps والـ Telemetry</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-muted/10 p-2.5 rounded border border-border/40 text-center">
                        <div className="text-zinc-500 font-bold">التنبيهات النشطة</div>
                        <div className={`text-base font-bold ${activeAlerts.length > 0 ? 'text-rose-500' : 'text-zinc-300'}`}>{activeAlerts.length}</div>
                    </div>
                    <div className="bg-muted/10 p-2.5 rounded border border-border/40 text-center">
                        <div className="text-zinc-500 font-bold">حالة المكونات</div>
                        <div className={`text-base font-bold ${criticalHealth.length > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                            {criticalHealth.length > 0 ? `${criticalHealth.length} فاشل` : 'مستقر'}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                    <Link to="/observability-center" className="w-full">
                        <Button className="w-full text-xs font-bold gap-1 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20">
                            فتح مرصد العمليات الموحد
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}

function SystemHealthWidget() {
    const { healthState } = useSystemHealth();
    const { metrics } = useLiveMetrics();

    const load = metrics?.systemLoad ?? 24;
    const storage = metrics?.storageUsage ?? 42;
    const responseTime = metrics?.apiResponseTime ?? 12;
    const status = healthState?.api?.status ?? 'Healthy';

    return (
        <Card className="bg-gradient-card border border-border shadow-lg h-full text-right rtl">
            <CardHeader className="pb-3 text-right">
                <CardTitle className="flex items-center gap-2">
                    <HeartPulse className="h-5 w-5 text-primary" />
                    <span>صحة النظام والبنية التحتية</span>
                </CardTitle>
                <CardDescription>حالة الخوادم والاتصال بالشبكة</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className={`flex items-center justify-between p-2.5 rounded-lg border ${
                    status === 'Healthy' 
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                        : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500'
                }`}>
                    <span className="text-sm font-semibold">حالة البوابة الفورية</span>
                    <Badge className={status === 'Healthy' ? 'bg-emerald-500 text-white' : 'bg-yellow-500 text-white'}>
                        {status === 'Healthy' ? 'ممتازة (Active)' : 'مضطربة (Warning)'}
                    </Badge>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                        <span>حمولة المعالج (CPU Load)</span>
                        <span>{load}%</span>
                    </div>
                    <Progress value={load} className="h-1.5 bg-muted" />
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                        <span>استهلاك الذاكرة (Memory Usage)</span>
                        <span>{storage}%</span>
                    </div>
                    <Progress value={storage} className="h-1.5 bg-muted" />
                </div>
                <div className="flex justify-between items-center pt-2 text-xs text-muted-foreground border-t">
                    <span>زمن الاستجابة: <strong className="text-foreground">{responseTime}ms</strong></span>
                    <Link to="/health" className="text-primary hover:underline font-bold text-[10px]">عرض التشخيصات</Link>
                </div>
            </CardContent>
        </Card>
    );
}

function DashboardReportsWidget() {
    const { reports } = useReports();
    const { schedules } = useReportSchedules();
    const { exports } = useReportsExports();

    const recentReports = reports.slice(0, 2);
    const activeSchedules = schedules.slice(0, 2);
    const latestExports = exports.slice(0, 2);

    return (
        <Card className="bg-gradient-card border border-border shadow-lg h-full text-right rtl">
            <CardHeader className="pb-3 text-right">
                <CardTitle className="flex items-center gap-2">
                    <FileSpreadsheet className="h-5 w-5 text-primary" />
                    <span>التقارير والمخرجات التلقائية</span>
                </CardTitle>
                <CardDescription>الوصول للتقارير المخصصة والملفات المصدرة</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-2 pb-3 border-b">
                    <Button asChild variant="outline" className="text-[10px] h-8 justify-center gap-1">
                        <Link to="/reports">
                            <Plus className="h-3.5 w-3.5" />
                            منشئ التقارير
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="text-[10px] h-8 justify-center gap-1">
                        <Link to="/monitoring">
                            <Activity className="h-3.5 w-3.5" />
                            مراقبة الأداء
                        </Link>
                    </Button>
                </div>

                {/* Recent saved reports */}
                <div className="space-y-2">
                    <span className="font-bold text-foreground block">آخر التقارير المحفوظة:</span>
                    {recentReports.length === 0 ? (
                        <p className="text-[10px] text-muted-foreground text-center">لا توجد تقارير محفوظة</p>
                    ) : (
                        recentReports.map(r => (
                            <div key={r.id} className="p-1.5 rounded bg-muted/10 border border-border/40 text-[11px] flex justify-between items-center">
                                <span className="font-medium text-foreground truncate max-w-[150px]">{r.name}</span>
                                <Badge variant="secondary" className="text-[9px] px-1 py-0">{r.module}</Badge>
                            </div>
                        ))
                    )}
                </div>

                {/* Active Schedules */}
                <div className="space-y-2 pt-2 border-t">
                    <span className="font-bold text-foreground block">الجداول التلقائية النشطة:</span>
                    {activeSchedules.length === 0 ? (
                        <p className="text-[10px] text-muted-foreground text-center">لا توجد تقارير مجدولة</p>
                    ) : (
                        activeSchedules.map(s => (
                            <div key={s.id} className="p-1.5 rounded bg-muted/10 border border-border/40 text-[11px] flex justify-between items-center">
                                <span className="font-medium text-foreground">{s.name}</span>
                                <span className="text-[9px] text-muted-foreground">{s.schedule === 'daily' ? 'يومي' : 'أسبوعي'}</span>
                            </div>
                        ))
                    )}
                </div>

                {/* Latest Exports */}
                <div className="space-y-2 pt-2 border-t">
                    <span className="font-bold text-foreground block">آخر الملفات المجهزة لتنزيلها:</span>
                    {latestExports.length === 0 ? (
                        <p className="text-[10px] text-muted-foreground text-center">لا توجد ملفات جاهزة</p>
                    ) : (
                        latestExports.map(e => (
                            <div key={e.id} className="p-1.5 rounded bg-muted/10 border border-border/40 text-[11px] flex justify-between items-center">
                                <span className="font-medium text-foreground truncate max-w-[120px]">{e.name}</span>
                                <a href={e.url || '#'} download className="text-primary hover:underline flex items-center gap-0.5 text-[10px] font-semibold">
                                    <Download className="h-3 w-3" />
                                    تنزيل
                                </a>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

function SaaSDashboardWidget() {
    const { tenants } = useTenants();
    const { activeTenantId } = useTenantStore();
    const { subscription } = useSubscription(activeTenantId);
    const { license } = useLicense(activeTenantId);

    const activeCount = tenants.length;
    const plan = subscription?.planId || 'Professional';
    const usersMax = subscription?.limits?.users || 10;
    const storageMax = subscription?.limits?.storageGb || 20;
    
    // Plan distribution
    const starterCount = tenants.filter(t => t.planId === 'Starter').length || 1;
    const profCount = tenants.filter(t => t.planId === 'Professional').length || 1;
    const businessCount = tenants.filter(t => t.planId === 'Business').length || 1;

    return (
        <Card className="bg-gradient-card border border-border shadow-lg h-full text-right rtl">
            <CardHeader className="pb-3 text-right">
                <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <span>مراقبة منصة الـ SaaS والاشتراكات</span>
                </CardTitle>
                <CardDescription>مؤشرات الأجهزة، الاشتراكات والحدود التخزينية</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs">
                {/* Switch link options */}
                <div className="grid grid-cols-2 gap-2 pb-3 border-b text-[10px]">
                    <Button asChild variant="outline" className="h-8 justify-center gap-1">
                        <Link to="/admin/tenants">
                            <Users className="h-3 w-3" />
                            إدارة المؤسسات
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-8 justify-center gap-1">
                        <Link to="/admin/subscriptions">
                            <CreditCard className="h-3 w-3" />
                            باقات الاشتراك
                        </Link>
                    </Button>
                </div>

                {/* Quotas */}
                <div className="space-y-2">
                    <div className="flex justify-between font-semibold">
                        <span>مستخدمي باقة {plan}:</span>
                        <span>1 من أصل {usersMax}</span>
                    </div>
                    <Progress value={(1 / usersMax) * 100} className="h-1 bg-muted" />

                    <div className="flex justify-between font-semibold pt-1">
                        <span>السعة التخزينية للمؤسسة:</span>
                        <span>2.1 GB من {storageMax} GB</span>
                    </div>
                    <Progress value={(2.1 / storageMax) * 100} className="h-1 bg-muted" />
                </div>

                {/* License Status */}
                <div className="pt-2 border-t flex justify-between items-center text-[11px]">
                    <span className="text-muted-foreground">حالة ترخيص النظام:</span>
                    <Badge variant={license?.status === 'Active' ? 'default' : 'destructive'} className="text-[9px] px-1.5">
                        {license?.status === 'Active' ? 'نشط' : ' GracePeriod'}
                    </Badge>
                </div>

                {/* Plan Distribution */}
                <div className="pt-2 border-t space-y-1">
                    <span className="font-bold text-foreground block">توزيع خطط الشركاء:</span>
                    <div className="grid grid-cols-3 gap-1 text-center font-mono text-[10px]">
                        <div className="bg-muted/30 p-1 rounded border">
                            <span>Starter: </span>
                            <strong className="text-primary">{starterCount}</strong>
                        </div>
                        <div className="bg-muted/30 p-1 rounded border">
                            <span>Pro: </span>
                            <strong className="text-primary">{profCount}</strong>
                        </div>
                        <div className="bg-muted/30 p-1 rounded border">
                            <span>Business: </span>
                            <strong className="text-primary">{businessCount}</strong>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function AdminStatsWidget() {
    const { data: adminUsers = [] } = useAdminUsers();
    const { data: branches = [] } = useBranches();
    const pendingInvitesCount = adminUsers.filter(u => u.status === 'Inactive').length;

    return (
        <Card className="bg-gradient-card border-0 shadow-lg h-full text-right rtl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    <span>الإدارة والشركاء</span>
                </CardTitle>
                <CardDescription>نظرة سريعة على التعداد والارتباطات</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-muted/20 rounded-xl text-center">
                        <UsersIcon className="w-5 h-5 mx-auto text-primary mb-1" />
                        <span className="block text-xl font-bold text-foreground">{adminUsers.length || 6}</span>
                        <span className="text-[10px] text-muted-foreground">المستخدمين</span>
                    </div>
                    <div className="p-3 bg-muted/20 rounded-xl text-center">
                        <BuildingIcon className="w-5 h-5 mx-auto text-violet-500 mb-1" />
                        <span className="block text-xl font-bold text-foreground">{branches.length || 4}</span>
                        <span className="text-[10px] text-muted-foreground">الفروع</span>
                    </div>
                    <div className="p-3 bg-muted/20 rounded-xl text-center">
                        <MailIcon className="w-5 h-5 mx-auto text-amber-500 mb-1" />
                        <span className="block text-xl font-bold text-foreground">{pendingInvitesCount || 1}</span>
                        <span className="text-[10px] text-muted-foreground">دعوات معلقة</span>
                    </div>
                </div>

                <div className="space-y-2 pt-2 border-t text-xs">
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">الرتبة العليا (Super Admin):</span>
                        <span className="font-semibold text-foreground">
                            {adminUsers.filter(u => u.role === 'Super Admin').map(u => u.fullName).join('، ') || 'أحمد عبد الله'}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">حالة الترخيص:</span>
                        <Badge className="bg-emerald-500 text-white text-[9px] px-1.5 py-0">مفعل (Enterprise)</Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function DashboardAuditLogsWidget() {
    const { data: logs = [] } = useAuditLogs();
    const latestLogs = logs.slice(0, 3);

    return (
        <Card className="bg-gradient-card border-0 shadow-lg h-full text-right rtl">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    <span>آخر العمليات الأمنية</span>
                </CardTitle>
                <CardDescription>سجل الرصد الفوري لحسابات الموظفين</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="space-y-2.5">
                    {latestLogs.length === 0 ? (
                        <div className="text-center py-6 text-muted-foreground text-xs">لا يوجد عمليات مسجلة</div>
                    ) : (
                        latestLogs.map((log) => (
                            <div key={log.id} className="flex justify-between items-center p-2 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold text-foreground truncate">{log.details}</p>
                                    <span className="text-[9px] text-muted-foreground block mt-0.5">
                                        بواسطة: {log.user} • {new Date(log.date).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <Badge 
                                    className={`text-[9px] px-1.5 py-0 shrink-0 ${log.status === 'Success' ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'}`}
                                    variant={log.status === 'Success' ? 'default' : 'destructive'}
                                >
                                    {log.status === 'Success' ? 'ناجح' : 'فاشل'}
                                </Badge>
                            </div>
                        ))
                    )}
                </div>
                <div className="pt-2 border-t mt-2">
                    <Button asChild variant="ghost" className="w-full text-xs font-bold text-primary hover:bg-primary/5 rounded-lg h-8">
                        <Link to="/admin/audit-logs">عرض سجل العمليات الكامل</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}


function DashboardCalendarResourceWidget() {
    const todayStr = "2026-07-13";
    const { data: allEvents = [] } = useCalendar();
    const { data: analytics } = useCalendarAnalytics();

    const todayEvents = allEvents
        .filter(e => e.date === todayStr && e.status !== 'Cancelled')
        .sort((a, b) => a.startTime.localeCompare(b.startTime));

    return (
        <Card className="bg-gradient-card border border-border shadow-lg h-full text-right rtl">
            <CardHeader className="pb-3 text-right">
                <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span>جدولة الموارد والفعاليات اليوم</span>
                </CardTitle>
                <CardDescription>توزيع الحصص وإشغال القاعات والمدربين</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <span className="text-xs font-bold text-foreground">حصص اليوم المجدولة:</span>
                    <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                        {todayEvents.length === 0 ? (
                            <div className="text-center py-4 text-[10px] text-muted-foreground">لا توجد حصص مجدولة اليوم.</div>
                        ) : (
                            todayEvents.map(e => (
                                <div key={e.id} className="p-2 rounded bg-muted/20 border text-xs flex justify-between items-center gap-2">
                                    <div className="min-w-0">
                                        <div className="font-bold truncate">{e.title}</div>
                                        <div className="text-[10px] text-muted-foreground mt-0.5">{e.startTime} - {e.endTime}</div>
                                    </div>
                                    <Badge variant="outline" className="text-[9px] px-1.5 shrink-0 border-border">
                                        {e.roomId || 'بدون قاعة'}
                                    </Badge>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t text-xs">
                    <div className="space-y-2">
                        <span className="font-bold text-[10px] text-muted-foreground block">إشغال القاعات:</span>
                        <div className="space-y-1.5">
                            <div>
                                <div className="flex justify-between text-[10px] mb-0.5">
                                    <span>القاعة أ (Room A)</span>
                                    <span>{analytics?.roomUtilization?.["Room A"] || 65}%</span>
                                </div>
                                <Progress value={analytics?.roomUtilization?.["Room A"] || 65} className="h-1 bg-muted" />
                            </div>
                            <div>
                                <div className="flex justify-between text-[10px] mb-0.5">
                                    <span>الغرفة ب (Room B)</span>
                                    <span>{analytics?.roomUtilization?.["Room B"] || 30}%</span>
                                </div>
                                <Progress value={analytics?.roomUtilization?.["Room B"] || 30} className="h-1 bg-muted" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <span className="font-bold text-[10px] text-muted-foreground block">نشاط المدربين اليوم:</span>
                        <div className="space-y-1.5">
                            <div>
                                <div className="flex justify-between text-[10px] mb-0.5">
                                    <span>كابتن سارة</span>
                                    <span>{analytics?.coachUtilization?.[3] || 75}%</span>
                                </div>
                                <Progress value={analytics?.coachUtilization?.[3] || 75} className="h-1 bg-muted" />
                            </div>
                            <div>
                                <div className="flex justify-between text-[10px] mb-0.5">
                                    <span>كوتش عبد الرحمن</span>
                                    <span>{analytics?.coachUtilization?.[6] || 40}%</span>
                                </div>
                                <Progress value={analytics?.coachUtilization?.[6] || 40} className="h-1 bg-muted" />
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}


export default function Dashboard() {
    const { isLoading, isError, data, refetch } = useDashboard();
    const { stats, monthlyProgress, topTrainees } = data || {};
    const { mutate: deleteClient, isPending: isDeletePending } = useDeleteClient();

    // Dialog state
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [deletingTrainee, setDeletingTrainee] = useState(null);

    const handleAddClientClick = () => {
        setEditingClient(null);
        setIsDialogOpen(true);
    };

    const handleEditClientClick = (trainee) => {
        const clientModel = {
            id: trainee.id || 1,
            name: trainee.name,
            progress: trainee.progress,
            workouts: trainee.workouts,
            streak: trainee.streak,
            goal: trainee.goal || 'خسارة الوزن'
        };
        setEditingClient(clientModel);
        setIsDialogOpen(true);
    };
    const handleDeleteClientClick = (trainee) => {
        setDeletingTrainee(trainee);
    };

    const { user } = useAuthStore();
    const role = user?.role || 'admin';

    if (role === 'trainee' || role === 'client') {
        return (
            <div className="p-6 max-w-7xl ml-auto space-y-8 rtl text-right pt-28">
                <SEO title="لوحة التحكم - المتدرب" description="بيانات التدريب والالتزام الخاصة بك" />
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold text-foreground bg-gradient-to-r from-primary to-sky-400 bg-clip-text text-transparent">أهلاً بك، {user?.name}</h1>
                    <p className="text-sm text-zinc-400">لوحة المتابعة الشخصية والتقدم الفني للمشترك</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card className="bg-gradient-card border-zinc-800">
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold">التمارين الخاصة بي</CardTitle>
                            <CardDescription className="text-xs">برنامجك التدريبي اليومي</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xs text-zinc-400">لا توجد تمارين مجدولة اليوم. يرجى مراجعة المدرب.</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-card border-zinc-800">
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold">نظامي الغذائي</CardTitle>
                            <CardDescription className="text-xs">أهداف التغذية والسعرات اليومية</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between"><span>البروتين:</span><span>140g</span></div>
                                <div className="flex justify-between"><span>الكربوهيدرات:</span><span>200g</span></div>
                                <div className="flex justify-between"><span>الدهون:</span><span>60g</span></div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-card border-zinc-800">
                        <CardHeader>
                            <CardTitle className="text-sm font-semibold">نسبة التقدم والالتزام</CardTitle>
                            <CardDescription className="text-xs">معدل الالتزام بالأهداف</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex justify-between text-xs"><span>معدل الالتزام:</span><span>85%</span></div>
                            <Progress value={85} className="h-1.5" />
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <UpcomingTasksWidget />
                    <RecentNotificationsWidget />
                </div>
            </div>
        );
    }

    if (role === 'coach') {
        return (
            <div className="p-6 max-w-7xl ml-auto space-y-8 rtl text-right pt-28">
                <SEO title="لوحة التحكم - المدرب" description="إدارة المتدربين والتمارين" />
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold text-foreground">لوحة تحكم المدرب</h1>
                    <p className="text-sm text-zinc-400">مرحباً بك {user?.name}. تابع المتدربين وتصميم البرامج اليومية.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <UpcomingTasksWidget />
                    <RecentNotificationsWidget />
                    <DashboardTaskStatsWidget />
                </div>

                <div className="grid grid-cols-1 gap-6">
                    <DashboardCalendarResourceWidget />
                </div>
            </div>
        );
    }

    if (role === 'nutritionist') {
        return (
            <div className="p-6 max-w-7xl ml-auto space-y-8 rtl text-right pt-28">
                <SEO title="لوحة التحكم - أخصائي التغذية" description="متابعة خطط التغذية" />
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold text-foreground">لوحة تحكم أخصائي التغذية</h1>
                    <p className="text-sm text-zinc-400">متابعة الأنظمة الغذائية والسعرات الحرارية للمشتركين.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <UpcomingTasksWidget />
                    <RecentNotificationsWidget />
                </div>
            </div>
        );
    }

    if (role === 'receptionist') {
        return (
            <div className="p-6 max-w-7xl ml-auto space-y-8 rtl text-right pt-28">
                <SEO title="لوحة التحكم - الاستقبال" description="إدارة المواعيد والزيارات اليومية" />
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold text-foreground">لوحة تحكم الاستقبال</h1>
                    <p className="text-sm text-zinc-400">متابعة المواعيد وتسجيل حضور اللاعبين المشتركين.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <UpcomingTasksWidget />
                    <DashboardCalendarResourceWidget />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-full bg-gradient-to-br from-background via-muted/20 to-background">
            <SEO title="لوحة التحكم" />
            
            {/* Header */}
            <motion.section
                className="pt-28 pb-12 px-6 bg-gradient-to-r from-primary to-purple-600 text-white"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="max-w-7xl ml-auto">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">لوحة التحكم</h1>
                            <p className="text-xl opacity-90">نظرة شاملة على أداء النظام</p>
                        </div>

                        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                            <span className="text-sm font-medium">آخر تحديث: الآن</span>
                        </div>
                    </div>
                </div>
            </motion.section>

            <div className="p-6 max-w-7xl ml-auto space-y-8">
                {isLoading ? (
                    <div className="flex items-center justify-center min-h-[400px]">
                        <LoadingSpinner message="جاري تحميل إحصائيات لوحة التحكم..." />
                    </div>
                ) : isError ? (
                    <ErrorState onRetry={refetch} />
                ) : (
                    <>
                        {/* Stats Cards */}
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={stat.title}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                >
                                    <Card className="hover-lift bg-gradient-card border-0 shadow-md">
                                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                                {stat.title}
                                            </CardTitle>
                                            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-3xl font-bold text-foreground mb-1">
                                                {stat.value}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <TrendingUp className="h-3 w-3 text-green-500" />
                                                <span className="text-xs text-green-600 font-medium">
                                                    {stat.change}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    من الشهر الماضي
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </motion.div>

                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Monthly Progress Chart */}
                            <motion.div
                                className="lg:col-span-2"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                            >
                                <Card className="bg-gradient-card border-0 shadow-lg">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Activity className="h-5 w-5" />
                                            التقدم الشهري
                                        </CardTitle>
                                        <CardDescription>
                                            مقارنة الأداء خلال الأشهر الستة الماضية
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-6">
                                            {monthlyProgress.map((month) => (
                                                <div key={month.month} className="space-y-2">
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="font-medium">{month.month}</span>
                                                        <div className="flex gap-4 text-xs text-muted-foreground">
                                                            <span>متدربين: {month.trainees}</span>
                                                            <span>تمارين: {month.workouts}</span>
                                                            <span>تغذية: {month.nutrition}%</span>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Progress
                                                            value={(month.trainees / 300) * 100}
                                                            className="h-2"
                                                        />
                                                        <div className="flex justify-end text-xs text-muted-foreground">
                                                            {Math.round((month.trainees / 300) * 100)}% من الهدف
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            
                                            <div className="pt-2 border-t mt-4">
                                                <Button asChild variant="ghost" className="w-full text-xs font-bold text-primary hover:bg-primary/5 rounded-lg">
                                                    <Link to="/analytics">
                                                        عرض التحليلات المتقدمة والتقارير الذكية
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Activities & Messages & Coaches Widgets */}
                            <motion.div
                                className="space-y-6"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                            >
                                <RecentActivitiesWidget />
                                <RecentMessagesWidget />
                                <OnlineCoachesWidget />
                                <DashboardCollaborationWidget />
                            </motion.div>
                        </div>

                        {/* Bottom Grid Row: Top Trainees & Recent Notifications */}
                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Top Trainees */}
                            <motion.div
                                className="lg:col-span-2"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.8 }}
                            >
                                <Card className="bg-gradient-card border-0 shadow-lg h-full">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                        <div>
                                            <CardTitle className="flex items-center gap-2">
                                                <Trophy className="h-5 w-5" />
                                                أفضل المتدربين هذا الشهر
                                            </CardTitle>
                                            <CardDescription>
                                                المتدربون الأكثر التزاماً وتميزاً في الأداء
                                            </CardDescription>
                                        </div>
                                        <Button 
                                            size="sm" 
                                            onClick={handleAddClientClick}
                                            className="rounded-lg h-9 text-xs"
                                        >
                                            <Plus className="w-4 h-4 mr-1" />
                                            إضافة متدرب
                                        </Button>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
                                            {topTrainees.map((trainee, index) => (
                                                <motion.div
                                                    key={trainee.name}
                                                    className="text-center space-y-3 p-4 rounded-xl bg-muted/30 relative group"
                                                    initial={{ opacity: 0, y: 30 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
                                                >
                                                    {/* Edit/Delete Actions */}
                                                    <div className="absolute top-2 left-2 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button 
                                                            size="icon" 
                                                            variant="ghost" 
                                                            onClick={() => handleEditClientClick(trainee)}
                                                            className="w-6 h-6 p-0 hover:bg-background"
                                                        >
                                                            <Edit className="w-3 h-3 text-muted-foreground" />
                                                        </Button>
                                                        <Button 
                                                            size="icon" 
                                                            variant="ghost" 
                                                            onClick={() => handleDeleteClientClick(trainee)}
                                                            className="w-6 h-6 p-0 text-destructive hover:bg-background"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </Button>
                                                    </div>

                                                    <div className="relative">
                                                        <div className="w-16 h-16 ml-auto rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                                            {index + 1}
                                                        </div>
                                                        {index < 3 && (
                                                            <Badge
                                                                className="absolute -top-1 -right-1 w-6 h-6 rounded-full p-0 flex items-center justify-center"
                                                                variant={index === 0 ? "default" : "secondary"}
                                                            >
                                                                <Trophy className="w-3 h-3" />
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <h4 className="font-semibold text-foreground text-sm">
                                                            {trainee.name}
                                                        </h4>
                                                        <div className="text-xs text-muted-foreground space-y-1 mt-2">
                                                            <div>تقدم: {trainee.progress}%</div>
                                                            <div>تمارين: {trainee.workouts}</div>
                                                            <div>
                                                                <div className="flex items-center justify-center gap-1">
                                                                    <Zap className="w-3 h-3 text-orange-500" />
                                                                    <span>{trainee.streak} يوم</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <Progress
                                                            value={trainee.progress}
                                                            className="h-1 mt-2"
                                                        />
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Recent Notifications */}
                            <motion.div
                                className="lg:col-span-1"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.9 }}
                            >
                                <RecentNotificationsWidget />
                            </motion.div>
                        </div>

                        {/* Middle Tasks Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 1.0 }}
                            >
                                <OverdueTasksWidget />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 1.1 }}
                            >
                                <UpcomingTasksWidget />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 1.2 }}
                            >
                                <DashboardTaskStatsWidget />
                            </motion.div>
                        </div>

                        {/* Collaborative Scheduling & Resource Widget */}
                        <div className="grid grid-cols-1 gap-6 pt-2">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 1.25 }}
                            >
                                <DashboardCalendarResourceWidget />
                            </motion.div>
                        </div>

                        {/* Documents & Media Management Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 1.3 }}
                            >
                                <DashboardStorageWidget />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 1.4 }}
                            >
                                <RecentDocumentsWidget />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 1.5 }}
                            >
                                <RecentUploadsWidget />
                            </motion.div>
                        </div>

                        {/* Enterprise Organizations & Teams Management Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 1.52 }}
                            >
                                <CurrentOrganizationCard />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 1.54 }}
                            >
                                <TeamsOverviewWidget />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 1.56 }}
                            >
                                <MembersStatisticsWidget />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 1.58 }}
                            >
                                <PendingInvitationsWidget />
                            </motion.div>
                        </div>

                        {/* Financial & AI & Integrations Analytics Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 1.59 }}
                            >
                                <BillingAnalyticsWidget />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 1.595 }}
                            >
                                <AIDailyInsightsWidget />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 1.598 }}
                            >
                                <IntegrationsStatusWidget />
                            </motion.div>
                        </div>

                        {/* Enterprise Workflow Automation Section */}
                        <div className="grid grid-cols-1 gap-6 pt-2">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 1.599 }}
                            >
                                <DashboardWorkflowAutomationWidget />
                            </motion.div>
                        </div>

                        {/* Administration & System Management Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 pt-2">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 1.58 }}
                            >
                                <DashboardObservabilityWidget />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 1.6 }}
                            >
                                <SystemHealthWidget />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 1.65 }}
                            >
                                <SaaSDashboardWidget />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 1.7 }}
                            >
                                <DashboardReportsWidget />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 1.75 }}
                            >
                                <AdminStatsWidget />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 1.8 }}
                            >
                                <DashboardAuditLogsWidget />
                            </motion.div>
                        </div>
                    </>
                )}
            </div>

            {/* Client Dialog */}
            <AddEditClientDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                client={editingClient}
            />

            {/* Confirm Delete Dialog */}
            <ConfirmDeleteDialog
                isOpen={!!deletingTrainee}
                onClose={() => setDeletingTrainee(null)}
                onConfirm={() => {
                    if (deletingTrainee) {
                        const traineeId = deletingTrainee.id || 1;
                        deleteClient(traineeId, {
                            onSuccess: () => {
                                setDeletingTrainee(null);
                            }
                        });
                    }
                }}
                title={`حذف المتدرب ${deletingTrainee?.name}`}
                description={`هل أنت متأكد من حذف المتدرب "${deletingTrainee?.name}"؟ سيتم حذف بيانات الالتزام الخاصة به وإلغاء تخصيص الأنظمة الغذائية التابعة له.`}
                isPending={isDeletePending}
            />
        </div>
    );
}
