import React from 'react';
import { generateTimeSlots } from '../utils/calendar-utils';
import CalendarEventCell from './CalendarEventCell';
import CurrentTimeIndicator from './CurrentTimeIndicator';

export function CalendarDayView({ selectedDate, appointments, onInspect, onMove, onResize, onEmptySlotClick }) {
    const hours = generateTimeSlots();

    const parseTime = (t) => {
        const [h, m] = t.split(':').map(Number);
        return h * 60 + m;
    };

    const dayEvents = appointments.filter(e => e.date === selectedDate);

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const dataStr = e.dataTransfer.getData("text/plain");
        if (!dataStr) return;
        try {
            const event = JSON.parse(dataStr);
            const rect = e.currentTarget.getBoundingClientRect();
            const dropY = e.clientY - rect.top;
            
            const offsetMins = Math.round(dropY / 15) * 15;
            const startMins = (6 * 60) + offsetMins;
            
            const duration = parseTime(event.endTime) - parseTime(event.startTime);
            const finalStart = Math.max(360, Math.min(1320 - duration, startMins));
            const finalEnd = finalStart + duration;

            const format = (mins) => {
                const h = String(Math.floor(mins / 60)).padStart(2, '0');
                const m = String(mins % 60).padStart(2, '0');
                return `${h}:${m}`;
            };

            onMove(event, selectedDate, format(finalStart), format(finalEnd));
        } catch {
            // failed parsing
        }
    };

    const handleSlotClick = (e) => {
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

        onEmptySlotClick(selectedDate, format(startMins), format(startMins + 60));
    };

    return (
        <div className="border border-border/80 rounded-2xl overflow-hidden bg-card/60 backdrop-blur-sm shadow-sm flex flex-col h-[700px] rtl text-right">
            {/* Header Column */}
            <div className="grid grid-cols-8 border-b bg-muted/30 text-center font-sans font-bold text-xs py-2 text-muted-foreground select-none">
                <div className="border-l">الوقت</div>
                <div className="col-span-7 border-l border-border/60">
                    {new Date(selectedDate).toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' })}
                </div>
            </div>

            {/* Time Slots Container */}
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

                {/* 2. Grid Day Column */}
                <div 
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={handleSlotClick}
                    className="col-span-7 flex-grow relative hover:bg-muted/5 transition-all select-none" 
                    style={{ height: '960px' }}
                >
                    {/* Hourly background lines */}
                    <div className="absolute inset-0 pointer-events-none flex flex-col">
                        {hours.map((h) => (
                            <div key={h} className="border-b border-border/40 w-full" style={{ height: '60px' }} />
                        ))}
                    </div>

                    <CurrentTimeIndicator columnDate={selectedDate} />

                    {/* Render appointments */}
                    {dayEvents.map((apt) => {
                        const start = parseTime(apt.startTime);
                        const end = parseTime(apt.endTime);
                        const topOffset = start - 360;
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
            </div>
        </div>
    );
}

export default React.memo(CalendarDayView);
