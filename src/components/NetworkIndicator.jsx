import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff } from 'lucide-react';
import { useNetworkStore } from '@/store/network.store';

export const NetworkIndicator = () => {
    const { isOffline, activeRequests } = useNetworkStore();

    return (
        <div className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none select-none">
            {/* Global Top Loading Bar */}
            <AnimatePresence>
                {activeRequests > 0 && (
                    <motion.div
                        className="h-1 bg-gradient-primary w-full origin-left"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 0.7 }}
                        exit={{ scaleX: 1, opacity: 0 }}
                        transition={{ 
                            scaleX: { duration: 1.5, ease: 'easeOut' },
                            opacity: { duration: 0.3 }
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Offline Alert Dialog Banner */}
            <AnimatePresence>
                {isOffline && (
                    <motion.div
                        className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 pointer-events-auto"
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    >
                        <div className="bg-destructive/15 border border-destructive/25 backdrop-blur-md text-destructive p-4 rounded-xl flex items-center gap-3 shadow-xl max-w-sm rtl text-right" dir="rtl">
                            <div className="p-2 bg-destructive/10 rounded-lg shrink-0">
                                <WifiOff className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-sm">أنت غير متصل بالإنترنت</h4>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    يرجى التحقق من اتصال الشبكة الخاص بك. قد لا يتم حفظ التعديلات الجديدة.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NetworkIndicator;
