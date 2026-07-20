import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export function RevenueChart({ data = [] }) {
    return (
        <Card className="border-0 shadow-md bg-gradient-card">
            <CardHeader className="text-right pb-2">
                <CardTitle className="text-base font-bold text-foreground">الإيرادات والاشتراكات</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">التدفقات المالية شهرياً بالريال السعودي</CardDescription>
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
                        <Bar 
                            dataKey="revenue" 
                            name="الإيرادات (ر.س)"
                            fill="#8b5cf6" 
                            radius={[6, 6, 0, 0]}
                            maxBarSize={30}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

export default RevenueChart;
