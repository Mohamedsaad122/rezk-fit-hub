import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Settings, Bell, ChevronLeft } from "lucide-react";
import { NotificationItem } from './NotificationItem';
import { NotificationEmptyState } from './NotificationEmptyState';
import { NotificationSettingsDialog } from './NotificationSettingsDialog';
import { useUnreadNotifications } from '@/hooks/use-notifications';

/**
 * Preview popover dropdown showing latest unread notifications and quick links.
 */
export const NotificationDropdown = ({ onClose }) => {
    const { unreadNotifications, unreadCount, markAllAsRead, isMarkingAllRead } = useUnreadNotifications();
    const [settingsOpen, setSettingsOpen] = useState(false);

    return (
        <div className="w-[320px] sm:w-[360px] md:w-[380px] bg-card border border-border rounded-xl shadow-xl overflow-hidden rtl text-right">
            {/* Header */}
            <div className="p-3 border-b border-border flex items-center justify-between bg-muted/20">
                <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-primary" />
                    <span className="font-bold text-xs text-foreground">التنبيهات الفورية</span>
                    {unreadCount > 0 && (
                        <span className="bg-destructive text-destructive-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                            {unreadCount} جديد
                        </span>
                    )}
                </div>
                {unreadCount > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAllAsRead()}
                        disabled={isMarkingAllRead}
                        className="h-8 px-2 text-[10px] font-bold text-primary hover:text-primary-foreground flex items-center gap-1 shrink-0"
                    >
                        <Check className="w-3 h-3" />
                        تحديد الكل كمقروء
                    </Button>
                )}
            </div>

            {/* List */}
            <ScrollArea className="h-[280px]">
                <div className="p-2 space-y-2">
                    {unreadNotifications.length > 0 ? (
                        unreadNotifications.slice(0, 5).map((notif) => (
                            <div key={notif.id} onClick={onClose}>
                                <NotificationItem
                                    notification={notif}
                                    isCompact={true}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="py-4">
                            <NotificationEmptyState
                                title="لا توجد تنبيهات جديدة"
                                description="لقد قرأت جميع التنبيهات الأخيرة بنجاح!"
                            />
                        </div>
                    )}
                </div>
            </ScrollArea>

            {/* Footer */}
            <div className="p-2 border-t border-border bg-muted/20 flex items-center justify-between gap-2">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSettingsOpen(true)}
                    className="h-8 px-2.5 text-[11px] text-muted-foreground flex items-center gap-1 hover:bg-muted"
                >
                    <Settings className="w-3.5 h-3.5" />
                    الإعدادات
                </Button>

                <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="h-8 px-2.5 text-[11px] text-primary font-bold flex items-center gap-0.5 hover:bg-primary/5"
                >
                    <Link to="/notifications">
                        عرض كل التنبيهات
                        <ChevronLeft className="w-3.5 h-3.5" />
                    </Link>
                </Button>
            </div>

            {/* Settings Dialog */}
            {settingsOpen && (
                <NotificationSettingsDialog
                    open={settingsOpen}
                    onOpenChange={setSettingsOpen}
                />
            )}
        </div>
    );
};

export default NotificationDropdown;
