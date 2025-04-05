import React, { useState, useRef, useCallback } from 'react';
import { 
    Background, 
    Controls, 
    EdgeTypes, 
    type Edge,
    MiniMap, 
    type Node,
    NodeTypes, 
    ReactFlow, 
    ReactFlowProvider, 
    addEdge,
    useEdgesState, 
    useNodesState, 
    useReactFlow 
} from "@xyflow/react";

import '@xyflow/react/dist/style.css';
import '../styles/xy-theme.css';
import StartNode from "../components/nodes/StartNode";
import EndNode from "../components/nodes/EndNode";
import AddBtnEdge from "../components/edges/AddBtnEdge";
import { CustomNodeType } from '../types/flowTypes';
import ActionNode from '../components/nodes/ActionNode';


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
        position: { x:0, y:150 },
        selected: false,
        data: { 
            label: "END" 
        },
    }
];

let id: number = 3;
const getId = () => `${id++}`;

const initialEdges: Edge[] = [
    {
        id: 'e1-2', source: '1', target: '2', type: 'addButton', data: { getId },
    }
];



const Level2Page = () => {
    const reactFlowWrapper = useRef(null);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    )

    return (
       <div className="w-full h-full">
            <ReactFlowProvider>
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
            </ReactFlowProvider>
        
       </div>
    )
}


export default Level2Page;
