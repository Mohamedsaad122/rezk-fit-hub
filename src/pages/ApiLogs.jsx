import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import SEO from '@/components/SEO';
import { ArrowLeft, Terminal, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import ROUTES from '@/constants/routes.constants';
import { RateLimitService } from '@/services/rate-limit.service';

export const ApiLogs = () => {
    const [logs, setLogs] = useState([]);
    const [statusFilter, setStatusFilter] = useState('ALL');

    const fetchLogs = async () => {
        try {
            const list = await RateLimitService.getApiLogs();
            setLogs(list);
        } catch {
            // ignore
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const filteredLogs = logs.filter(log => {
        if (statusFilter === 'ALL') return true;
        if (statusFilter === 'SUCCESS') return log.status >= 200 && log.status < 300;
        if (statusFilter === 'ERROR') return log.status >= 400;
        return true;
    });

    return (
        <div className="container mx-auto p-6 space-y-6 text-right" dir="rtl">
            <SEO title="سجلات طلبات API (API Logs)" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-gradient-to-l from-primary/10 via-primary/5 to-background p-6 rounded-xl border border-primary/20 text-right">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2 justify-start">
                        <Terminal className="h-6 w-6 text-primary" />
                        سجلات عمليات بوابات API (Request Logs)
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        تحليل ومراقبة تفاصيل استهلاك مفاتيح الوصول وتفاصيل الاستجابة للطلبات الخارجية.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm">
                        <Link to={ROUTES.DEVELOPER_PORTAL} className="gap-1">
                            <ArrowLeft className="h-4 w-4" />
                            العودة للبوابة
                        </Link>
                    </Button>
                    <Button onClick={fetchLogs} size="sm" className="text-xs">تحديث السجلات</Button>
                </div>
            </div>

            <Card className="border border-border">
                <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-right flex-row-reverse">
                    <CardTitle className="text-base font-bold">جميع طلبات المطورين الواردة ({filteredLogs.length})</CardTitle>
                    
                    {/* Filters */}
                    <div className="flex gap-2 flex-row-reverse items-center text-xs">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <Button
                            size="xs"
                            variant={statusFilter === 'ALL' ? 'default' : 'outline'}
                            onClick={() => setStatusFilter('ALL')}
                        >
                            الكل
                        </Button>
                        <Button
                            size="xs"
                            variant={statusFilter === 'SUCCESS' ? 'default' : 'outline'}
                            onClick={() => setStatusFilter('SUCCESS')}
                        >
                            ناجحة (2xx)
                        </Button>
                        <Button
                            size="xs"
                            variant={statusFilter === 'ERROR' ? 'default' : 'outline'}
                            onClick={() => setStatusFilter('ERROR')}
                        >
                            فاشلة (4xx)
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0 text-xs">
                    {filteredLogs.length === 0 ? (
                        <div className="text-center py-16 text-muted-foreground">لا توجد سجلات مطابقة حالياً.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-right border-collapse">
                                <thead>
                                    <tr className="border-b border-border bg-muted/20">
                                        <th className="p-3">رابط الطلب</th>
                                        <th className="p-3 text-center">النوع</th>
                                        <th className="p-3 text-center">الحالة</th>
                                        <th className="p-3 text-center">الاستجابة (ms)</th>
                                        <th className="p-3 text-center">عنوان IP</th>
                                        <th className="p-3 text-left">الوقت</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredLogs.map(log => (
                                        <tr key={log.id} className="border-b border-border hover:bg-muted/5 font-mono text-[11px]">
                                            <td className="p-3 text-right text-primary font-semibold truncate max-w-[200px]">{log.path}</td>
                                            <td className="p-3 text-center">{log.method}</td>
                                            <td className="p-3 text-center">
                                                <Badge variant={log.status >= 400 ? 'destructive' : 'default'} className="text-[9px]">
                                                    {log.status}
                                                </Badge>
                                            </td>
                                            <td className="p-3 text-center text-foreground font-bold">{log.latencyMs}ms</td>
                                            <td className="p-3 text-center">{log.clientIp}</td>
                                            <td className="p-3 text-left text-muted-foreground">{new Date(log.timestamp).toLocaleTimeString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default ApiLogs;
