import React from 'react';
import { generateTimeSlots } from '../utils/calendar-utils';
import CalendarEventCell from './CalendarEventCell';
import CurrentTimeIndicator from './CurrentTimeIndicator';

const WEEKDAYS = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

// Let's design the actual grid component that takes activeDays as a prop directly to avoid state dependencies
export function CalendarWeekGrid({ activeDays, appointments, onInspect, onMove, onResize, onEmptySlotClick }) {
    const hours = generateTimeSlots();

    const parseTime = (t) => {
        const [h, m] = t.split(':').map(Number);
        return h * 60 + m;
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e, dateStr) => {
        e.preventDefault();
        const dataStr = e.dataTransfer.getData("text/plain");
        if (!dataStr) return;
        try {
            const event = JSON.parse(dataStr);
            const rect = e.currentTarget.getBoundingClientRect();
            const dropY = e.clientY - rect.top;
            
            // 60px height per hour block => 1px = 1min. Round to 15-minute chunks
            const offsetMins = Math.round(dropY / 15) * 15;
            const startMins = (6 * 60) + offsetMins; // 06:00 baseline
            
            const duration = parseTime(event.endTime) - parseTime(event.startTime);
            const finalStart = Math.max(360, Math.min(1320 - duration, startMins));
            const finalEnd = finalStart + duration;

            const format = (mins) => {
                const h = String(Math.floor(mins / 60)).padStart(2, '0');
                const m = String(mins % 60).padStart(2, '0');
                return `${h}:${m}`;
            };

            onMove(event, dateStr, format(finalStart), format(finalEnd));
        } catch {
            // failed parsing
        }
    };

    const handleColumnClick = (e, dateStr) => {
        if (e.target !== e.currentTarget) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const clickY = e.clientY - rect.top;
        const offsetMins = Math.round(clickY / 15) * 15;
        const startMins = (6 * 60) + offsetMins;

        const format = (mins) => {
            const h = String(Math.floor(mins / 60)).padStart(2, '0');
            const m = String(mins % 60).padStart(2, '0');
            return `${h}:${m}`;
        };

        onEmptySlotClick(dateStr, format(startMins), format(startMins + 60));
    };

    return (
        <div className="border border-border/80 rounded-2xl overflow-hidden bg-card/60 backdrop-blur-sm shadow-sm flex flex-col h-[700px] rtl text-right">
            {/* Header day Columns */}
            <div className="grid grid-cols-8 border-b bg-muted/30 text-center font-sans font-bold text-xs py-2 text-muted-foreground select-none">
                <div className="border-l">الوقت</div>
                {activeDays.map((dayStr) => {
                    const dayName = WEEKDAYS[new Date(dayStr).getDay()];
                    const dayNum = new Date(dayStr).getDate();
                    return (
                        <div key={dayStr} className="border-l border-border/60">
                            <div>{dayName}</div>
                            <div className="text-foreground text-sm font-black mt-0.5">{dayNum}</div>
                        </div>
                    );
                })}
            </div>

            {/* Hourly Slots Matrix Container */}
            <div className="flex-grow overflow-y-auto relative h-[600px] flex">
                {/* 1. Time Label Rows */}
                <div className="w-[12.5%] shrink-0 border-l relative bg-muted/5 select-none" style={{ height: '960px' }}>
                    {hours.map((h) => (
                        <div 
                            key={h} 
                            className="text-[10px] text-muted-foreground font-sans font-semibold text-center border-b flex items-center justify-center"
                            style={{ height: '60px' }}
                        >
                            {h}
                        </div>
                    ))}
                </div>

                {/* 2. Grid Columns */}
                <div className="grid grid-cols-7 flex-grow relative" style={{ height: '960px' }}>
                    {/* Hourly background lines */}
                    <div className="absolute inset-0 pointer-events-none flex flex-col">
                        {hours.map((h) => (
                            <div key={h} className="border-b border-border/40 w-full" style={{ height: '60px' }} />
                        ))}
                    </div>

                    {/* Columns */}
                    {activeDays.map((dayStr) => {
                        const dayEvents = appointments.filter(e => e.date === dayStr);

                        return (
                            <div
                                key={dayStr}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, dayStr)}
                                onClick={(e) => handleColumnClick(e, dayStr)}
                                className="border-l border-border/60 relative hover:bg-muted/5 transition-all select-none"
                                style={{ height: '960px' }}
                            >
                                <CurrentTimeIndicator columnDate={dayStr} />

                                {/* Render appointments */}
                                {dayEvents.map((apt) => {
                                    const start = parseTime(apt.startTime);
                                    const end = parseTime(apt.endTime);
                                    const topOffset = start - 360; // offset from 06:00 (360 mins)
                                    const heightOffset = end - start;

                                    if (topOffset < 0 || heightOffset <= 0) return null;

                                    return (
                                        <CalendarEventCell
                                            key={apt.id}
                                            appointment={apt}
                                            onClick={onInspect}
                                            onResize={onResize}
                                            style={{
                                                top: `${topOffset}px`,
                                                height: `${heightOffset}px`
                                            }}
                                        />
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default React.memo(CalendarWeekGrid);
