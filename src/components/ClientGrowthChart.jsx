import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export function ClientGrowthChart({ data = [] }) {
    return (
        <Card className="border-0 shadow-md bg-gradient-card">
            <CardHeader className="text-right pb-2">
                <CardTitle className="text-base font-bold text-foreground">نمو المتدربين</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">معدل انضمام المتدربين الجدد خلال الأشهر الماضية</CardDescription>
            </CardHeader>
            <CardContent className="h-72 pt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorClients" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
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
                        <Area 
                            type="monotone" 
                            dataKey="clients" 
                            name="المشتركين"
                            stroke="var(--primary)" 
                            strokeWidth={2}
                            fillOpacity={1} 
                            fill="url(#colorClients)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}

export default ClientGrowthChart;
