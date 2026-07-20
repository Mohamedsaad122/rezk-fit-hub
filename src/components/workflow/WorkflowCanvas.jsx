import React from 'react';
import WorkflowNode from './WorkflowNode';
import WorkflowEdge from './WorkflowEdge';

export const WorkflowCanvas = ({ nodes = [], edges = [], onNodeSelect, onRemoveNode }) => {
    return (
        <div className="relative w-full h-[500px] bg-slate-900 border border-slate-800 rounded-xl overflow-hidden select-none pattern-grid-lg">
            {/* Draw connections/edges */}
            <svg className="absolute inset-0 pointer-events-none w-full h-full">
                {edges.map((edge, index) => {
                    const sourceNode = nodes.find(n => n.id === edge.source);
                    const targetNode = nodes.find(n => n.id === edge.target);
                    if (!sourceNode || !targetNode) return null;

                    return (
                        <WorkflowEdge
                            key={index}
                            startX={(sourceNode.position?.x ?? 0) + 75}
                            startY={(sourceNode.position?.y ?? 0) + 40}
                            endX={(targetNode.position?.x ?? 0) + 75}
                            endY={(targetNode.position?.y ?? 0) + 0}
                        />
                    );
                })}
            </svg>

            {/* Draw nodes */}
            {nodes.map(node => (
                <WorkflowNode
                    key={node.id}
                    node={node}
                    onClick={() => onNodeSelect?.(node)}
                    onDelete={() => onRemoveNode?.(node.id)}
                />
            ))}
        </div>
    );
};

export default WorkflowCanvas;
