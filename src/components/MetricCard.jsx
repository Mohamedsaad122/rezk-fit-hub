import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const MetricCard = ({ title, value, unit, icon: Icon, description }) => {
    return (
        <Card className="bg-muted/10 border border-border/40 text-right">
            <CardHeader className="pb-2 text-right">
                <div className="flex items-center justify-between flex-row-reverse">
                    {Icon && <span className="p-1.5 bg-primary/10 rounded-lg text-primary"><Icon className="h-4 w-4" /></span>}
                    <CardTitle className="text-xs font-bold text-zinc-400">{title}</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-xl font-bold text-foreground">
                    {value} <span className="text-xs text-zinc-500 font-normal">{unit}</span>
                </div>
                {description && <p className="text-[10px] text-zinc-400 mt-1">{description}</p>}
            </CardContent>
        </Card>
    );
};

export default MetricCard;
