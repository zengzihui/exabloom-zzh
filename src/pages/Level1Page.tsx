// import React, { useCallback, useRef } from 'react';
import { Background, Controls, EdgeTypes, MiniMap, NodeTypes, ReactFlow, ReactFlowProvider } from "@xyflow/react";

import '@xyflow/react/dist/style.css';
import '../styles/xy-theme.css';
import StartNode from "../components/nodes/StartNode";
import EndNode from "../components/nodes/EndNode";
import AddBtnEdge from "../components/edges/AddBtnEdge";

const nodeTypes: NodeTypes = {
    start: StartNode,
    end: EndNode,
   
}

const edgeTypes: EdgeTypes = {
    addButton: AddBtnEdge,
}
const nodes = [
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

const edges = [
    {
        id: 'e1-2', source: '1', target: '2', type: 'addButton'
    }
];



const Level1Page = () => {
    return (
       <div className="w-full h-full">
            <ReactFlowProvider>
                <ReactFlow 
                    nodes={nodes} 
                    edges={edges} 
                    nodeTypes={nodeTypes}  
                    edgeTypes={edgeTypes}
                    fitView
                >
                    <Controls />
                    <MiniMap />
                    <Background variant="dots" gap={12} size={1} />
                </ReactFlow>
            </ReactFlowProvider>
        
       </div>
    )
}


export default Level1Page;