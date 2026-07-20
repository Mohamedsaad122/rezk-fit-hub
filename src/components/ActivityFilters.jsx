import React from 'react';
import { Search } from 'lucide-react';

export const ActivityFilters = ({
    searchQuery,
    onSearchChange,
    selectedCategory,
    onCategoryChange,
    selectedTimeframe,
    onTimeframeChange
}) => {
    const categories = [
        { key: 'All', label: 'الكل' },
        { key: 'Client', label: 'المتدربين' },
        { key: 'Workout', label: 'التمارين' },
        { key: 'Nutrition', label: 'التغذية' },
        { key: 'Appointment', label: 'المواعيد' },
        { key: 'Task', label: 'المهام' }
    ];

    const timeframes = [
        { key: 'All', label: 'كل الأوقات' },
        { key: 'Today', label: 'اليوم' },
        { key: 'Yesterday', label: 'أمس' },
        { key: 'Week', label: 'هذا الأسبوع' },
        { key: 'Month', label: 'هذا الشهر' }
    ];

    return (
        <div className="bg-card border border-border/40 rounded-xl p-4 space-y-4 shadow-sm">
            {/* Search and timeframe dropdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="relative md:col-span-2">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="ابحث في سجل النشاطات..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full pl-3 pr-9 py-2 bg-muted/50 rounded-lg text-sm text-foreground placeholder:text-muted-foreground border border-border/40 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                </div>
                
                <div>
                    <select
                        value={selectedTimeframe}
                        onChange={(e) => onTimeframeChange(e.target.value)}
                        className="w-full px-3 py-2 bg-muted/50 rounded-lg text-sm text-foreground border border-border/40 focus:outline-none focus:border-primary/50 transition-colors cursor-pointer"
                        aria-label="تصفية الفترة الزمنية"
                    >
                        {timeframes.map((tf) => (
                            <option key={tf.key} value={tf.key}>
                                {tf.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Category horizontal scrolling bar */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {categories.map((cat) => (
                    <button
                        key={cat.key}
                        onClick={() => onCategoryChange(cat.key)}
                        className={`text-xs font-semibold px-3.5 py-1.5 rounded-full transition-colors shrink-0 ${
                            selectedCategory === cat.key
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'bg-muted text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ActivityFilters;
