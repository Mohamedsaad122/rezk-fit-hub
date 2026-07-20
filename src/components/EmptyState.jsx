import { motion } from 'framer-motion';

/**
 * Reusable empty state presenter.
 */
export function EmptyState({ 
    icon = "🔍", 
    title = "لا توجد نتائج", 
    description = "جرب تغيير مصطلح البحث أو تعديل الفلاتر المعينة." 
}) {
    return (
        <motion.div
            className="text-center py-12 px-6 flex flex-col items-center justify-center bg-card/30 border border-dashed border-border rounded-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="text-6xl mb-4 select-none">{icon}</div>
            <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">{description}</p>
        </motion.div>
    );
}

export default EmptyState;
