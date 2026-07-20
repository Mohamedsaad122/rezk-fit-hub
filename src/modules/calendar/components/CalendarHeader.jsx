import React from 'react';
import { ChevronRight, ChevronLeft, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCalendarNavigation, useCalendarView } from '../hooks/use-calendar-view';
import { generateWeekDays } from '../utils/calendar-utils';

export function CalendarHeader() {
    const { currentView, selectedDate } = useCalendarView();
    const { next, prev, today } = useCalendarNavigation();

    const getHeaderTitle = () => {
        const date = new Date(selectedDate);
        if (currentView === 'Month') {
            return date.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long' });
        } else if (currentView === 'Week') {
            const days = generateWeekDays(selectedDate);
            const start = new Date(days[0]);
            const end = new Date(days[6]);
            
            const startLabel = start.toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' });
            const endLabel = end.toLocaleDateString('ar-EG', { day: 'numeric', month: 'short', year: 'numeric' });
            return `أسبوع: ${startLabel} - ${endLabel}`;
        } else if (currentView === 'Day') {
            return date.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        }
        return "أجندة المواعيد واللقاءات";
    };

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4 rtl text-right">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-xl text-primary shrink-0">
                    <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="font-bold text-foreground text-lg leading-snug">{getHeaderTitle()}</h2>
                    <p className="text-xs text-muted-foreground">تصفح وجدولة الحصص واللقاءات</p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Button 
                    variant="outline" 
                    onClick={today}
                    className="h-9 px-4 rounded-xl border-border text-xs font-semibold"
                >
                    اليوم
                </Button>
                
                <div className="flex items-center border rounded-xl overflow-hidden bg-background">
                    <Button 
                        variant="ghost" 
                        onClick={prev} 
                        className="h-9 w-9 p-0 rounded-none border-l hover:bg-muted"
                        title="السابق"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                    <Button 
                        variant="ghost" 
                        onClick={next} 
                        className="h-9 w-9 p-0 rounded-none hover:bg-muted"
                        title="التالي"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default CalendarHeader;
