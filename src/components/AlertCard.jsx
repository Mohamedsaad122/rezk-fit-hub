import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldAlert, Check } from 'lucide-react';

export const AlertCard = ({ alert, onResolve }) => {
    const isCritical = alert.severity === 'Critical';
    const isWarning = alert.severity === 'Warning';
    const isActive = alert.status === 'Active';

    return (
        <Card className={`border text-right ${isCritical ? 'border-red-500/20 bg-red-500/5' : isWarning ? 'border-amber-500/20 bg-amber-500/5' : 'border-zinc-500/20 bg-zinc-500/5'}`}>
            <CardHeader className="pb-2 text-right">
                <div className="flex items-center justify-between flex-row-reverse">
                    <span className={`p-1 rounded flex items-center gap-1 text-[9px] font-bold ${isCritical ? 'bg-red-500/10 text-red-500' : isWarning ? 'bg-amber-500/10 text-amber-500' : 'bg-zinc-500/10 text-zinc-400'}`}>
                        <ShieldAlert className="h-3 w-3" />
                        {alert.severity}
                    </span>
                    <CardTitle className="text-sm font-bold text-foreground">{alert.title}</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                <p className="text-xs text-zinc-300 leading-relaxed">{alert.message}</p>
                <div className="flex items-center justify-between text-[9px] text-zinc-500 flex-row-reverse pt-2 border-t border-border/40">
                    <span>فئة: {alert.category}</span>
                    <span>تاريخ: {new Date(alert.createdAt).toLocaleString('ar-EG')}</span>
                </div>
                {isActive && onResolve && (
                    <div className="flex justify-end pt-1">
                        <Button size="sm" variant="outline" className="h-7 text-[10px] gap-1 flex flex-row-reverse items-center hover:bg-emerald-500/10 hover:text-emerald-500" onClick={() => onResolve(alert.id)}>
                            <Check className="h-3 w-3" />
                            <span>تجاوز وحل التنبيه</span>
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default AlertCard;
