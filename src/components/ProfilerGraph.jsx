import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

export const ProfilerGraph = ({ data = [] }) => {
    return (
        <div className="h-[200px] w-full mt-2 font-mono text-[9px]">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <XAxis dataKey="timestamp" hide />
                    <YAxis hide />
                    <Tooltip contentStyle={{ background: '#18181b', border: 'none', borderRadius: '8px', color: '#fff' }} />
                    <Line type="monotone" dataKey="cpuUsage" name="CPU Usage" stroke="#0ea5e9" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="memoryUsedMB" name="Memory MB" stroke="#10b981" strokeWidth={2} dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ProfilerGraph;
