import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useClients } from '@/hooks/use-clients';
import { User, Calendar, Tag, Shield, BookOpen } from 'lucide-react';
import AppointmentStatusBadge from './AppointmentStatusBadge';
import { useDocuments } from '@/hooks/use-documents';
import { getFileIcon } from '@/utils/file-utils';
import { downloadFile } from '@/utils/download-utils';
import { CommentEngine } from '@/components/CommentEngine';
import { ActivityTimeline } from '@/components/ActivityTimeline';

const EVENT_TYPE_TRANSLATIONS = {
    "Workout Session": "جلسة تدريبية",
    "Nutrition Consultation": "استشارة تغذية",
    "Assessment": "تقييم أداء",
    "Follow-up": "متابعة دورية",
    "Meeting": "اجتماع عمل",
    "Personal Training": "تدريب شخصي"
};

export function AppointmentDetailsDialog({ isOpen, onClose, appointment }) {
    const { data: clientsRes } = useClients();
    const clients = clientsRes?.data || [];
    
    // Retrieve documents assigned to this appointment
    const { data: attachments = [] } = useDocuments(
        appointment ? { appointmentId: appointment.id } : { enabled: false }
    );

    if (!appointment) return null;

    const matchedClient = clients.find(c => String(c.id) === String(appointment.clientId));
    const clientName = matchedClient ? matchedClient.name : `متدرب رقم #${appointment.clientId}`;
    const typeLabel = EVENT_TYPE_TRANSLATIONS[appointment.type] || appointment.type;

    const formatISO = (isoStr) => {
        if (!isoStr) return '—';
        try {
            return new Date(isoStr).toLocaleString('ar-EG', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return isoStr;
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="rtl text-right max-w-md font-sans rounded-2xl border-0 shadow-lg">
                <DialogHeader className="border-b pb-3">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <Tag className="w-5 h-5 text-primary" />
                        <span>تفاصيل الموعد</span>
                    </DialogTitle>
                </DialogHeader>

                <div className="py-4 space-y-4 text-sm">
                    {/* Header Info */}
                    <div className="space-y-1">
                        <h3 className="font-bold text-lg text-foreground leading-snug">{appointment.title}</h3>
                        {appointment.description && (
                            <p className="text-muted-foreground text-xs leading-relaxed">{appointment.description}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-y py-3">
                        <div className="space-y-1">
                            <span className="text-[10px] text-muted-foreground block">الحالة</span>
                            <AppointmentStatusBadge status={appointment.status} />
                        </div>
                        <div className="space-y-1">
                            <span className="text-[10px] text-muted-foreground block">نوع الجلسة</span>
                            <span className="font-semibold text-foreground text-xs">{typeLabel}</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {/* Date/Time */}
                        <div className="flex items-center gap-3 bg-muted/40 p-2.5 rounded-xl">
                            <Calendar className="w-4 h-4 text-primary shrink-0" />
                            <div className="space-y-0.5">
                                <span className="text-[10px] text-muted-foreground block">تاريخ ووقت الموعد</span>
                                <span className="font-bold text-foreground text-xs">
                                    {appointment.date} @ {appointment.startTime} - {appointment.endTime} ({appointment.duration} دقيقة)
                                </span>
                            </div>
                        </div>

                        {/* Client details */}
                        {appointment.clientId && (
                            <div className="flex items-center gap-3 bg-muted/40 p-2.5 rounded-xl">
                                <User className="w-4 h-4 text-purple-500 shrink-0" />
                                <div className="space-y-0.5">
                                    <span className="text-[10px] text-muted-foreground block">المتدرب المخصص</span>
                                    <span className="font-bold text-foreground text-xs">{clientName}</span>
                                </div>
                            </div>
                        )}

                        {/* Coach/Creator */}
                        <div className="flex items-center gap-3 bg-muted/40 p-2.5 rounded-xl">
                            <Shield className="w-4 h-4 text-green-500 shrink-0" />
                            <div className="space-y-0.5">
                                <span className="text-[10px] text-muted-foreground block">المدرب المسؤول</span>
                                <span className="font-bold text-foreground text-xs">مدرب رقم #{appointment.coachId}</span>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-1.5 p-3 bg-primary/5 rounded-xl border border-primary/10">
                        <span className="text-xs text-primary font-bold flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>ملاحظات الحصة التدريبية</span>
                        </span>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            {appointment.notes || 'لا توجد ملاحظات إضافية مسجلة.'}
                        </p>
                    </div>

                    {/* Referenced files / Attachments */}
                    {attachments.length > 0 && (
                        <div className="space-y-2 p-3 bg-muted/40 rounded-xl border border-border/60">
                            <span className="text-xs font-bold text-foreground flex items-center gap-1">
                                📎 <span>الملفات والمستندات المرفقة ({attachments.length})</span>
                            </span>
                            <div className="space-y-1.5">
                                {attachments.map(file => (
                                    <div key={file.id} className="flex justify-between items-center bg-card border px-2.5 py-1.5 rounded-lg text-xs">
                                        <span className="truncate max-w-[220px] font-medium" title={file.name}>
                                            {getFileIcon(file.extension)} {file.name}
                                        </span>
                                        <Button 
                                            size="sm" 
                                            variant="ghost" 
                                            className="text-primary hover:bg-primary/5 h-7 px-2 text-[10px]"
                                            onClick={() => downloadFile(file)}
                                        >
                                            تحميل
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Sprint 4.4 Collaboration Section */}
                    <div className="border-t border-border pt-4 space-y-4">
                        <h4 className="text-xs font-semibold text-foreground flex items-center gap-1">
                            💬 <span>النقاش والتعليقات المتبادلة</span>
                        </h4>
                        <CommentEngine entityType="Appointment" entityId={appointment.id} />
                    </div>

                    <div className="border-t border-border pt-4">
                        <h4 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1">
                            🕒 <span>سجل النشاطات الفورية للموعد</span>
                        </h4>
                        <ActivityTimeline entityType="Appointment" entityId={appointment.id} />
                    </div>

                    {/* Audit logs */}
                    <div className="border-t pt-3 space-y-1 text-[10px] text-muted-foreground">
                        <div className="flex justify-between">
                            <span>أنشئ بواسطة: {appointment.createdBy || 'المدرب'}</span>
                            <span>تاريخ الإنشاء: {formatISO(appointment.createdAt)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>آخر تعديل بواسطة: {appointment.updatedBy || 'المدرب'}</span>
                            <span>آخر تحديث: {formatISO(appointment.updatedAt)}</span>
                        </div>
                    </div>
                </div>

                <DialogFooter className="border-t pt-3">
                    <Button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl w-full"
                    >
                        إغلاق النافذة
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default AppointmentDetailsDialog;
