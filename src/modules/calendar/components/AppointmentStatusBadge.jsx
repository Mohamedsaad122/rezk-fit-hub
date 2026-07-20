import React from 'react';
import { Badge } from '@/components/ui/badge';

const STATUS_TRANSLATIONS = {
    "Scheduled": "مجدولة",
    "Completed": "مكتملة",
    "Cancelled": "ملغاة",
    "Missed": "فائتة",
    "In Progress": "جاري العمل"
};

const STATUS_VARIANTS = {
    "Scheduled": "secondary",
    "Completed": "success",
    "Cancelled": "destructive",
    "Missed": "outline",
    "In Progress": "default"
};

export function AppointmentStatusBadge({ status }) {
    const label = STATUS_TRANSLATIONS[status] || status;
    const variant = STATUS_VARIANTS[status] || "default";

    return (
        <Badge variant={variant} className="text-xs font-semibold px-2 py-0.5">
            {label}
        </Badge>
    );
}

export default AppointmentStatusBadge;
