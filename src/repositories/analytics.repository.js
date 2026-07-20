import { API_ENDPOINTS } from '@/constants/api.constants';
import api from '@/api/axios';
import AppConfig from '@/config/app.config';
import { mockDatabase } from '@/mocks/mockDatabase';
import { simulateApi } from '@/utils/mockApi.helper';
import { parseApiResponse } from '@/utils/parseApiResponse';
import { AnalyticsResponseSchema } from '@/contracts/analytics.contract';
import { 
    mockClientGrowth,
    mockRevenue,
    mockTaskCompletion,
    mockWorkoutDistribution,
    mockNutritionCompliance,
    mockAttendance,
    mockTopPerformers
} from '@/mocks/analytics.mock';
import { forecastLinearRegression } from '@/utils/forecast';
import { mean } from '@/utils/statistics';

/**
 * Analytics Repository to bridge Axios routes or simulated computations.
 */
export const AnalyticsRepository = {
    getMetrics: async (filters = {}) => {
        let result;
        if (AppConfig.enableMock) {
            result = await simulateApi(() => {
                // 1. Fetch real-time values from the mock database tables
                const clients = mockDatabase.clients.getAll() || [];
                const appointments = mockDatabase.calendarEvents.getAll() || [];
                const tasks = mockDatabase.tasks.getAll ? mockDatabase.tasks.getAll() : [];

                const totalClients = clients.length;
                const activeClients = clients.filter(c => c.subscriptionStatus === 'نشط').length;
                const inactiveClients = totalClients - activeClients;

                const totalAppointments = appointments.length;
                const cancelledAppointments = appointments.filter(e => e.status === 'Cancelled').length;

                const completedTasks = tasks.filter(t => t.status === 'Completed').length;
                const pendingTasks = tasks.filter(t => t.status === 'Todo' || t.status === 'In Progress' || t.status === 'Overdue').length;

                const clientProgresses = clients.map(c => Number(c.progress) || 0);
                const averageProgress = clientProgresses.length > 0 ? Math.round(mean(clientProgresses)) : 75;

                const nonCancelledTasks = tasks.length - tasks.filter(t => t.status === 'Cancelled').length;
                const taskCompletionRate = nonCancelledTasks > 0 ? Math.round((completedTasks / nonCancelledTasks) * 100) : 80;

                // 2. Build KPIs payload
                const kpis = {
                    totalClients,
                    activeClients,
                    inactiveClients,
                    appointments: totalAppointments,
                    completedTasks,
                    pendingTasks,
                    cancelledAppointments,
                    workoutCompletion: averageProgress,
                    nutritionCompliance: 85, // Standard baseline
                    clientGrowth: 12,
                    retentionRate: 94,
                    completionRate: taskCompletionRate,
                    coachProductivity: completedTasks,
                    averageProgress,
                    averageBmi: 24.2,
                    averageCalories: 2100
                };

                // 3. KPI Trends (comparing current filtered period to prior benchmark)
                const kpiTrends = {
                    totalClients: 8,
                    activeClients: 12,
                    appointments: 15,
                    completedTasks: 22,
                    retentionRate: 2,
                    workoutCompletion: 5,
                    nutritionCompliance: 4
                };

                // 4. Forecast Calculations based on historical data
                const clientGrowthHistory = mockClientGrowth.map(g => g.clients);
                const nextClientForecast = forecastLinearRegression(clientGrowthHistory);

                const appointmentsHistory = [18, 22, 25, 30, 32, 28, totalAppointments || 35];
                const nextAptForecast = forecastLinearRegression(appointmentsHistory);

                const taskHistory = [10, 15, 14, 18, 20, 22, completedTasks || 24];
                const nextTaskForecast = forecastLinearRegression(taskHistory);

                const forecasts = {
                    clientGrowth: [
                        ...mockClientGrowth.map(g => ({ period: g.name, actual: g.clients, forecast: g.clients })),
                        { period: 'أغسطس', actual: null, forecast: nextClientForecast }
                    ],
                    appointments: [
                        { period: 'مايو', actual: 32, forecast: 32 },
                        { period: 'يونيو', actual: 28, forecast: 28 },
                        { period: 'يوليو', actual: totalAppointments, forecast: totalAppointments },
                        { period: 'أغسطس', actual: null, forecast: nextAptForecast }
                    ],
                    taskCompletion: [
                        { period: 'مايو', actual: 20, forecast: 20 },
                        { period: 'يونيو', actual: 22, forecast: 22 },
                        { period: 'يوليو', actual: completedTasks, forecast: completedTasks },
                        { period: 'أغسطس', actual: null, forecast: nextTaskForecast }
                    ]
                };

                // 5. Build dynamic charts lists
                const charts = {
                    clientGrowth: mockClientGrowth,
                    revenue: mockRevenue,
                    taskCompletion: mockTaskCompletion,
                    workoutDistribution: mockWorkoutDistribution,
                    nutritionComplianceTrend: mockNutritionCompliance,
                    attendance: mockAttendance
                };

                return {
                    kpis,
                    kpiTrends,
                    charts,
                    topPerformers: mockTopPerformers,
                    forecasts
                };
            });
        } else {
            const response = await api.get(API_ENDPOINTS.ANALYTICS.BASE, { params: filters });
            result = response.data;
        }

        return parseApiResponse(AnalyticsResponseSchema, result, 'Analytics Report Data');
    }
};

export default AnalyticsRepository;
