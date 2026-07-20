import { create } from 'zustand';

export const useWorkflowStore = create((set) => ({
    workflows: [],
    selectedWorkflowId: null,
    nodes: [],
    edges: [],
    
    setWorkflows: (workflows) => set({ workflows }),
    setSelectedWorkflowId: (id) => set({ selectedWorkflowId: id }),
    setNodes: (nodes) => set({ nodes }),
    setEdges: (edges) => set({ edges }),
    
    addNode: (node) => set((state) => ({ nodes: [...state.nodes, node] })),
    addEdge: (edge) => set((state) => ({ edges: [...state.edges, edge] })),
    removeNode: (nodeId) => set((state) => ({
        nodes: state.nodes.filter((n) => n.id !== nodeId),
        edges: state.edges.filter((e) => e.source !== nodeId && e.target !== nodeId)
    })),
    clearCanvas: () => set({ nodes: [], edges: [], selectedWorkflowId: null })
}));

export default useWorkflowStore;
