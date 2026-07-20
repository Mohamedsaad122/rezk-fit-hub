import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const NodePalette = ({ onSelectCategory }) => {
    const categories = [
        { key: 'Triggers', label: 'المشغلات (Triggers)', items: ['ClientCreated', 'WorkoutAssigned', 'InvoiceGenerated', 'CronSchedule'] },
        { key: 'Actions', label: 'الإجراءات (Actions)', items: ['SendNotification', 'SendSMS', 'AssignWorkout', 'CallRESTAPI'] }
    ];

    return (
        <Card className="border border-border">
            <CardHeader className="pb-2 text-right">
                <CardTitle className="text-sm font-bold">مصنف الأحداث</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs text-right">
                {categories.map((cat, idx) => (
                    <div key={idx} className="space-y-2">
                        <strong className="text-muted-foreground text-[10px] block">{cat.label}</strong>
                        <div className="flex flex-wrap gap-1 justify-end">
                            {cat.items.map(item => (
                                <Badge
                                    key={item}
                                    variant="outline"
                                    onClick={() => onSelectCategory?.(item)}
                                    className="cursor-pointer hover:bg-primary/20 text-[9px] font-mono"
                                >
                                    {item}
                                </Badge>
                            ))}
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};

export default NodePalette;
