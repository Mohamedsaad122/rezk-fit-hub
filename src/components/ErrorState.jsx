import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Reusable error state boundary block.
 * Integrates directly with React Query refetches.
 */
export function ErrorState({ 
    title = "فشل تحميل البيانات", 
    message = "حدث خطأ أثناء محاولة الاتصال بالخادم. يرجى التحقق من اتصال الشبكة.", 
    onRetry 
}) {
    return (
        <motion.div
            className="flex flex-col items-center justify-center min-h-[300px] text-center p-8 bg-destructive/5 border border-destructive/10 rounded-2xl shadow-sm space-y-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
        >
            <div className="p-3 rounded-full bg-destructive/10 text-destructive">
                <AlertTriangle className="w-8 h-8" />
            </div>
            
            <div className="space-y-1">
                <h3 className="text-lg font-bold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground max-w-md leading-relaxed">{message}</p>
            </div>

            {onRetry && (
                <Button
                    onClick={onRetry}
                    variant="outline"
                    className="gap-2 rounded-xl h-10 border-destructive/20 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all font-semibold"
                >
                    <RefreshCw className="w-4 h-4" />
                    <span>إعادة المحاولة</span>
                </Button>
            )}
        </motion.div>
    );
}

export default ErrorState;
