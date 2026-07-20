import React from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Maximize, Grid, Save } from 'lucide-react';

export const WorkflowToolbar = ({ onSave, onClear }) => {
    return (
        <div className="flex items-center justify-between bg-muted/20 border border-border p-3 rounded-lg text-right text-xs">
            <div className="flex gap-2">
                <Button size="xs" variant="outline" className="gap-1">
                    <ZoomIn className="h-3.5 w-3.5" />
                    تكبير
                </Button>
                <Button size="xs" variant="outline" className="gap-1">
                    <ZoomOut className="h-3.5 w-3.5" />
                    تصغير
                </Button>
                <Button size="xs" variant="outline" className="gap-1">
                    <Maximize className="h-3.5 w-3.5" />
                    ملاءمة
                </Button>
                <Button size="xs" variant="outline" className="gap-1">
                    <Grid className="h-3.5 w-3.5" />
                    شبكة
                </Button>
            </div>
            <div className="flex gap-2">
                <Button size="xs" variant="destructive" onClick={onClear}>مسح اللوحة</Button>
                <Button size="xs" onClick={onSave} className="gap-1">
                    <Save className="h-3.5 w-3.5" />
                    حفظ ونشر التعديلات
                </Button>
            </div>
        </div>
    );
};

export default WorkflowToolbar;
