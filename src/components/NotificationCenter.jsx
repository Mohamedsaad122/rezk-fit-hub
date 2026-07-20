import React, { useState } from 'react';
import { useNotifications, useUnreadNotifications } from "@/hooks/use-notifications";
import { useDebounce } from "@/hooks/use-debounce";
import { NotificationFilters } from "./NotificationFilters";
import { NotificationCard } from "./NotificationCard";
import { NotificationEmptyState } from "./NotificationEmptyState";
import { NotificationSettingsDialog } from "./NotificationSettingsDialog";
import { Button } from "@/components/ui/button";
import { Check, Settings } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

export const NotificationCenter = () => {
    // Local filter states
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('All'); // 'All' | 'Unread' | 'Archived'
    const [priority, setPriority] = useState('All'); // 'All' | 'Low' | 'Normal' | 'High' | 'Critical'
    const [sortBy, setSortBy] = useState('Newest'); // 'Newest' | 'Oldest' | 'Priority'

    const [settingsOpen, setSettingsOpen] = useState(false);

    // Debounce search term to avoid excessive re-query requests
    const debouncedSearch = useDebounce(search, 300);

    const {
        data,
        isLoading,
        updateStatus,
        deleteNotification,
    } = useNotifications({
        page,
        limit: 10,
        search: debouncedSearch,
        status,
        priority,
        sortBy
    });

    const { unreadCount, markAllAsRead, isMarkingAllRead } = useUnreadNotifications();

    const notifications = data?.data || [];
    const meta = data?.meta || { page: 1, limit: 10, total: 0, totalPages: 1 };

    // Handler helpers
    const handleSearchChange = (term) => {
        setSearch(term);
        setPage(1);
    };

    const handleStatusChange = (val) => {
        setStatus(val);
        setPage(1);
    };

    const handlePriorityChange = (val) => {
        setPriority(val);
        setPage(1);
    };

    const handleSortByChange = (val) => {
        setSortBy(val);
        setPage(1);
    };

    const handleMarkRead = async (id) => {
        await updateStatus({ id, data: { status: 'Read', readAt: new Date().toISOString() } });
    };

    const handleArchive = async (id) => {
        await updateStatus({ id, data: { status: 'Archived' } });
    };

    const handleRestore = async (id) => {
        await updateStatus({ id, data: { status: 'Unread', readAt: null } });
    };

    const handleDelete = async (id) => {
        await deleteNotification(id);
    };

    const renderSkeletons = () => (
        <div className="space-y-4" data-testid="notification-skeletons">
            {[1, 2, 3].map((idx) => (
                <div key={idx} className="p-4 border border-border rounded-xl bg-card space-y-3">
                    <div className="flex items-center gap-3">
                        <Skeleton className="w-10 h-10 rounded-xl" />
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-3 w-2/3" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="space-y-6 max-w-5xl mx-auto rtl text-right">
            {/* Header controls toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card/20 p-4 rounded-xl border border-border/80">
                <div className="space-y-1">
                    <h2 className="text-xl font-bold text-foreground">المركز الإداري للتنبيهات</h2>
                    <p className="text-sm text-muted-foreground">
                        لديك <span className="text-primary font-bold">{unreadCount}</span> إشعار غير مقروء حالياً.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => markAllAsRead()}
                            disabled={isMarkingAllRead}
                            className="rounded-xl h-9 text-xs font-bold border-2 hover:bg-muted"
                        >
                            <Check className="w-4 h-4 mr-1 text-green-600" />
                            تحديد الكل كمقروء
                        </Button>
                    )}

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSettingsOpen(true)}
                        className="rounded-xl h-9 text-xs font-bold border-2 hover:bg-muted"
                    >
                        <Settings className="w-4 h-4 mr-1" />
                        الإعدادات المتقدمة
                    </Button>
                </div>
            </div>

            {/* Filters Bar */}
            <NotificationFilters
                search={search}
                onSearchChange={handleSearchChange}
                status={status}
                onStatusChange={handleStatusChange}
                priority={priority}
                onPriorityChange={handlePriorityChange}
                sortBy={sortBy}
                onSortByChange={handleSortByChange}
            />

            {/* Notifications List */}
            {isLoading ? (
                renderSkeletons()
            ) : notifications.length > 0 ? (
                <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                        {notifications.map((notif, idx) => (
                            <motion.div
                                key={notif.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.25, delay: idx * 0.03 }}
                            >
                                <NotificationCard
                                    notification={notif}
                                    onMarkRead={handleMarkRead}
                                    onArchive={handleArchive}
                                    onRestore={handleRestore}
                                    onDelete={handleDelete}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <NotificationEmptyState
                    title={status === 'Archived' ? "الأرشيف فارغ" : "لا توجد تنبيهات"}
                    description={
                        search 
                            ? "لم نجد أي تنبيهات تطابق كلمة البحث المدخلة." 
                            : "لا توجد تنبيهات في هذه القائمة حالياً."
                    }
                />
            )}

            {/* Pagination Controls */}
            {meta.totalPages > 1 && !isLoading && (
                <div className="flex items-center justify-between border-t border-muted/50 pt-6 mt-8 flex-col sm:flex-row gap-4">
                    <div className="text-sm text-muted-foreground">
                        عرض {notifications.length} من أصل {meta.total} تنبيه
                        (صفحة {meta.page} من {meta.totalPages})
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={meta.page <= 1}
                            className="rounded-xl border-2"
                            aria-label="الصفحة السابقة"
                        >
                            السابق
                        </Button>
                        <span className="text-sm font-semibold px-4 py-2 bg-muted/50 rounded-xl" aria-current="page">
                            {meta.page} / {meta.totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                            disabled={meta.page >= meta.totalPages}
                            className="rounded-xl border-2"
                            aria-label="الصفحة التالية"
                        >
                            التالي
                        </Button>
                    </div>
                </div>
            )}

            {/* Settings Dialog Portal */}
            {settingsOpen && (
                <NotificationSettingsDialog
                    open={settingsOpen}
                    onOpenChange={setSettingsOpen}
                />
            )}
        </div>
    );
};

export default NotificationCenter;
