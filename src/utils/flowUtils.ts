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
    rootNodeId: string, // id of the node whose children should be relayouted
    direction = 'TB',
) => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ rankdir: direction, nodesep: 50, ranksep: 80 });

    const nodeWidth = 224;
    const nodeHeight = 56;

    // Helper function to find all child nodes recursively
    const getChildNodes = (nodeId: string, visited: Set<string>): string[] => {
        if (visited.has(nodeId)) return [];
        visited.add(nodeId);

        const childNodes = edges
            .filter((edge) => edge.source === nodeId) // Find edges where the source is the current node
            .map((edge) => edge.target); // Get the target nodes

        // Recursively find children of the child nodes
        return childNodes.reduce(
            (acc, childId) => acc.concat(getChildNodes(childId, visited)),
            childNodes
        );
    };

    // Find all child nodes starting from the rootNodeId
    const visited = new Set<string>();
    const childNodeIds = getChildNodes(rootNodeId, visited);

    // Add the root node itself to the list of nodes to layout
    const layoutNodeIds = new Set([rootNodeId, ...childNodeIds]);

    // Add only the nodes and edges that are part of the subgraph
    nodes.forEach((node) => {
        if (layoutNodeIds.has(node.id)) {
            dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
        }
    });

    edges.forEach((edge) => {
        if (layoutNodeIds.has(edge.source) && layoutNodeIds.has(edge.target)) {
            dagreGraph.setEdge(edge.source, edge.target);
        }
    });

    // // Add Nodes and Edges to the dagreGraph
    // nodes.forEach((node) => {
    //     dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    // });

    // edges.forEach((edge) => {
    //     dagreGraph.setEdge(edge.source, edge.target);
    // });

    // Calculate layout
    dagre.layout(dagreGraph);

    // // Apply layout
    // const newNodes = nodes.map((node) => {
    //     const nodeWithPosition = dagreGraph.node(node.id);
        
    //     return {
    //         ...node,
    //         targetPosition: 'top',
    //         sourcePosition: 'bottom',
    //         position: {
    //             x: nodeWithPosition.x - nodeWidth / 2,
    //             y: nodeWithPosition.y - nodeHeight / 2,
    //         },
    //     };
    // });

    // Apply the new positions to the child nodes
    const newNodes = nodes.map((node) => {
        if (layoutNodeIds.has(node.id)) {
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
        }
        return node; // Keep the position of other nodes unchanged
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