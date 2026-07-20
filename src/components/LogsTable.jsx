import React from 'react';
import { Badge } from '@/components/ui/badge';

export const LogsTable = ({ logs = [] }) => {
    return (
        <div className="w-full overflow-x-auto border border-border/40 rounded-lg">
            <table className="w-full text-right rtl border-collapse text-xs font-mono">
                <thead>
                    <tr className="bg-muted/30 border-b border-border/40 text-zinc-400">
                        <th className="p-3 text-right">الوقت</th>
                        <th className="p-3 text-right">المستوى</th>
                        <th className="p-3 text-right">الفئة</th>
                        <th className="p-3 text-right">الرسالة</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="text-center py-6 text-xs text-zinc-500">لا توجد سجلات مطابقة للبحث.</td>
                        </tr>
                    ) : (
                        logs.map((log, idx) => {
                            const isError = log.level === 'Error' || log.level === 'Critical';
                            const isWarning = log.level === 'Warning';
                            return (
                                <tr key={log.id || idx} className="border-b border-border/20 hover:bg-muted/5">
                                    <td className="p-3 text-zinc-500 text-[10px]">
                                        {new Date(log.timestamp).toLocaleTimeString('ar-EG')}
                                    </td>
                                    <td className="p-3">
                                        <Badge variant="outline" className={isError ? 'border-red-500/30 text-red-500 bg-red-500/5' : isWarning ? 'border-amber-500/30 text-amber-500 bg-amber-500/5' : 'border-zinc-500/30 text-zinc-400'}>
                                            {log.level}
                                        </Badge>
                                    </td>
                                    <td className="p-3 text-zinc-300 font-semibold">{log.category}</td>
                                    <td className="p-3 text-zinc-400 max-w-[300px] truncate">{log.message}</td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default LogsTable;
