import React, { useState } from 'react';
import { useActivityFeed, useActivityStatistics } from '@/hooks/use-activity';
import ActivityFilters from '@/components/ActivityFilters';
import ActivityStatistics from '@/components/ActivityStatistics';
import ActivityTimeline from '@/components/ActivityTimeline';
import { Activity as ActivityIcon } from 'lucide-react';

export const Activity = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedTimeframe, setSelectedTimeframe] = useState('All');

    // Fetch live feed
    const { data: activities = [], isLoading: isLoadingFeed } = useActivityFeed({
        search: searchQuery,
        category: selectedCategory,
        timeframe: selectedTimeframe
    });

    // Fetch live statistics
    const { data: statistics = {} } = useActivityStatistics();

    // Filter timeframe dynamically for mock simulation if needed
    const filterTimeframe = (list) => {
        const now = new Date();
        const startOfToday = new Date(now.setHours(0,0,0,0));
        const startOfYesterday = new Date(new Date(startOfToday).setDate(startOfToday.getDate() - 1));
        const startOfWeek = new Date(new Date(startOfToday).setDate(startOfToday.getDate() - 7));
        const startOfMonth = new Date(new Date(startOfToday).setMonth(startOfToday.getMonth() - 1));

        return list.filter((act) => {
            const timestamp = new Date(act.timestamp);
            if (selectedTimeframe === 'Today') {
                return timestamp >= startOfToday;
            }
            if (selectedTimeframe === 'Yesterday') {
                return timestamp >= startOfYesterday && timestamp < startOfToday;
            }
            if (selectedTimeframe === 'Week') {
                return timestamp >= startOfWeek;
            }
            if (selectedTimeframe === 'Month') {
                return timestamp >= startOfMonth;
            }
            return true;
        });
    };

    const filteredActivities = filterTimeframe(activities);

    return (
        <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <ActivityIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-foreground">سجل النشاطات والعمليات</h2>
                        <p className="text-xs text-muted-foreground">متابعة فورية للأحداث الصادرة من الكوتش والمتدربين والمنظومة.</p>
                    </div>
                </div>
            </div>

            {/* Live stats */}
            <ActivityStatistics stats={statistics} />

            {/* Search filters */}
            <ActivityFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                selectedTimeframe={selectedTimeframe}
                onTimeframeChange={setSelectedTimeframe}
            />

            {/* Timeline component */}
            <ActivityTimeline activities={filteredActivities} isLoading={isLoadingFeed} />
        </div>
    );
};

export default Activity;
