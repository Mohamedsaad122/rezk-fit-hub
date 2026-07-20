import React from 'react';

export const HealthIndicator = ({ status }) => {
    const isHealthy = status === 'Healthy';
    const isWarning = status === 'Warning';

    return (
        <span className="flex items-center gap-1.5 flex-row-reverse">
            <span className={`h-2 w-2 rounded-full relative flex`}>
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isHealthy ? 'bg-emerald-400' : isWarning ? 'bg-amber-400' : 'bg-rose-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isHealthy ? 'bg-emerald-500' : isWarning ? 'bg-amber-500' : 'bg-rose-500'}`}></span>
            </span>
            <span className={`text-[10px] font-bold ${isHealthy ? 'text-emerald-500' : isWarning ? 'text-amber-500' : 'text-rose-500'}`}>
                {isHealthy ? 'مستقر' : isWarning ? 'فحص' : 'فاشل'}
            </span>
        </span>
    );
};

export default HealthIndicator;
