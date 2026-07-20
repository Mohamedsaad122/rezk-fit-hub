import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Activity, Clock, Split, HelpCircle } from 'lucide-react';

export const WorkflowSidebar = ({ onAddNode }) => {
    const palette = [
        { type: 'Trigger', label: 'تنبيه: حدث جديد', icon: Play, desc: 'بدء التدفق عند حدوث حدث معين' },
        { type: 'Action', label: 'إجراء: إرسال بريد', icon: Activity, desc: 'تنفيذ أمر أو إرسال إشعار' },
        { type: 'Delay', label: 'مهلة زمنية', icon: Clock, desc: 'تأخير مؤقت للتنفيذ' },
        { type: 'Condition', label: 'شرط تفرع (IF)', icon: Split, desc: 'التحقق من البيانات قبل المواصلة' },
        { type: 'Approval', label: 'طلب موافقة', icon: HelpCircle, desc: 'طلب تصديق بشري للمواصلة' }
    ];

    return (
        <Card className="border border-border">
            <CardContent className="p-4 space-y-3 text-right">
                <h3 className="font-bold text-sm text-foreground mb-4">لوحة العناصر</h3>
                {palette.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                        <div
                            key={idx}
                            onClick={() => onAddNode(item.type, item.label)}
                            className="p-3 border border-border rounded-xl cursor-pointer hover:bg-muted/10 transition-colors flex items-start gap-2 flex-row-reverse text-right text-xs"
                        >
                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                <Icon className="h-4 w-4" />
                            </div>
                            <div className="space-y-0.5">
                                <strong className="block text-foreground">{item.label}</strong>
                                <span className="text-[10px] text-muted-foreground">{item.desc}</span>
                            </div>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
};

export default WorkflowSidebar;
