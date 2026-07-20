import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export function TaskCompletionChart({ data = [] }) {
    return (
        <Card className="border-0 shadow-md bg-gradient-card">
            <CardHeader className="text-right pb-2">
                <CardTitle className="text-base font-bold text-foreground">معدل إنجاز المهام والمتابعات</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">مقارنة أسبوعية بين المهام المنجزة والمهام المعلقة</CardDescription>
            </CardHeader>
            <CardContent className="h-72 pt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                        <Legend 
                            verticalAlign="top" 
                            height={36} 
                            wrapperStyle={{ fontSize: '11px', fontFamily: 'sans-serif' }}
                        />
                        <Bar dataKey="completed" name="مهام مكتملة" fill="#10b981" stackId="a" radius={[0, 0, 0, 0]} />
                        <Bar dataKey="pending" name="مهام معلقة" fill="#f59e0b" stackId="a" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

export default TaskCompletionChart;
