import React from 'react';
import { Button } from '@/components/ui/button';
import { useCalendarView } from '../hooks/use-calendar-view';

const VIEW_MODES = [
    { value: 'Month', label: 'شهري' },
    { value: 'Week', label: 'أسبوعي' },
    { value: 'Day', label: 'يومي' },
    { value: 'Agenda', label: 'أجندة' }
];

export function CalendarViewSwitcher() {
    const { currentView, setView } = useCalendarView();

    return (
        <div className="flex bg-muted p-1 rounded-xl w-fit rtl text-right">
            {VIEW_MODES.map((mode) => {
                const isActive = currentView === mode.value;
                return (
                    <Button
                        key={mode.value}
                        type="button"
                        variant={isActive ? "default" : "ghost"}
                        onClick={() => setView(mode.value)}
                        className={`h-8 px-4 text-xs rounded-lg font-semibold transition-all ${
                            isActive 
                                ? "bg-background text-foreground shadow-sm hover:bg-background" 
                                : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                        {mode.label}
                    </Button>
                );
            })}
        </div>
    );
}

export default CalendarViewSwitcher;
