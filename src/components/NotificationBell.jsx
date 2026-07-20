import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { NotificationDropdown } from './NotificationDropdown';
import { useUnreadNotifications } from '@/hooks/use-notifications';
import { UnreadBadge } from './UnreadBadge';
import { motion } from 'framer-motion';

/**
 * Animated Notification Bell that displays unread badges and opens the notifications dropdown preview.
 */
export const NotificationBell = () => {
    const { unreadCount } = useUnreadNotifications();
    const [open, setOpen] = useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-10 w-10 rounded-xl hover:bg-muted transition-colors focus-visible:ring-1 focus-visible:ring-ring"
                    aria-label="إشعارات النظام"
                >
                    <motion.div
                        animate={unreadCount > 0 ? {
                            rotate: [0, -12, 12, -12, 12, -8, 8, 0],
                        } : {}}
                        transition={{
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 1.5,
                            repeatDelay: 4
                        }}
                    >
                        <Bell className="w-5 h-5 text-foreground" />
                    </motion.div>
                    
                    {/* Glowing animated unread badge */}
                    {unreadCount > 0 && (
                        <UnreadBadge
                            count={unreadCount}
                            className="absolute -top-1 -right-1"
                        />
                    )}
                </Button>
            </PopoverTrigger>
            
            <PopoverContent className="p-0 border-0 shadow-2xl z-50" align="end" sideOffset={8}>
                <NotificationDropdown onClose={() => setOpen(false)} />
            </PopoverContent>
        </Popover>
    );
};

export default NotificationBell;
