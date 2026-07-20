import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export function NutritionDistributionChart({ data = [] }) {
    return (
        <Card className="border-0 shadow-md bg-gradient-card">
            <CardHeader className="text-right pb-2">
                <CardTitle className="text-base font-bold text-foreground">الالتزام بالأنظمة الغذائية</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">متوسط نسبة التزام المتدربين بوجباتهم المحددة أسبوعياً</CardDescription>
            </CardHeader>
            <CardContent className="h-72 pt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted/40" />
                        <XAxis 
                            dataKey="name" 
                            className="text-[10px] font-sans text-muted-foreground" 
                            stroke="currentColor" 
                            tickLine={false}
                        />
                        <YAxis 
                            className="text-[10px] font-sans text-muted-foreground" 
                            stroke="currentColor" 
                            tickLine={false}
                            axisLine={false}
                            domain={[0, 100]}
                        />
                        <Tooltip 
                            contentStyle={{ 
                                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                                border: '1px solid #e2e8f0', 
                                borderRadius: '12px',
                                fontSize: '11px',
                                fontFamily: 'sans-serif',
                                textAlign: 'right'
                            }}
                            labelClassName="font-bold text-foreground"
                        />
                        <Line 
                            type="monotone" 
                            dataKey="compliance" 
                            name="نسبة الالتزام"
                            stroke="#10b981" 
                            strokeWidth={3}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

export default NutritionDistributionChart;
