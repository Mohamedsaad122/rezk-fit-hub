import React from 'react';
import { motion } from 'framer-motion';
import { Wrench, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNetworkStore } from '@/store/network.store';

export const MaintenanceMode = () => {
    const { setMaintenance } = useNetworkStore();

    const handleRetry = () => {
        setMaintenance(false);
        window.location.reload();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-6 rtl text-right" dir="rtl">
            <motion.div
                className="max-w-md w-full"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <Card className="bg-gradient-card border-0 shadow-2xl text-center p-8">
                    <CardContent className="space-y-6">
                        {/* Wrench Maintenance Icon */}
                        <motion.div
                            className="flex justify-center"
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                        >
                            <div className="p-4 bg-primary/10 rounded-full text-primary">
                                <Wrench className="w-16 h-16" />
                            </div>
                        </motion.div>

                        <div className="space-y-3">
                            <h1 className="text-2xl font-extrabold text-foreground">النظام قيد الصيانة المؤقتة</h1>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                نقوم حالياً بإجراء بعض التحديثات لتحسين أداء النظام وتوفير تجربة أفضل. 
                                سنعود للعمل بكامل طاقتنا في أقرب وقت ممكن. شكراً لتفهمك!
                            </p>
                        </div>

                        <Button
                            onClick={handleRetry}
                            className="w-full bg-gradient-primary hover:opacity-90 text-white rounded-xl shadow-lg gap-2 py-6"
                        >
                            <RefreshCw className="w-4 h-4 animate-spin-hover" />
                            إعادة المحاولة والتحقق من الاتصال
                        </Button>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default MaintenanceMode;
