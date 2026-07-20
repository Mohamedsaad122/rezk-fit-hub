import React from 'react';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';
import NotificationCenter from '@/components/NotificationCenter';

export default function Notifications() {
    return (
        <div className="min-h-full bg-gradient-to-br from-background via-muted/20 to-background pt-28 pb-12 px-4 sm:px-6">
            {/* Page Title & Headings */}
            <SEO title="التنبيهات والإشعارات" />

            <div className="max-w-5xl mx-auto space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-right"
                >
                    <h1 className="text-3xl font-extrabold text-foreground">مركز التنبيهات</h1>
                    <p className="text-muted-foreground mt-1">إدارة ومتابعة جميع إشعارات وتنبيهات النظام والنشاطات الرياضية.</p>
                </motion.div>

                {/* Centralized Notifications Component */}
                <NotificationCenter />
            </div>
        </div>
    );
}
