import React from 'react';
import { Calendar, Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function AppointmentCalendarToolbar({ selectedDate, onDateChange, onAddClick, onResetDate }) {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-card border rounded-2xl p-4 shadow-sm rtl text-right">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl text-primary shrink-0">
                    <Calendar className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-bold text-foreground text-sm">عرض جدول المواعيد</h3>
                    <p className="text-xs text-muted-foreground">اختر تاريخاً محدداً لعرض وتصفية الجلسات الخاصة به</p>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                    <Input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => onDateChange(e.target.value)}
                        className="rounded-xl border-border h-10 w-40 text-xs font-sans font-semibold"
                    />
                    {selectedDate !== '2026-07-13' && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onResetDate}
                            className="h-10 px-3 rounded-xl border-border hover:bg-muted"
                            title="اليوم الحالي"
                        >
                            <RefreshCw className="w-4 h-4 text-muted-foreground" />
                        </Button>
                    )}
                </div>

                <Button
                    type="button"
                    onClick={onAddClick}
                    className="bg-primary hover:bg-primary/90 text-white rounded-xl h-10 font-semibold text-xs flex items-center gap-2 px-4 shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    <span>حجز موعد جديد</span>
                </Button>
            </div>
        </div>
    );
}

export default AppointmentCalendarToolbar;
