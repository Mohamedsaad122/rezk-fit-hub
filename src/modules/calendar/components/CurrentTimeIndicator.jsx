import React, { useState, useEffect } from 'react';

/**
 * Renders a moving time-indicator bar if column matches active system date.
 */
export function CurrentTimeIndicator({ columnDate }) {
    const todayStr = "2026-07-13";
    const isToday = columnDate === todayStr;

    const [topOffset, setTopOffset] = useState(0);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!isToday) return;

        const updatePosition = () => {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            
            const totalMins = hours * 60 + minutes;
            const startMins = 6 * 60; // 06:00 Start of work hours
            const endMins = 22 * 60;  // 22:00 End of work hours
            
            if (totalMins >= startMins && totalMins <= endMins) {
                const diff = totalMins - startMins;
                // Assuming 60px height per hour block (1px = 1min)
                setTopOffset(diff);
                setVisible(true);
            } else {
                setVisible(false);
            }
        };

        updatePosition();
        const interval = setInterval(updatePosition, 60000);
        return () => clearInterval(interval);
    }, [isToday]);

    if (!isToday || !visible) return null;

    return (
        <div 
            className="absolute left-0 right-0 border-t-2 border-red-500 z-20 flex items-center pointer-events-none"
            style={{ top: `${topOffset}px` }}
        >
            <div className="w-2 h-2 rounded-full bg-red-500 -mr-1 shrink-0" />
        </div>
    );
}

export default CurrentTimeIndicator;
