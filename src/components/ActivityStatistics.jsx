import React from 'react';
import { User, Dumbbell, Apple, Calendar, CheckSquare, Activity } from 'lucide-react';

export const ActivityStatistics = ({ stats = {} }) => {
    const statCards = [
        {
            key: 'total',
            label: 'إجمالي العمليات',
            value: stats.total || 0,
            icon: Activity,
            color: 'text-primary bg-primary/10'
        },
        {
            key: 'client',
            label: 'المتدربين الجدد',
            value: stats.client || 0,
            icon: User,
            color: 'text-blue-500 bg-blue-500/10'
        },
        {
            key: 'workout',
            label: 'جداول التمارين',
            value: stats.workout || 0,
            icon: Dumbbell,
            color: 'text-purple-500 bg-purple-500/10'
        },
        {
            key: 'nutrition',
            label: 'الخطط الغذائية',
            value: stats.nutrition || 0,
            icon: Apple,
            color: 'text-orange-500 bg-orange-500/10'
        },
        {
            key: 'appointment',
            label: 'المواعيد واللقاءات',
            value: stats.appointment || 0,
            icon: Calendar,
            color: 'text-teal-500 bg-teal-500/10'
        },
        {
            key: 'task',
            label: 'المهام والمتابعات',
            value: stats.task || 0,
            icon: CheckSquare,
            color: 'text-emerald-500 bg-emerald-500/10'
        }
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3.5">
            {statCards.map((card) => {
                const Icon = card.icon;
                return (
                    <div
                        key={card.key}
                        className="bg-card border border-border/40 rounded-xl p-3.5 flex flex-col justify-between shadow-sm select-none"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold text-muted-foreground truncate">
                                {card.label}
                            </span>
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${card.color}`}>
                                <Icon className="w-4 h-4" />
                            </div>
                        </div>
                        <h4 className="text-xl font-black text-foreground">
                            {card.value}
                        </h4>
                    </div>
                );
            })}
        </div>
    );
};

export default ActivityStatistics;
