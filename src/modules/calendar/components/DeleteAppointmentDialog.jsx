import React from 'react';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction
} from '@/components/ui/alert-dialog';
import { useDeleteCalendarEvent } from '../hooks/use-calendar';

export function DeleteAppointmentDialog({ isOpen, onClose, appointment }) {
    const { mutate: deleteEvent, isPending } = useDeleteCalendarEvent();

    if (!appointment) return null;

    const handleConfirm = () => {
        deleteEvent(appointment.id, {
            onSuccess: () => onClose()
        });
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <AlertDialogContent className="rtl text-right font-sans rounded-2xl border-0 shadow-lg">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-bold text-destructive">
                        إلغاء وحذف الموعد
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground text-xs leading-relaxed">
                        هل أنت متأكد من رغبتك في إلغاء وحذف الموعد <strong>«{appointment.title}»</strong>؟ هذا الإجراء لا يمكن التراجع عنه وسيقوم بإزالة الموعد بالكامل من جدول التقويم.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex flex-row-reverse gap-2 justify-start pt-3 border-t">
                    <AlertDialogCancel 
                        onClick={onClose} 
                        className="rounded-xl mt-0"
                        disabled={isPending}
                    >
                        تراجع
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        className="bg-destructive hover:bg-destructive/90 text-white rounded-xl font-semibold"
                        disabled={isPending}
                    >
                        {isPending ? 'جاري الإلغاء...' : 'تأكيد الحذف والإلغاء'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default DeleteAppointmentDialog;
