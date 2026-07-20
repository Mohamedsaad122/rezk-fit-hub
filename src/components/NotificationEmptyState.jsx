import React from 'react';
import { BellOff } from 'lucide-react';
import { motion } from 'framer-motion';

export const NotificationEmptyState = ({ title = "لا توجد تنبيهات", description = "أنت على اطلاع بكل شيء! لا توجد تنبيهات جديدة في الوقت الحالي." }) => {
    return (
        <motion.div 
            className="flex flex-col items-center justify-center p-8 text-center min-h-[300px] border border-dashed border-border rounded-xl bg-card/30"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
        >
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4 text-muted-foreground shadow-inner">
                <BellOff className="w-8 h-8 opacity-60" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
        </motion.div>
    );
};

export default NotificationEmptyState;
