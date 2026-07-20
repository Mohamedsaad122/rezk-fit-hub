import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Settings } from 'lucide-react';

export const WorkflowInspector = ({ node, onChangeParams }) => {
    if (!node) {
        return (
            <Card className="border border-border">
                <CardContent className="p-10 text-center text-muted-foreground text-xs">
                    اختر عنصراً من لوحة الرسم لتعديل خياراته التفصيلية.
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border border-border">
            <CardContent className="p-4 space-y-4 text-right text-xs">
                <div className="flex items-center gap-2 flex-row-reverse justify-start">
                    <Settings className="h-4 w-4 text-primary" />
                    <h3 className="font-bold text-sm text-foreground">خصائص العنصر المحدد</h3>
                </div>
                
                <div className="space-y-1">
                    <label className="font-semibold block">معرف العنصر:</label>
                    <input
                        type="text"
                        value={node.id}
                        disabled
                        className="w-full p-2 border bg-muted/40 text-muted-foreground text-[10px] rounded font-mono"
                    />
                </div>

                <div className="space-y-1">
                    <label className="font-semibold block">اسم العنصر (Label):</label>
                    <input
                        type="text"
                        value={node.label}
                        onChange={(e) => onChangeParams(node.id, { label: e.target.value })}
                        className="w-full p-2 border bg-background text-foreground text-xs rounded"
                    />
                </div>

                <div className="space-y-1">
                    <label className="font-semibold block">فترة التأخير (بالثواني):</label>
                    <input
                        type="number"
                        value={node.parameters?.seconds || 0}
                        onChange={(e) => onChangeParams(node.id, { seconds: Number(e.target.value) })}
                        placeholder="ثواني"
                        className="w-full p-2 border bg-background text-foreground text-xs rounded"
                    />
                </div>
            </CardContent>
        </Card>
    );
};

export default WorkflowInspector;
