import dagre from '@dagrejs/dagre';
import { Node, Edge } from "@xyflow/react";

let nextId = 7;

export const getId = () => `${nextId++}`;

export const resetIdCounter = (value: number = 7) => {
nextId = value;
};

export const getLayoutedElements = (
    nodes: Node[], 
    edges: Edge[], 
    direction = 'TB'
) => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ rankdir: direction, nodesep: 50, ranksep: 50 });

    const nodeWidth = 224;
    const nodeHeight = 56;

    // Add Nodes and Edges to the dagreGraph
    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    // Calculate layout
    dagre.layout(dagreGraph);

    // Apply layout
    const newNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        
        return {
            ...node,
            targetPosition: 'top',
            sourcePosition: 'bottom',
            position: {
                x: nodeWithPosition.x - nodeWidth / 2,
                y: nodeWithPosition.y - nodeHeight / 2,
            },
        };
    });

    return { nodes: newNodes, edges };
};


export const createNewEdge = (source: string, target: string) => {
    return {
        id: `e${source}-${target}`,
        source,
        target,
        type: 'addButton',
    };
};



// const NODE_WIDTH = 224;
// const NODE_HEIGHT = 56;

// // Track branch order and root nodes
// export const branchRegistry = new Map<string, { index: number, rootId: string }>();

// export const registerBranch = (nodeId: string, index: number, rootId: string) => {
//   branchRegistry.set(nodeId, { index, rootId });
// };

// export const getLayoutedBranch = (
//   nodes: Node[],
//   edges: Edge[],
//   branchRootId: string,
//   direction: 'TB' | 'LR' = 'TB'
// ) => {
//   const graph = new dagre.graphlib.Graph();
//   graph.setDefaultEdgeLabel(() => ({}));
//   graph.setGraph({ rankdir: direction, nodesep: 50, ranksep: 80 });

//   // Get all nodes in this branch (including descendants)
//   const branchNodes = getBranchNodes(branchRootId, edges);
//   const branchInfo = branchRegistry.get(branchRootId);
//   const branchIndex = branchInfo?.index || 0;

//   // Add only branch nodes to graph
//   nodes.forEach(node => {
//     if (branchNodes.has(node.id)) {
//       graph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
//     }
//   });

//   // Add only edges within this branch
//   edges.forEach(edge => {
//     if (branchNodes.has(edge.source) && branchNodes.has(edge.target)) {
//       graph.setEdge(edge.source, edge.target);
//     }
//   });

//   dagre.layout(graph);

//   // Update positions only for branch nodes
//   return nodes.map(node => {
//     if (!branchNodes.has(node.id)) return node;
    
//     const dagreNode = graph.node(node.id);
//     return {
//       ...node,
//       position: {
//         x: dagreNode.x + (branchIndex * (NODE_WIDTH + 100)), // Offset by branch index
//         y: dagreNode.y
//       },
//       sourcePosition: 'bottom',
//       targetPosition: 'top'
//     };
//   });
// };

// // Get all nodes in a branch (including descendants)
// const getBranchNodes = (rootId: string, edges: Edge[], visited = new Set<string>()) => {
//   if (visited.has(rootId)) return new Set();
//   visited.add(rootId);

//   const children = edges
//     .filter(e => e.source === rootId)
//     .flatMap(e => [...getBranchNodes(e.target, edges, visited), e.target]);

//   return new Set([rootId, ...children]);
// };