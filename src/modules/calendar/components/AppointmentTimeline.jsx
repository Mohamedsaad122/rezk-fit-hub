import React from 'react';
import AppointmentCard from './AppointmentCard';
import { EmptyState } from '@/components/EmptyState';

export function AppointmentTimeline({ appointments, onInspect, onEdit, onDelete, onDuplicate }) {
    if (!appointments || appointments.length === 0) {
        return (
            <EmptyState
                icon="📅"
                title="لا توجد مواعيد مسجلة"
                description="لم يتم العثور على جلسات أو مواعيد تطابق فلاتر البحث المعينة."
            />
        );
    }

    // Sort by date and then by start time chronologically
    const sorted = [...appointments].sort((a, b) => 
        a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime)
    );

    return (
        <div className="relative border-r border-border/80 pr-6 mr-3 space-y-6 rtl text-right">
            {sorted.map((apt) => (
                <div key={apt.id} className="relative">
                    {/* Time Bullet Dot */}
                    <span className="absolute -right-[31px] top-1.5 flex h-3 w-3 items-center justify-center rounded-full bg-primary ring-4 ring-background">
                        <span className="h-1.5 w-1.5 rounded-full bg-background" />
                    </span>
                    
                    {/* Time Indicator label */}
                    <div className="text-xs text-muted-foreground font-sans font-bold mb-1">
                        {apt.date} @ {apt.startTime}
                    </div>

                    <AppointmentCard
                        appointment={apt}
                        onInspect={onInspect}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onDuplicate={onDuplicate}
                    />
                </div>
            ))}
        </div>
    );
}

export default AppointmentTimeline;
