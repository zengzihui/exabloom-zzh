import React, { useState, useRef, useCallback, useLayoutEffect, useEffect } from 'react';
import { 
    Background, 
    Controls, 
    EdgeTypes, 
    type Edge,
    MiniMap, 
    type Node,
    NodeTypes, 
    ReactFlow, 
    addEdge,
    useEdgesState, 
    useNodesState, 
    useReactFlow 
} from "@xyflow/react";
import ELK from 'elkjs/lib/elk.bundled.js';
import '@xyflow/react/dist/style.css';
import '../styles/xy-theme.css';
import StartNode from "../components/nodes/StartNode";
import EndNode from "../components/nodes/EndNode";
import AddBtnEdge from "../components/edges/AddBtnEdge";
import { CustomNodeType } from '../types/flowTypes';
import ActionNode from '../components/nodes/ActionNode';
import dagre from '@dagrejs/dagre';


const nodeTypes: NodeTypes = {
    start: StartNode,
    end: EndNode,
    action: ActionNode,
   
}

const edgeTypes: EdgeTypes = {
    addButton: AddBtnEdge,
}
const initialNodes: Node[] = [
    {
        id: '1',
        type: 'start',
        position: { x:0, y:0 },
        selected: false,        
        data: { 
            title: "Start Node",
            text: 'Start',
        },
    },
    {
        id: '2',
        type: 'end',
        position: { x:0, y:0 },
        selected: false,
        data: { 
            label: "END" 
        },
    },
    {
        id: '4', type: 'action', position: { x:0, y:0 }, selected: false,        
        data: { 
            title: "Node 4",
            text: '',
        },
    },
    {
        id: '5', type: 'action', position: { x:0, y:0 }, selected: false,        
        data: { 
            title: "Node 5",
            text: '',
        },
    },
    {
        id: '6', type: 'action', position: { x:0, y:0 }, selected: false,        
        data: { 
            title: "Node 6",
            text: '',
        },
    },
   
];

let id: number = 7;
const getId = () => `${id++}`;


   
const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
 
const nodeWidth = 224;
const nodeHeight = 56;

const getLayoutedElements = (nodes, edges, direction = 'TB') => {
    // Create a new graph layout
    dagreGraph.setGraph({ 
      rankdir: direction,
      nodesep: 50,    // Horizontal separation
      ranksep: 50    // Vertical separation
    });
    
    // Group nodes by their parent's x position to maintain vertical columns
    const nodeColumns = {};
    const childToParentMap = {};
    
    // First, identify parent-child relationships
    edges.forEach((edge) => {
      childToParentMap[edge.target] = edge.source;
    });
    
    // Trace from each node up to find its "root parent"
    const findRootParent = (nodeId) => {
      let current = nodeId;
      let parent = childToParentMap[current];
      
      // Follow the chain up until we find the topmost parent
      while (parent) {
        current = parent;
        parent = childToParentMap[current];
      }
      
      return current;  
    };
    
    // Group nodes by their root parent to form columns
    nodes.forEach((node) => {
      const rootParent = findRootParent(node.id);
      if (!nodeColumns[rootParent]) {
        nodeColumns[rootParent] = [];
      }
      nodeColumns[rootParent].push(node.id);
    });
    
    // Add nodes to dagre
    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });
    
    // Add edges to dagre
    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });
    
    // Calculate layout with dagre
    dagre.layout(dagreGraph);
    
    // Get column x positions from root nodes
    const columnXPositions = {};
    Object.keys(nodeColumns).forEach((rootParent) => {
      const rootNodePosition = dagreGraph.node(rootParent);
      if (rootNodePosition) {
        columnXPositions[rootParent] = rootNodePosition.x;
      }
    });
    
    // Apply the layout with vertical column alignment
    const newNodes = nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      if (!nodeWithPosition) return node;
      
      // Find the column this node belongs to
      const rootParent = findRootParent(node.id);
      // Use the column's x position if available, otherwise use dagre's calculation
      const xPosition = columnXPositions[rootParent] || nodeWithPosition.x;
      
      const newNode = {
        ...node,
        targetPosition: 'top',
        sourcePosition: 'bottom',
        position: {
          x: xPosition - nodeWidth / 2,
          y: nodeWithPosition.y - nodeHeight / 2,
        },
      };
      
      return newNode;
    });
    
    return { nodes: newNodes, edges };
  };


/* WILL CAUSE THE LAYOUT ISSUE*/
// const getLayoutedElements = (nodes, edges, direction = 'TB') => {
//     dagreGraph.setGraph({ 
//         rankdir: direction,
//         ranker: 'network-simplex',
        
//     });
    
//     nodes.forEach((node) => {
//         dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
//     });
    
//     edges.forEach((edge) => {
//         dagreGraph.setEdge(edge.source, edge.target);
//     });
    
//     dagre.layout(dagreGraph);
    
//     const newNodes = nodes.map((node) => {
//         const nodeWithPosition = dagreGraph.node(node.id);
//         const newNode = {
//         ...node,
//         targetPosition: 'top',
//         sourcePosition: 'bottom',
//         // We are shifting the dagre node position (anchor=center center) to the top left
//         // so it matches the React Flow node anchor point (top left).
//         position: {
//             x: nodeWithPosition.x - nodeWidth / 2,
//             y: nodeWithPosition.y - nodeHeight / 2,
//         },
//         };
 
//     return newNode;
//   });
 
//   return { nodes: newNodes, edges };
// };
 
const initialEdges: Edge[] = [
    {
        id: 'e1-2', source: '1', target: '2', type: 'addButton', data: { getId },
    },
    // {
    //     id: 'e4-5', source: '4', target: '5', type: 'addButton', data: { getId },
    // },
    // {
    //     id: 'e4-6', source: '4', target: '6', type: 'addButton', data: { getId },
    // },
    // {
    //     id: 'e4-2', source: '4', target: '2', type: 'addButton', data: { getId },
    // },
];


const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
  initialNodes,
  initialEdges,
);
 

const Level2Page = () => {
    const reactFlowWrapper = useRef(null);

    const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);
    

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );


    useEffect(() => {
        if (nodes.length === 0) return;

        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges);
        setNodes([...layoutedNodes]);
        setEdges([...layoutedEdges]);
      }, [nodes.length, edges.length]);
    

    return (
        <div className="w-full h-full">
            
            <ReactFlow 
                nodes={nodes} 
                edges={edges} 
                nodeTypes={nodeTypes}  
                edgeTypes={edgeTypes}
                fitView
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
            >
                <Controls />
                <MiniMap />
                <Background variant="dots" gap={12} size={1} />
            </ReactFlow>
            
        
        </div>
    )
}


export default Level2Page;
