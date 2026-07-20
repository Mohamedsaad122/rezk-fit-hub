import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export const MetricsChart = ({ data = [], dataKey = 'value', strokeColor = '#0ea5e9', fillColor = '#0ea5e9' }) => {
    return (
        <div className="h-[200px] w-full mt-2 font-mono text-[9px]">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <XAxis dataKey="timestamp" hide />
                    <YAxis hide />
                    <Tooltip contentStyle={{ background: '#18181b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                    <Area type="monotone" dataKey={dataKey} stroke={strokeColor} fill={fillColor} fillOpacity={0.1} strokeWidth={2} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default MetricsChart;
