import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCalendarView } from '../hooks/use-calendar-view';
import { generateMonthMatrix } from '../utils/calendar-utils';

const WEEKDAYS = ["أ", "ن", "ث", "ر", "خ", "ج", "س"];

export function CalendarMiniCalendar({ allEvents = [] }) {
    const { selectedDate, setSelectedDate } = useCalendarView();
    
    // Manage local display month/year for the picker
    const [viewDate, setViewDate] = useState(new Date(selectedDate));

    useEffect(() => {
        setViewDate(new Date(selectedDate));
    }, [selectedDate]);

    const month = viewDate.getMonth();

    const monthTitle = viewDate.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long' });
    const matrix = generateMonthMatrix(viewDate.toISOString().split('T')[0]);

    const navigateMonth = (offset) => {
        const d = new Date(viewDate);
        d.setMonth(d.getMonth() + offset);
        setViewDate(d);
    };

    const handleDateSelect = (dateStr) => {
        setSelectedDate(dateStr);
    };

    const hasEventsOnDate = (dateStr) => {
        return allEvents.some(e => e.date === dateStr);
    };

    return (
        <div className="border border-border/80 rounded-2xl p-4 bg-card/60 backdrop-blur-sm space-y-3 rtl text-right select-none">
            <div className="flex justify-between items-center">
                <span className="font-bold text-xs text-foreground font-sans">{monthTitle}</span>
                <div className="flex items-center gap-1">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => navigateMonth(1)}
                        className="h-6 w-6 p-0 rounded-lg hover:bg-muted"
                    >
                        <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => navigateMonth(-1)}
                        className="h-6 w-6 p-0 rounded-lg hover:bg-muted"
                    >
                        <ChevronLeft className="w-3.5 h-3.5" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-y-1 text-center">
                {/* Weekday headers */}
                {WEEKDAYS.map((day, idx) => (
                    <span key={idx} className="text-[10px] font-bold text-muted-foreground py-1 font-sans">
                        {day}
                    </span>
                ))}

                {/* Day Matrix Cells */}
                {matrix.map((dateStr) => {
                    const d = new Date(dateStr);
                    const isCurrentMonth = d.getMonth() === month;
                    const isSelected = dateStr === selectedDate;
                    const hasEvents = hasEventsOnDate(dateStr);

                    return (
                        <button
                            key={dateStr}
                            type="button"
                            onClick={() => handleDateSelect(dateStr)}
                            className={`h-7 w-7 mx-auto rounded-full flex flex-col items-center justify-center text-xs relative transition-all ${
                                isSelected
                                    ? "bg-primary text-white font-bold"
                                    : isCurrentMonth
                                        ? "text-foreground hover:bg-muted"
                                        : "text-muted-foreground/45 hover:bg-muted/50"
                            }`}
                        >
                            <span className="font-sans font-semibold">{d.getDate()}</span>
                            {hasEvents && !isSelected && (
                                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-primary" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default CalendarMiniCalendar;
