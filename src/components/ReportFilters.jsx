import React from 'react';

export const ReportFilters = ({ module, filters, onChange }) => {
    const handleFilterChange = (key, value) => {
        onChange({
            ...filters,
            [key]: value === 'All' ? undefined : value
        });
    };

    switch (module) {
        case 'Clients':
            return (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" dir="rtl">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-muted-foreground block">حالة الاشتراك</label>
                        <select
                            value={filters.subscriptionStatus || 'All'}
                            onChange={(e) => handleFilterChange('subscriptionStatus', e.target.value)}
                            className="w-full p-2 rounded-md border border-input bg-background text-sm"
                        >
                            <option value="All">الكل</option>
                            <option value="نشط">نشط</option>
                            <option value="معلق">معلق</option>
                            <option value="منتهي">منتهي</option>
                        </select>
                    </div>
                </div>
            );

        case 'Calendar':
            return (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" dir="rtl">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-muted-foreground block">حالة الموعد</label>
                        <select
                            value={filters.status || 'All'}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="w-full p-2 rounded-md border border-input bg-background text-sm"
                        >
                            <option value="All">الكل</option>
                            <option value="جديد">جديد</option>
                            <option value="مؤكد">مؤكد</option>
                            <option value="ملغي">ملغي</option>
                        </select>
                    </div>
                </div>
            );

        case 'Tasks':
            return (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" dir="rtl">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-muted-foreground block">الأولوية</label>
                        <select
                            value={filters.priority || 'All'}
                            onChange={(e) => handleFilterChange('priority', e.target.value)}
                            className="w-full p-2 rounded-md border border-input bg-background text-sm"
                        >
                            <option value="All">الكل</option>
                            <option value="High">مرتفعة</option>
                            <option value="Medium">متوسطة</option>
                            <option value="Low">منخفضة</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-muted-foreground block">حالة المهمة</label>
                        <select
                            value={filters.status || 'All'}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="w-full p-2 rounded-md border border-input bg-background text-sm"
                        >
                            <option value="All">الكل</option>
                            <option value="Todo">قيد الانتظار</option>
                            <option value="InProgress">قيد التنفيذ</option>
                            <option value="Completed">مكتملة</option>
                        </select>
                    </div>
                </div>
            );

        case 'Nutrition':
            return (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" dir="rtl">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-muted-foreground block">الحد الأقصى للسعرات الحرارية</label>
                        <input
                            type="number"
                            value={filters.caloriesMax || ''}
                            onChange={(e) => handleFilterChange('caloriesMax', e.target.value || undefined)}
                            placeholder="مثال: 3000"
                            className="w-full p-2 rounded-md border border-input bg-background text-sm"
                        />
                    </div>
                </div>
            );

        case 'Exercises':
            return (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" dir="rtl">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-muted-foreground block">فئة التمرين</label>
                        <select
                            value={filters.category || 'All'}
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                            className="w-full p-2 rounded-md border border-input bg-background text-sm"
                        >
                            <option value="All">الكل</option>
                            <option value="صدر">صدر</option>
                            <option value="ظهر">ظهر</option>
                            <option value="أرجل">أرجل</option>
                            <option value="لياقة">لياقة</option>
                        </select>
                    </div>
                </div>
            );

        case 'Audit Logs':
            return (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" dir="rtl">
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-muted-foreground block">نوع العملية</label>
                        <select
                            value={filters.status || 'All'}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="w-full p-2 rounded-md border border-input bg-background text-sm"
                        >
                            <option value="All">الكل</option>
                            <option value="Success">ناجحة (Success)</option>
                            <option value="Failed">فاشلة (Failed)</option>
                        </select>
                    </div>
                </div>
            );

        default:
            return (
                <div className="text-xs text-muted-foreground py-2 text-right">
                    لا تتوفر فلاتر مخصصة لهذا القسم حالياً.
                </div>
            );
    }
};

export default ReportFilters;
