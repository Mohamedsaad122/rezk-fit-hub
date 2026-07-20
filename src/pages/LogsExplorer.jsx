import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import SEO from '@/components/SEO';
import { LoggingService } from '@/services/logging.service';
import LogsTable from '@/components/LogsTable';
import { Terminal, Search } from 'lucide-react';

export const LogsExplorer = () => {
    const [logs, setLogs] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [filteredLogs, setFilteredLogs] = useState([]);

    useEffect(() => {
        const fetchLogs = async () => {
            const list = await LoggingService.getLogs();
            setLogs(list);
            setFilteredLogs(list);
        };
        fetchLogs();
    }, []);

    const handleSearch = (e) => {
        const txt = e.target.value;
        setFilterText(txt);
        if (!txt) {
            setFilteredLogs(logs);
        } else {
            const filtered = logs.filter(l => 
                l.message.toLowerCase().includes(txt.toLowerCase()) || 
                l.category.toLowerCase().includes(txt.toLowerCase()) ||
                l.level.toLowerCase().includes(txt.toLowerCase())
            );
            setFilteredLogs(filtered);
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6 text-right" dir="rtl">
            <SEO title="مستكشف سجل الأحداث" />

            <div className="space-y-1">
                <h1 className="text-2xl font-bold text-foreground">مستكشف سجل الأحداث (Logs Explorer)</h1>
                <p className="text-sm text-muted-foreground">عرض وبحث كامل في سجلات تشغيل النظام والتطبيقات.</p>
            </div>

            <div className="relative">
                <Search className="absolute right-3 top-2.5 h-4 w-4 text-zinc-400" />
                <input 
                    type="text" 
                    placeholder="البحث في الرسائل، التصنيفات، أو مستويات الخطورة..." 
                    className="w-full p-2 pr-9 border bg-background text-foreground text-xs rounded-lg text-right"
                    value={filterText}
                    onChange={handleSearch}
                />
            </div>

            <Card className="border border-border/40">
                <CardHeader className="text-right">
                    <CardTitle className="text-base font-bold text-foreground flex items-center gap-2 justify-end">
                        <Terminal className="h-4 w-4 text-primary" />
                        <span>سجل النظام الفوري</span>
                    </CardTitle>
                    <CardDescription>أحدث العمليات وسجلات الأحداث الفورية للبنية التحتية</CardDescription>
                </CardHeader>
                <CardContent>
                    <LogsTable logs={filteredLogs} />
                </CardContent>
            </Card>
        </div>
    );
};

export default LogsExplorer;
