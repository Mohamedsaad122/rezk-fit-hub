import { API_ENDPOINTS } from '@/constants/api.constants';
import api from '@/api/axios';
import AppConfig from '@/config/app.config';
import { simulateApi } from '@/utils/mockApi.helper';
import { mockDatabase } from '@/mocks/mockDatabase';
import { recentActivities, monthlyProgress } from '@/mocks/dashboard.mock';
import { Users, Dumbbell, Apple, Trophy } from 'lucide-react';
import { parseApiResponse } from '@/utils/parseApiResponse';
import {
    DashboardStatsResponseSchema,
    RecentActivitiesResponseSchema,
    MonthlyProgressResponseSchema,
    TopTraineesResponseSchema
} from '@/contracts/dashboard.contract';

const iconMap = {
    'Users': Users,
    'Dumbbell': Dumbbell,
    'Apple': Apple,
    'Trophy': Trophy
};

/**
 * Standardized Dashboard Repository.
 * Handles system stats aggregates, activity logs, monthly progress charts, and top trainees lists.
 */
export const DashboardRepository = {
    getStats: async () => {
        let rawData;
        if (AppConfig.enableMock) {
            rawData = await simulateApi(() => {
                const clientsCount = mockDatabase.clients.getAll().length;
                
                // Count total exercises
                let exercisesCount = 0;
                mockDatabase.exercises.getAllCategories().forEach(c => {
                    exercisesCount += c.exercises.length;
                });
                
                const nutritionPlansCount = mockDatabase.nutrition.getAllPlans().length;
                
                return [
                    {
                        title: "إجمالي المتدربين",
                        value: String(242 + clientsCount),
                        change: "+12%",
                        trend: "up",
                        iconName: "Users",
                        color: "text-blue-600",
                        bgColor: "bg-blue-100 dark:bg-blue-900/30"
                    },
                    {
                        title: "التمارين النشطة",
                        value: String(38 + exercisesCount),
                        change: "+8%",
                        trend: "up",
                        iconName: "Dumbbell",
                        color: "text-green-600",
                        bgColor: "bg-green-100 dark:bg-green-900/30"
                    },
                    {
                        title: "الأنظمة الغذائية",
                        value: String(24 + nutritionPlansCount),
                        change: "+5%",
                        trend: "up",
                        iconName: "Apple",
                        color: "text-orange-600",
                        bgColor: "bg-orange-100 dark:bg-orange-900/30"
                    },
                    {
                        title: "معدل الإنجاز",
                        value: "89%",
                        change: "+3%",
                        trend: "up",
                        iconName: "Trophy",
                        color: "text-purple-600",
                        bgColor: "bg-purple-100 dark:bg-purple-900/30"
                    }
                ];
            });
        } else {
            const response = await api.get(API_ENDPOINTS.DASHBOARD.OVERVIEW);
            rawData = response.data;
        }

        const validated = parseApiResponse(DashboardStatsResponseSchema, rawData, 'Dashboard Stats');
        // Map icon component inline for UI compatibility
        return validated.map(item => ({
            ...item,
            icon: iconMap[item.iconName] || Dumbbell
        }));
    },

    getRecentActivities: async () => {
        let rawData;
        if (AppConfig.enableMock) {
            rawData = await simulateApi(() => {
                // Map the mock data to have string keys representation for icon name
                return recentActivities.map(act => {
                    let iconName = "Activity";
                    if (act.type.includes("تمرين")) iconName = "Dumbbell";
                    else if (act.type.includes("متدرب")) iconName = "Users";
                    else if (act.type.includes("غذائي")) iconName = "Apple";
                    else if (act.type.includes("إنجاز")) iconName = "Trophy";
                    
                    return {
                        id: act.id,
                        type: act.type,
                        description: act.description,
                        time: act.time,
                        color: act.color,
                        iconName
                    };
                });
            });
        } else {
            const response = await api.get(API_ENDPOINTS.DASHBOARD.RECENT_ACTIVITIES);
            rawData = response.data;
        }

        const validated = parseApiResponse(RecentActivitiesResponseSchema, rawData, 'Recent Activities');
        return validated.map(item => ({
            ...item,
            icon: iconMap[item.iconName] || Trophy
        }));
    },

    getMonthlyProgress: async () => {
        let rawData;
        if (AppConfig.enableMock) {
            rawData = await simulateApi(() => [...monthlyProgress]);
        } else {
            const response = await api.get(API_ENDPOINTS.DASHBOARD.MONTHLY);
            rawData = response.data;
        }

        return parseApiResponse(MonthlyProgressResponseSchema, rawData, 'Monthly Progress');
    },

    getTopTrainees: async () => {
        let rawData;
        if (AppConfig.enableMock) {
            rawData = await simulateApi(() => {
                const dbClients = mockDatabase.clients.getAll();
                const sorted = [...dbClients].sort((a, b) => b.progress - a.progress);
                return sorted.slice(0, 5).map(c => ({
                    id: c.id,
                    name: c.name,
                    progress: c.progress,
                    workouts: c.workouts,
                    streak: c.streak,
                    goal: c.goal
                }));
            });
        } else {
            const response = await api.get(API_ENDPOINTS.DASHBOARD.TOP_TRAINEES);
            rawData = response.data;
        }

        return parseApiResponse(TopTraineesResponseSchema, rawData, 'Top Trainees');
    }
};

export default DashboardRepository;
