import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { NotificationItem } from './NotificationItem';

/**
 * Reusable wrapper component for individual notifications matching the design guidelines.
 */
export const NotificationCard = ({
    notification,
    onMarkRead,
    onArchive,
    onRestore,
    onDelete,
    isCompact = false
}) => {
    return (
        <Card className="border-0 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-0">
                <NotificationItem
                    notification={notification}
                    onMarkRead={onMarkRead}
                    onArchive={onArchive}
                    onRestore={onRestore}
                    onDelete={onDelete}
                    isCompact={isCompact}
                />
            </CardContent>
        </Card>
    );
};

export default NotificationCard;
