export const formatRelativeTime = (timestamp) => {
    if (!timestamp) return '';
    try {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'الآن';
        if (diffMins < 60) {
            if (diffMins === 1) return 'منذ دقيقة';
            if (diffMins === 2) return 'منذ دقيقتين';
            if (diffMins <= 10) return `منذ ${diffMins} دقائق`;
            return `منذ ${diffMins} دقيقة`;
        }
        if (diffHours < 24) {
            if (diffHours === 1) return 'منذ ساعة';
            if (diffHours === 2) return 'منذ ساعتين';
            if (diffHours <= 10) return `منذ ${diffHours} ساعات`;
            return `منذ ${diffHours} ساعة`;
        }
        if (diffDays === 1) return 'أمس';
        if (diffDays === 2) return 'منذ يومين';
        if (diffDays <= 10) return `منذ ${diffDays} أيام`;
        return new Intl.DateTimeFormat('ar', { month: 'short', day: 'numeric' }).format(date);
    } catch {
        return '';
    }
};

export default formatRelativeTime;
