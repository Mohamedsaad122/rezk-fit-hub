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
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export function ConfirmDeleteDialog({
    isOpen,
    onClose,
    onConfirm,
    title = 'تأكيد الحذف',
    description = 'هل أنت متأكد من رغبتك في حذف هذا المورد؟ لا يمكن التراجع عن هذا الإجراء.',
    isPending = false
}) {
    return (
        <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <AlertDialogContent className="rtl text-right max-w-md font-sans">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl font-bold text-destructive flex items-center gap-2">
                        <span>⚠️</span>
                        <span>{title}</span>
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-sm text-muted-foreground mt-2 leading-relaxed">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                
                <AlertDialogFooter className="flex flex-row-reverse gap-2 justify-start mt-6">
                    <AlertDialogCancel asChild>
                        <Button 
                            variant="outline" 
                            onClick={onClose} 
                            disabled={isPending}
                            className="rounded-xl mt-0"
                        >
                            إلغاء
                        </Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button
                            variant="destructive"
                            onClick={(e) => {
                                e.preventDefault();
                                onConfirm();
                            }}
                            disabled={isPending}
                            className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 flex items-center gap-2"
                        >
                            {isPending && <LoadingSpinner className="w-4 h-4 text-white" />}
                            <span>{isPending ? 'جاري الحذف...' : 'تأكيد الحذف'}</span>
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default ConfirmDeleteDialog;
