import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export function WorkoutDistributionChart({ data = [] }) {
    return (
        <Card className="border-0 shadow-md bg-gradient-card">
            <CardHeader className="text-right pb-2">
                <CardTitle className="text-base font-bold text-foreground">توزيع البرامج الرياضية</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">نسب المتدربين المسجلين في فئات التمارين المختلفة</CardDescription>
            </CardHeader>
            <CardContent className="h-72 flex flex-col justify-center items-center">
                <div className="w-full h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Tooltip 
                                contentStyle={{ 
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                                    border: '1px solid #e2e8f0', 
                                    borderRadius: '12px',
                                    fontSize: '11px',
                                    fontFamily: 'sans-serif',
                                    textAlign: 'right'
                                }}
                            />
                            <Legend 
                                layout="horizontal" 
                                verticalAlign="bottom" 
                                align="center"
                                wrapperStyle={{ fontSize: '11px', fontFamily: 'sans-serif', paddingTop: '10px' }}
                            />
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color || "#3b82f6"} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}

export default WorkoutDistributionChart;
