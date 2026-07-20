import React from 'react';
import { useEntityTimeline } from '../hooks/use-collaboration';
import { Clock, User, Tag } from 'lucide-react';

export const ActivityTimeline = ({ entityType, entityId, activities: propActivities, isLoading: propIsLoading }) => {
    const { timeline: queryTimeline, isLoading: queryIsLoading } = useEntityTimeline(entityType, entityId);
    
    const timeline = propActivities !== undefined ? propActivities : (queryTimeline || []);
    const isLoading = propIsLoading !== undefined ? propIsLoading : queryIsLoading;

    if (isLoading) {
        return <div className="text-center py-4 text-xs text-zinc-400">جاري تحميل سجل النشاطات...</div>;
    }

    if (timeline.length === 0) {
        return (
            <div className="text-center py-6 text-xs text-zinc-400 border border-dashed border-border rounded-xl">
                لا توجد نشاطات مسجلة لهذا العنصر.
            </div>
        );
    }

    return (
        <div className="relative border-r-2 border-border pr-4 mr-2 space-y-6 text-right">
            {timeline.map((act) => (
                <div key={act.id} className="relative animate-in fade-in slide-in-from-right-2 duration-300">
                    {/* Timeline dot */}
                    <span className="absolute -right-[23px] top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-background border-2 border-primary" />
                    
                    <div className="bg-card border border-border/80 rounded-xl p-3 shadow-sm hover:shadow-md transition">
                        <div className="flex items-center justify-between mb-1.5 flex-row-reverse">
                            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Tag className="w-3 h-3" />
                                {act.category}
                            </span>
                            <span className="text-[10px] text-zinc-400 flex items-center gap-1 flex-row-reverse">
                                <Clock className="w-3 h-3" />
                                {new Date(act.timestamp).toLocaleDateString('ar-EG')} {new Date(act.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                        <p className="text-sm text-foreground mb-2 leading-relaxed">
                            {act.description}
                        </p>
                        <div className="flex items-center gap-1 text-[11px] text-zinc-400 justify-end">
                            <span>بواسطة: <strong>{act.actor}</strong></span>
                            <User className="w-3 h-3 text-zinc-400" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ActivityTimeline;
