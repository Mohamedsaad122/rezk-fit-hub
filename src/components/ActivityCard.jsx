import React from 'react';
import { User, Dumbbell, Apple, Calendar, CheckSquare, Bell, MessageSquare, Info } from 'lucide-react';
import { formatRelativeTime } from '@/utils/relative-time';

const categoryConfig = {
    Client: {
        icon: User,
        color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
        label: 'متدربين'
    },
    Workout: {
        icon: Dumbbell,
        color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
        label: 'تمارين'
    },
    Nutrition: {
        icon: Apple,
        color: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
        label: 'تغذية'
    },
    Appointment: {
        icon: Calendar,
        color: 'text-teal-500 bg-teal-500/10 border-teal-500/20',
        label: 'مواعيد'
    },
    Task: {
        icon: CheckSquare,
        color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
        label: 'مهام'
    },
    Notification: {
        icon: Bell,
        color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
        label: 'إشعارات'
    },
    Message: {
        icon: MessageSquare,
        color: 'text-pink-500 bg-pink-500/10 border-pink-500/20',
        label: 'رسائل'
    }
};

export const ActivityCard = ({ activity }) => {
    const { category, description, actor, timestamp } = activity;
    const config = categoryConfig[category] || { icon: Info, color: 'text-muted-foreground bg-muted', label: 'عام' };
    const IconComponent = config.icon;

    return (
        <div className="flex gap-4 p-4 bg-card border border-border/40 rounded-xl hover:shadow-sm transition-shadow">
            {/* Category Icon Badge */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${config.color}`}>
                <IconComponent className="w-5 h-5" />
            </div>

            {/* Description & Actor details */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                        {config.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                        {formatRelativeTime(timestamp)}
                    </span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                    {description}
                </p>
                <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="w-1.5 h-1.5 bg-border rounded-full" />
                    <span>بواسطة:</span>
                    <span className="font-medium text-foreground">{actor || "النظام"}</span>
                </div>
            </div>
        </div>
    );
};

export default ActivityCard;
