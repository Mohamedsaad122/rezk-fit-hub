import React from 'react';
import { generateMonthMatrix } from '../utils/calendar-utils';
import { useCalendarView } from '../hooks/use-calendar-view';

const WEEKDAYS = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

const EVENT_COLORS = {
    blue: "bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-300",
    green: "bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-300",
    purple: "bg-purple-500/10 border-purple-500/30 text-purple-700 dark:text-purple-300",
    yellow: "bg-yellow-500/10 border-yellow-500/30 text-yellow-700 dark:text-yellow-300",
    orange: "bg-orange-500/10 border-orange-500/30 text-orange-700 dark:text-orange-300",
    red: "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300"
};

export function CalendarMonthView({ appointments, onInspect, onMove, onEmptyCellClick }) {
    const { selectedDate, setSelectedDate } = useCalendarView();

    const viewDate = new Date(selectedDate);
    const month = viewDate.getMonth();
    const matrix = generateMonthMatrix(selectedDate);

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e, targetDate) => {
        e.preventDefault();
        const dataStr = e.dataTransfer.getData("text/plain");
        if (!dataStr) return;
        try {
            const event = JSON.parse(dataStr);
            onMove(event, targetDate, event.startTime, event.endTime);
        } catch {
            // failed parsing
        }
    };

    return (
        <div className="border border-border/80 rounded-2xl overflow-hidden bg-card/60 backdrop-blur-sm shadow-sm flex flex-col h-[650px] rtl text-right">
            {/* Header Columns */}
            <div className="grid grid-cols-7 border-b bg-muted/30 text-center font-sans font-bold text-xs py-2 text-muted-foreground select-none">
                {WEEKDAYS.map((day) => (
                    <span key={day}>{day}</span>
                ))}
            </div>

            {/* Month Day Grid */}
            <div className="grid grid-cols-7 flex-grow">
                {matrix.map((dateStr) => {
                    const cellDate = new Date(dateStr);
                    const isCurrentMonth = cellDate.getMonth() === month;
                    const isSelected = dateStr === selectedDate;
                    
                    const dayEvents = appointments.filter(e => e.date === dateStr);

                    return (
                        <div
                            key={dateStr}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, dateStr)}
                            onClick={(e) => {
                                if (e.target === e.currentTarget) {
                                    onEmptyCellClick(dateStr);
                                }
                            }}
                            className={`border-b border-l border-border/60 p-1 flex flex-col justify-between min-h-[90px] relative transition-all ${
                                isSelected 
                                    ? "bg-primary/5 dark:bg-primary/10" 
                                    : isCurrentMonth 
                                        ? "hover:bg-muted/10" 
                                        : "bg-muted/20 text-muted-foreground/50"
                            }`}
                        >
                            {/* Date Number Label */}
                            <button
                                type="button"
                                onClick={() => setSelectedDate(dateStr)}
                                className={`text-[10px] font-sans font-bold h-5 w-5 rounded-full flex items-center justify-center m-1 ${
                                    isSelected 
                                        ? "bg-primary text-white" 
                                        : isCurrentMonth 
                                            ? "text-foreground hover:bg-muted" 
                                            : "text-muted-foreground/35"
                                }`}
                            >
                                {cellDate.getDate()}
                            </button>

                            {/* Events List Box */}
                            <div className="space-y-1 overflow-y-auto flex-grow max-h-[80px] p-0.5 custom-scrollbar">
                                {dayEvents.slice(0, 3).map((event) => {
                                    const colorClass = EVENT_COLORS[event.color] || EVENT_COLORS.blue;
                                    return (
                                        <button
                                            key={event.id}
                                            type="button"
                                            onClick={() => onInspect(event)}
                                            className={`w-full text-left truncate text-[10px] font-sans font-semibold rounded px-1.5 py-0.5 border leading-tight block ${colorClass}`}
                                        >
                                            {event.lock?.isLocked && "🔒 "}{event.startTime} {event.title}
                                        </button>
                                    );
                                })}
                                {dayEvents.length > 3 && (
                                    <span className="text-[9px] text-muted-foreground font-sans block text-center">
                                        + {dayEvents.length - 3} مواعيد أخرى
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default React.memo(CalendarMonthView);
