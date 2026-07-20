import React from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function DeleteTaskDialog({ open, onOpenChange, onConfirm, taskTitle }) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="rtl text-right">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-lg font-bold text-foreground">هل أنت متأكد من الحذف؟</AlertDialogTitle>
                    <AlertDialogDescription className="text-sm text-muted-foreground">
                        أنت على وشك حذف المهمة <strong className="text-foreground font-bold">&quot;{taskTitle}&quot;</strong>.
                        هذا الإجراء نهائي ولا يمكن التراجع عنه بعد إتمامه.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex justify-end gap-2 border-t border-border pt-4 mt-2">
                    <AlertDialogAction 
                        onClick={onConfirm}
                        className="bg-destructive hover:bg-destructive/90 text-destructive-foreground text-xs h-9 px-4 rounded-lg"
                    >
                        تأكيد الحذف
                    </AlertDialogAction>
                    <AlertDialogCancel 
                        onClick={() => onOpenChange(false)}
                        className="text-xs h-9 px-4 rounded-lg border border-border bg-background"
                    >
                        إلغاء
                    </AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default DeleteTaskDialog;
