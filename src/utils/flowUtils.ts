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