import React from 'react';

const EVENT_COLORS = {
    blue: "bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-300 hover:bg-blue-500/20",
    green: "bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-300 hover:bg-green-500/20",
    purple: "bg-purple-500/10 border-purple-500/30 text-purple-700 dark:text-purple-300 hover:bg-purple-500/20",
    yellow: "bg-yellow-500/10 border-yellow-500/30 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-500/20",
    orange: "bg-orange-500/10 border-orange-500/30 text-orange-700 dark:text-orange-300 hover:bg-orange-500/20",
    red: "bg-red-500/10 border-red-500/30 text-red-700 dark:text-red-300 hover:bg-red-500/20"
};

export function CalendarEventCell({ appointment, onClick, onResize, style = {} }) {
    const isLocked = appointment.lock?.isLocked;
    const colorClass = EVENT_COLORS[appointment.color] || EVENT_COLORS.blue;

    const handleDragStart = (e) => {
        if (isLocked) {
            e.preventDefault();
            return;
        }
        e.dataTransfer.setData("text/plain", JSON.stringify(appointment));
        e.dataTransfer.effectAllowed = "move";
    };

    const handleResizeMouseDown = (e, direction) => {
        if (isLocked) return;
        e.preventDefault();
        e.stopPropagation();
        const startY = e.clientY;

        const handleMouseUp = (upEvent) => {
            const diffY = upEvent.clientY - startY;
            const deltaMins = Math.round(diffY / 15) * 15;
            
            document.removeEventListener('mouseup', handleMouseUp);
            if (deltaMins !== 0) {
                onResize(appointment, deltaMins, direction);
            }
        };

        document.addEventListener('mouseup', handleMouseUp);
    };

    return (
        <div
            draggable={!isLocked}
            onDragStart={handleDragStart}
            onClick={() => onClick(appointment)}
            style={style}
            className={`absolute left-1 right-1 rounded-lg border px-2 py-1.5 overflow-hidden flex flex-col justify-between cursor-grab select-none shadow-sm transition-all text-xs font-sans group ${colorClass} ${isLocked ? 'opacity-60 cursor-not-allowed border-dashed' : ''}`}
        >
            {/* Top Resize Handle */}
            {!isLocked && (
                <div 
                    className="absolute top-0 left-0 right-0 h-1.5 cursor-ns-resize bg-transparent hover:bg-primary/30 z-10"
                    onMouseDown={(e) => handleResizeMouseDown(e, 'top')}
                />
            )}

            <div className="flex-grow">
                <div className="font-bold truncate leading-tight flex items-center gap-1 justify-start">
                    {isLocked && <span title={`مقفول بواسطة ${appointment.lock.lockedBy}`} className="text-[10px]">🔒</span>}
                    <span className="truncate">{appointment.title}</span>
                </div>
                <div className="text-[10px] opacity-75 mt-0.5 leading-none">
                    {appointment.startTime} - {appointment.endTime}
                </div>
            </div>

            {/* Bottom Resize Handle */}
            {!isLocked && (
                <div 
                    className="absolute bottom-0 left-0 right-0 h-1.5 cursor-ns-resize bg-transparent hover:bg-primary/30 z-10"
                    onMouseDown={(e) => handleResizeMouseDown(e, 'bottom')}
                />
            )}
        </div>
    );
}

export default React.memo(CalendarEventCell);
