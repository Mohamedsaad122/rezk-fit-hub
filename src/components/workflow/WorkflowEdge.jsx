import React from 'react';

export const WorkflowEdge = ({ startX, startY, endX, endY }) => {
    // Return SVG curve path between two visual coordinates
    const midY = (startY + endY) / 2;
    const path = `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`;

    return (
        <path
            d={path}
            fill="none"
            stroke="#ef4444"
            strokeWidth="2"
            className="stroke-red-500/80 animate-dash"
            style={{ strokeDasharray: '5, 5' }}
        />
    );
};

export default WorkflowEdge;
