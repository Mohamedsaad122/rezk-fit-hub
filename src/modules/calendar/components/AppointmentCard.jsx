import React from 'react';
import { Card } from '@/components/ui/card';
import { Clock, User, Eye, Copy, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AppointmentStatusBadge from './AppointmentStatusBadge';

const EVENT_TYPE_TRANSLATIONS = {
    "Workout Session": "جلسة تدريبية",
    "Nutrition Consultation": "استشارة تغذية",
    "Assessment": "تقييم أداء",
    "Follow-up": "متابعة دورية",
    "Meeting": "اجتماع عمل",
    "Personal Training": "تدريب شخصي"
};

const EVENT_TYPE_COLORS = {
    "Workout Session": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    "Nutrition Consultation": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    "Assessment": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    "Follow-up": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    "Meeting": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    "Personal Training": "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
};

export function AppointmentCard({ appointment, onInspect, onEdit, onDelete, onDuplicate }) {
    const typeLabel = EVENT_TYPE_TRANSLATIONS[appointment.type] || appointment.type;
    const typeColorClass = EVENT_TYPE_COLORS[appointment.type] || "bg-gray-100 text-gray-800";
    const isLocked = appointment.lock?.isLocked;

    const handleActionClick = (e, callback) => {
        e.preventDefault();
        e.stopPropagation();
        callback(appointment);
    };

    return (
        <Card className="hover-lift border border-border shadow-sm p-4 relative overflow-hidden bg-card/60 backdrop-blur-sm">
            <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-primary"></div>
            <div className="flex justify-between items-start gap-4">
                <div className="space-y-2 flex-grow">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${typeColorClass}`}>
                            {typeLabel}
                        </span>
                        <AppointmentStatusBadge status={appointment.status} />
                        {isLocked && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                                🔒 قيد التعديل بواسطة {appointment.lock.lockedBy}
                            </span>
                        )}
                    </div>
                    
                    <h4 className="font-bold text-foreground text-base leading-snug">{appointment.title}</h4>
                    
                    {appointment.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{appointment.description}</p>
                    )}
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground pt-1">
                        <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-primary" />
                            <span>{appointment.startTime} - {appointment.endTime} ({appointment.duration} دقيقة)</span>
                        </div>
                        {appointment.clientId && (
                            <div className="flex items-center gap-1">
                                <User className="w-3.5 h-3.5 text-purple-500" />
                                <span>المتدرب: #{appointment.clientId}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-1.5 shrink-0 justify-start">
                    <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={(e) => handleActionClick(e, onInspect)}
                        className="h-8 w-8 hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                        title="تفاصيل"
                    >
                        <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={(e) => handleActionClick(e, onDuplicate)}
                        className="h-8 w-8 hover:bg-muted/80 text-muted-foreground hover:text-primary"
                        title="تكرار"
                    >
                        <Copy className="w-4 h-4" />
                    </Button>
                    <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={(e) => !isLocked && handleActionClick(e, onEdit)}
                        disabled={isLocked}
                        className={`h-8 w-8 hover:bg-muted/80 text-muted-foreground hover:text-primary ${isLocked ? 'opacity-40 cursor-not-allowed' : ''}`}
                        title="تعديل / إعادة جدولة"
                    >
                        <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={(e) => handleActionClick(e, onDelete)}
                        className="h-8 w-8 hover:bg-destructive/10 text-destructive hover:text-destructive-foreground"
                        title="إلغاء وحذف"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </Card>
    );
}

export default AppointmentCard;
