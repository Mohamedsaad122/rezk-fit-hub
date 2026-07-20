import React from 'react';

const LEGEND_ITEMS = [
    { label: "جلسة تدريبية (Workout)", color: "bg-blue-500 text-blue-500" },
    { label: "استشارة تغذية (Nutrition)", color: "bg-green-500 text-green-500" },
    { label: "تقييم أداء (Assessment)", color: "bg-purple-500 text-purple-500" },
    { label: "متابعة دورية (Follow-up)", color: "bg-yellow-500 text-yellow-500" },
    { label: "اجتماع عمل (Meeting)", color: "bg-red-500 text-red-500" },
    { label: "تدريب شخصي (Personal)", color: "bg-orange-500 text-orange-500" }
];

export function CalendarLegend() {
    return (
        <div className="border border-border/80 rounded-2xl p-4 bg-card/60 backdrop-blur-sm space-y-3 rtl text-right">
            <h4 className="font-bold text-xs text-foreground">دليل الألوان</h4>
            <div className="space-y-2">
                {LEGEND_ITEMS.map((item) => (
                    <div key={item.label} className="flex items-center gap-2 text-xs">
                        <span className={`w-3 h-3 rounded-full shrink-0 ${item.color.split(' ')[0]}`} />
                        <span className="text-muted-foreground">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CalendarLegend;
