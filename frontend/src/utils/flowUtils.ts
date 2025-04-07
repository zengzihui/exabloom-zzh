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

    // Sort edges to maintain branch order
    const sortedEdges = sortEdges(nodes, edges);

    // Add Nodes and Edges to the dagreGraph
    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    sortedEdges.forEach((edge) => {
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

    return { nodes: newNodes, edges: sortedEdges };
};

function sortEdges(nodes: Node[], edges: Edge[]): Edge[] {
    const ifElseNodes = nodes.filter(node => node.type === 'ifElse');
    const edgesBySource: Record<string, Edge[]> = {};

    edges.forEach(edge => {
        if (!edgesBySource[edge.source]) edgesBySource[edge.source] = [];
        edgesBySource[edge.source].push(edge);
    });

    const sortedEdges: Edge[] = [];

    ifElseNodes.forEach(ifElseNode => {
        const outgoingEdges = edgesBySource[ifElseNode.id] || [];
        const { branchOrder = [], elseId } = ifElseNode.data;

        const branchEdges = outgoingEdges.filter(e => branchOrder.includes(e.target));
        const elseEdge = outgoingEdges.find(e => e.target === elseId);

        // Sort branch edges by branchOrder
        branchEdges.sort((a, b) => 
            branchOrder.indexOf(a.target) - branchOrder.indexOf(b.target)
        );

        // Add branches followed by else
        sortedEdges.push(...branchEdges);
        if (elseEdge) sortedEdges.push(elseEdge);
    });

    // Add non-IfElse edges (maintain original order)
    const otherEdges = edges.filter(edge => 
        !ifElseNodes.some(node => node.id === edge.source)
    );
    sortedEdges.push(...otherEdges);

    return sortedEdges;
}

export const createNewEdge = (source: string, target: string) => {
    return {
        id: `e${source}-${target}`,
        source,
        target,
        type: 'addButton',
    };
};

