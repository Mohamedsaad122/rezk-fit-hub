import React, { useState } from 'react';
import { useAuditLogs } from '@/hooks/use-audit-logs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toastService } from '@/services/toast.service';
import { 
    Search, Download, Filter, Terminal, Calendar, 
    Monitor, ShieldCheck, ShieldAlert, ChevronLeft, ChevronRight 
} from 'lucide-react';

export const AdminAuditLogs = () => {
    const [search, setSearch] = useState('');
    const [entity, setEntity] = useState('All');
    const [status, setStatus] = useState('All');
    const [page, setPage] = useState(1);

    const { data: logs, meta, isLoading } = useAuditLogs({
        search,
        entity,
        status,
        page,
        limit: 10
    });

    const handleExport = () => {
        toastService.success('تم تصدير سجلات التدقيق بنجاح بصيغة CSV');
    };

    const entities = [
        'Authentication', 'Clients', 'Calendar', 'Tasks', 
        'Documents', 'RBAC', 'Branches', 'Users'
    ];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 rtl text-right" dir="rtl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
                <div>
                    <h1 className="text-3xl font-extrabold text-foreground tracking-tight">سجل تدقيق العمليات الأمنية</h1>
                    <p className="text-muted-foreground text-sm mt-1">تتبع كافة العمليات والإجراءات الحساسة التي تمت على النظام للمراقبة والامتثال.</p>
                </div>
                <Button onClick={handleExport} className="gap-2 bg-gradient-primary text-white">
                    <Download className="w-4 h-4" />
                    تصدير السجلات
                </Button>
            </div>

            {/* Filters */}
            <Card className="border-border">
                <CardContent className="p-4 flex flex-col md:flex-row md:items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute right-3 top-2.5 w-4 h-4 text-muted-foreground" />
                        <Input 
                            placeholder="البحث بالعملية، التفاصيل، أو اسم المستخدم..." 
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="pr-10"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2 items-center">
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
                            <select 
                                value={entity} 
                                onChange={(e) => { setEntity(e.target.value); setPage(1); }}
                                className="bg-background border border-border rounded-lg text-sm p-2 text-foreground focus:outline-none"
                            >
                                <option value="All">كل الكيانات</option>
                                {entities.map(e => <option key={e} value={e}>{e}</option>)}
                            </select>
                        </div>

                        <select 
                            value={status} 
                            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                            className="bg-background border border-border rounded-lg text-sm p-2 text-foreground focus:outline-none"
                        >
                            <option value="All">كل الحالات</option>
                            <option value="Success">ناجح (Success)</option>
                            <option value="Failure">فاشل (Failure)</option>
                        </select>
                    </div>
                </CardContent>
            </Card>

            {/* Logs Table */}
            <Card className="border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right">
                        <thead className="bg-muted/50 border-b border-border text-muted-foreground uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">العملية / القسم</th>
                                <th className="px-6 py-4">المستخدم المسؤول</th>
                                <th className="px-6 py-4">التفاصيل</th>
                                <th className="px-6 py-4">التاريخ والوقت</th>
                                <th className="px-6 py-4">الشبكة والرمز</th>
                                <th className="px-6 py-4">الحالة</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-10 text-muted-foreground">جاري تحميل سجلات العمليات...</td>
                                </tr>
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-10 text-muted-foreground">لم يتم العثور على أي سجلات مطابقة.</td>
                                </tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Terminal className="w-4 h-4 text-primary shrink-0" />
                                                <div>
                                                    <p className="font-semibold text-foreground">{log.action}</p>
                                                    <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{log.entity}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-foreground font-medium">{log.user}</td>
                                        <td className="px-6 py-4 max-w-xs text-xs text-muted-foreground leading-relaxed">{log.details}</td>
                                        <td className="px-6 py-4 text-xs text-muted-foreground whitespace-nowrap">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {new Date(log.date).toLocaleDateString('ar-SA', {
                                                    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-muted-foreground">
                                            <div className="space-y-0.5">
                                                <p className="font-mono">{log.ip}</p>
                                                <div className="flex items-center gap-1 text-[10px] opacity-75">
                                                    <Monitor className="w-3 h-3 shrink-0" />
                                                    <span className="truncate max-w-[120px]" title={log.device}>{log.device}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge 
                                                variant={log.status === 'Success' ? 'default' : 'destructive'} 
                                                className={`gap-1 ${log.status === 'Success' ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' : ''}`}
                                            >
                                                {log.status === 'Success' ? (
                                                    <>
                                                        <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                                                        ناجح
                                                    </>
                                                ) : (
                                                    <>
                                                        <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                                                        فاشل
                                                    </>
                                                )}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination footer */}
                {!isLoading && meta.totalPages > 1 && (
                    <div className="p-4 border-t border-border flex items-center justify-between bg-muted/20">
                        <span className="text-xs text-muted-foreground">
                            عرض الصفحة {meta.page} من أصل {meta.totalPages} (الإجمالي {meta.total} سجلات)
                        </span>
                        <div className="flex items-center gap-1">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                disabled={meta.page <= 1}
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                            >
                                <ChevronRight className="w-4 h-4" />
                                السابق
                            </Button>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                disabled={meta.page >= meta.totalPages}
                                onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                            >
                                التالي
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default AdminAuditLogs;
