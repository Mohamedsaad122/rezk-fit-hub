import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient } from '@tanstack/react-query';
import AppConfig from '../config/app.config';
import { mockDatabase } from '../mocks/mockDatabase';
import { 
    sum, 
    mean, 
    variance, 
    stdDev 
} from '../utils/statistics';
import { calculateTrend } from '../utils/trend-calculator';
import { forecastSMA, forecastLinearRegression } from '../utils/forecast';
import { exportCSV, exportExcel, exportPDF } from '../utils/analytics-utils';
import { AnalyticsResponseSchema } from '../contracts/analytics.contract';
import { AnalyticsRepository } from '../repositories/analytics.repository';
import { KpiCard } from '../components/KpiCard';
import { TrendIndicator } from '../components/TrendIndicator';
import { StatisticsGrid } from '../components/StatisticsGrid';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false
        }
    }
});

describe('Enterprise Analytics & BI Sprint 3.6 Test Suite', () => {
    beforeEach(() => {
        AppConfig.enableMock = true;
        mockDatabase.reset();
        queryClient.clear();
        if (typeof window !== 'undefined') {
            window.URL.createObjectURL = vi.fn(() => 'mock-url');
        }
    });

    describe('1. Statistical Utilities', () => {
        it('should correctly calculate sum and mean of an array', () => {
            const data = [10, 20, 30, 40];
            expect(sum(data)).toBe(100);
            expect(mean(data)).toBe(25);
        });

        it('should correctly calculate variance and standard deviation', () => {
            const data = [10, 20, 30]; // mean = 20, squares: (10-20)^2=100, 0, (30-20)^2=100. sum=200. sample var = 200/(3-1)=100. stdDev = 10.
            expect(variance(data)).toBe(100);
            expect(stdDev(data)).toBe(10);
        });

        it('should calculate trend percentage growth/decline rate', () => {
            expect(calculateTrend(120, 100)).toBe(20);
            expect(calculateTrend(80, 100)).toBe(-20);
            expect(calculateTrend(50, 0)).toBe(100);
            expect(calculateTrend(0, 0)).toBe(0);
        });
    });

    describe('2. Mathematical Forecasting Models', () => {
        it('should forecast using Simple Moving Average (SMA)', () => {
            const history = [10, 20, 30, 40];
            expect(forecastSMA(history, 3)).toBe(30); // mean of [20, 30, 40]
        });

        it('should forecast using Simple Linear Regression', () => {
            const history = [10, 20, 30, 40]; // perfectly linear y = 10 * x + 10
            // next point at index 4 (5th point) should be 50
            expect(forecastLinearRegression(history)).toBe(50);
        });

        it('should handle small datasets or static values on forecasting', () => {
            expect(forecastLinearRegression([15])).toBe(15);
            expect(forecastLinearRegression([])).toBe(0);
        });
    });

    describe('3. Zod Contract validation & Mocking', () => {
        it('should validate parsed BI response contracts', async () => {
            const result = await AnalyticsRepository.getMetrics();
            const parsed = AnalyticsResponseSchema.safeParse(result);
            expect(parsed.success).toBe(true);
        });
    });

    describe('4. File Exporters', () => {
        it('should trigger browser download flows for CSV, Excel, and PDF', () => {
            const data = [{ Month: 'January', Sales: 5000 }];
            
            const csvResult = exportCSV(data, 'test.csv');
            expect(csvResult).toBe(true);

            const excelResult = exportExcel(data, 'test.xls');
            expect(excelResult).toBe(true);

            const pdfResult = exportPDF({ kpis: {}, forecasts: {} }, 'test.pdf');
            expect(pdfResult).toBe(true);
        });
    });

    describe('5. UI Components rendering', () => {
        it('should render TrendIndicator and color styling according to growth state', () => {
            const { rerender } = render(<TrendIndicator value={15} />);
            expect(screen.getByText('+15%')).toBeInTheDocument();

            rerender(<TrendIndicator value={-5} />);
            expect(screen.getByText('-5%')).toBeInTheDocument();
        });

        it('should render KpiCard values', () => {
            render(
                <KpiCard
                    title="المبيعات"
                    value="15000"
                    trend={10}
                    suffix="ر.س"
                    description="الأرباح المالية"
                />
            );
            expect(screen.getByText('المبيعات')).toBeInTheDocument();
            expect(screen.getByText('15000')).toBeInTheDocument();
            expect(screen.getByText('الأرباح المالية')).toBeInTheDocument();
        });

        it('should render StatisticsGrid layout grids', () => {
            const mockKpis = {
                totalClients: 25,
                activeClients: 20,
                inactiveClients: 5,
                appointments: 12,
                completedTasks: 8,
                pendingTasks: 4,
                cancelledAppointments: 0,
                workoutCompletion: 80,
                nutritionCompliance: 85,
                clientGrowth: 5,
                retentionRate: 90,
                coachProductivity: 8,
                averageCalories: 2000
            };
            render(<StatisticsGrid kpis={mockKpis} trends={{ totalClients: 8 }} />);
            expect(screen.getByText('إجمالي المشتركين')).toBeInTheDocument();
            expect(screen.getByText('المشتركين النشطين')).toBeInTheDocument();
            expect(screen.getByText('الالتزام بالتمارين')).toBeInTheDocument();
        });
    });
});
