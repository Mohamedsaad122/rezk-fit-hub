import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown, CheckSquare, Trash } from "lucide-react";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const STATUS_TABS = [
    { value: 'All', label: 'الكل' },
    { value: 'Todo', label: 'لم تبدأ' },
    { value: 'In Progress', label: 'قيد التنفيذ' },
    { value: 'Completed', label: 'مكتملة' },
    { value: 'Cancelled', label: 'ملغاة' },
    { value: 'Overdue', label: 'متأخرة' }
];

const CATEGORIES = [
    { value: 'All', label: 'كل التصنيفات' },
    { value: 'Workout', label: 'برنامج رياضي' },
    { value: 'Nutrition', label: 'برنامج غذائي' },
    { value: 'Assessment', label: 'تقييم بدني' },
    { value: 'Consultation', label: 'استشارة' },
    { value: 'Follow Up', label: 'متابعة دورية' },
    { value: 'Phone Call', label: 'مكالمة هاتفية' },
    { value: 'Meeting', label: 'اجتماع عمل' },
    { value: 'Administrative', label: 'عمل إداري' },
    { value: 'Reminder', label: 'تذكير' }
];

const PRIORITIES = [
    { value: 'All', label: 'كل الأولويات' },
    { value: 'Low', label: 'منخفضة' },
    { value: 'Medium', label: 'متوسطة' },
    { value: 'High', label: 'عالية' },
    { value: 'Critical', label: 'عاجلة جداً' }
];

const SORTS = [
    { value: 'Newest', label: 'الأحدث أولاً' },
    { value: 'Oldest', label: 'الأقدم أولاً' },
    { value: 'Due Date', label: 'تاريخ الاستحقاق' },
    { value: 'Priority', label: 'حسب الأولوية' }
];

export const TaskFilters = ({
    search,
    onSearchChange,
    status,
    onStatusChange,
    priority,
    onPriorityChange,
    category,
    onCategoryChange,
    sortBy,
    onSortByChange,
    selectedCount = 0,
    onBulkComplete,
    onBulkDelete
}) => {
    return (
        <div className="space-y-4 bg-card p-4 rounded-xl border border-border/80 shadow-sm">
            {/* Status Tabs & Bulk actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/60">
                <div className="flex flex-wrap gap-1">
                    {STATUS_TABS.map(tab => (
                        <button
                            key={tab.value}
                            onClick={() => onStatusChange(tab.value)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                status === tab.value
                                    ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                                    : 'text-muted-foreground hover:bg-muted/80'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Bulk Actions Menu */}
                {selectedCount > 0 && (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                        <span className="text-xs text-muted-foreground">تم تحديد ({selectedCount}) مهام:</span>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="secondary" size="sm" className="h-8 text-xs gap-1 border border-border">
                                    <span>عمليات جماعية</span>
                                    <ChevronDown className="w-3.5 h-3.5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rtl text-right">
                                <DropdownMenuItem onClick={onBulkComplete} className="text-emerald-600 gap-2 cursor-pointer">
                                    <CheckSquare className="w-4 h-4" />
                                    <span>تحديد كمكتملة</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={onBulkDelete} className="text-destructive gap-2 cursor-pointer">
                                    <Trash className="w-4 h-4" />
                                    <span>حذف المهام المحددة</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}
            </div>

            {/* Inputs & Selects Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="البحث عن مهمة..."
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pr-9 pl-3 h-10 border-border text-sm"
                    />
                </div>

                {/* Category Select */}
                <div>
                    <select
                        value={category}
                        onChange={(e) => onCategoryChange(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        {CATEGORIES.map(cat => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                    </select>
                </div>

                {/* Priority Select */}
                <div>
                    <select
                        value={priority}
                        onChange={(e) => onPriorityChange(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        {PRIORITIES.map(pri => (
                            <option key={pri.value} value={pri.value}>{pri.label}</option>
                        ))}
                    </select>
                </div>

                {/* Sort By Select */}
                <div>
                    <select
                        value={sortBy}
                        onChange={(e) => onSortByChange(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        {SORTS.map(sort => (
                            <option key={sort.value} value={sort.value}>{sort.label}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default TaskFilters;
