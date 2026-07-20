import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, ArrowUpDown } from "lucide-react";

export const NotificationFilters = ({
    search,
    onSearchChange,
    status,
    onStatusChange,
    priority,
    onPriorityChange,
    sortBy,
    onSortByChange
}) => {
    return (
        <div className="space-y-4 bg-card/40 backdrop-blur-md p-4 rounded-xl border border-border/80 shadow-sm">
            {/* Top row: Tab Switcher (All / Unread / Archived) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <Tabs value={status} onValueChange={onStatusChange} className="w-full md:w-auto">
                    <TabsList className="grid grid-cols-3 w-full md:w-[320px]">
                        <TabsTrigger value="All" className="text-xs sm:text-sm">الكل</TabsTrigger>
                        <TabsTrigger value="Unread" className="text-xs sm:text-sm">غير مقروء</TabsTrigger>
                        <TabsTrigger value="Archived" className="text-xs sm:text-sm font-normal">المؤرشفة</TabsTrigger>
                    </TabsList>
                </Tabs>

                {/* Filters controls */}
                <div className="flex flex-wrap items-center gap-3">
                    {/* Priority Filter */}
                    <div className="flex items-center gap-2 min-w-[130px] flex-1 md:flex-initial">
                        <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
                        <Select value={priority} onValueChange={onPriorityChange}>
                            <SelectTrigger className="h-9" aria-label="Priority filter dropdown selection">
                                <SelectValue placeholder="الأولوية" />
                            </SelectTrigger>
                            <SelectContent className="rtl text-right">
                                <SelectItem value="All">كل الأولويات</SelectItem>
                                <SelectItem value="Low">منخفضة</SelectItem>
                                <SelectItem value="Normal">عادية</SelectItem>
                                <SelectItem value="High">مرتفعة</SelectItem>
                                <SelectItem value="Critical">حرجة</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Sorting Filter */}
                    <div className="flex items-center gap-2 min-w-[130px] flex-1 md:flex-initial">
                        <ArrowUpDown className="w-4 h-4 text-muted-foreground shrink-0" />
                        <Select value={sortBy} onValueChange={onSortByChange}>
                            <SelectTrigger className="h-9" aria-label="Sort notifications select field">
                                <SelectValue placeholder="الترتيب" />
                            </SelectTrigger>
                            <SelectContent className="rtl text-right">
                                <SelectItem value="Newest">الأحدث أولاً</SelectItem>
                                <SelectItem value="Oldest">الأقدم أولاً</SelectItem>
                                <SelectItem value="Priority">حسب الأولوية</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Text Search Input */}
            <div className="relative">
                <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="البحث في العنوان أو محتوى التنبيه..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pr-9 pl-4 h-10 w-full bg-background/50 border-border"
                />
            </div>
        </div>
    );
};

export default NotificationFilters;
