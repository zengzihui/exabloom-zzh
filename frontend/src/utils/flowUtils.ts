import dagre from '@dagrejs/dagre';
import { Node, Edge } from "@xyflow/react";

let nextId = 3;

// use prefix to differentate diff nodes as Dagre uses nodeId value to determine its position
export const getId = (nodeType: string) => {
    switch(nodeType) {
        case 'ifElse': return `a${nextId++}`;
        case 'branch': return `B${nextId++}`;
        case 'action': return `a${nextId++}`;
        case 'else': return `z${nextId++}`; 
        case 'end': return `z${nextId++}`;
        default: return `m${nextId++}`;
    }
}

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
    dagreGraph.setGraph({ rankdir: direction, nodesep: 50, ranksep: 80 }); //ranker: "longest-path"

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
        id: `${source}-${target}`,
        source,
        target,
        type: 'addButton',
    };
};