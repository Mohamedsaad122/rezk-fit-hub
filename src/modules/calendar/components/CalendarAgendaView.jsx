import React from 'react';
import AppointmentCard from './AppointmentCard';
import { EmptyState } from '@/components/EmptyState';

export function CalendarAgendaView({ appointments, onInspect, onEdit, onDelete, onDuplicate }) {
    if (!appointments || appointments.length === 0) {
        return (
            <EmptyState
                icon="📅"
                title="لا توجد مواعيد مسجلة بالأجندة"
                description="جدول الأجندة فارغ تماماً. لا توجد حصص مجدولة تطابق معايير البحث."
            />
        );
    }

    // Group appointments by date YYYY-MM-DD
    const grouped = {};
    appointments.forEach((apt) => {
        if (!grouped[apt.date]) {
            grouped[apt.date] = [];
        }
        grouped[apt.date].push(apt);
    });

    const sortedDates = Object.keys(grouped).sort();

    const formatDateHeading = (dateStr) => {
        try {
            return new Date(dateStr).toLocaleDateString('ar-EG', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="space-y-6 max-h-[650px] overflow-y-auto pr-2 rtl text-right">
            {sortedDates.map((dateStr) => {
                const dateEvents = grouped[dateStr].sort((a, b) => a.startTime.localeCompare(b.startTime));
                return (
                    <div key={dateStr} className="space-y-3">
                        {/* Group date heading */}
                        <div className="sticky top-0 bg-background/90 backdrop-blur-sm z-10 py-1.5 border-b font-sans font-bold text-sm text-primary flex items-center gap-2">
                            <span className="w-1.5 h-3.5 bg-primary rounded-full" />
                            <span>{formatDateHeading(dateStr)}</span>
                        </div>

                        {/* List elements */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {dateEvents.map((apt) => (
                                <AppointmentCard
                                    key={apt.id}
                                    appointment={apt}
                                    onInspect={onInspect}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    onDuplicate={onDuplicate}
                                />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default React.memo(CalendarAgendaView);
