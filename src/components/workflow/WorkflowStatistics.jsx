import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, ShieldCheck, XCircle } from 'lucide-react';

export const WorkflowStatistics = ({ runs = [] }) => {
    const total = runs.length;
    const completed = runs.filter(r => r.status === 'Completed').length;
    const failed = runs.filter(r => r.status === 'Failed').length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 100;

    const stats = [
        { label: 'إجمالي التشغيل', value: total, icon: Activity, color: 'text-primary' },
        { label: 'مكتمل بنجاح', value: completed, icon: ShieldCheck, color: 'text-emerald-500' },
        { label: 'فشل التنفيذ', value: failed, icon: XCircle, color: 'text-red-500' },
        { label: 'معدل النجاح', value: `${rate}%`, icon: ShieldCheck, color: 'text-primary' }
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-right">
            {stats.map((st, idx) => {
                const Icon = st.icon;
                return (
                    <Card key={idx} className="border border-border">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 flex-row-reverse text-right">
                            <CardTitle className="text-xs font-semibold text-muted-foreground">{st.label}</CardTitle>
                            <Icon className={`h-4 w-4 ${st.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">{st.value}</div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};

export default WorkflowStatistics;
