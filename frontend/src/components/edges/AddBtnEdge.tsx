import React, { memo, useState } from 'react';
import {
    BaseEdge,
    Edge,
    Node,
    EdgeLabelRenderer,
    getSmoothStepPath,
    useReactFlow,
    type EdgeProps,
} from '@xyflow/react';
import { getId } from '../../utils/flowUtils';

function AddBtnEdge({
    id,
    source, 
    target,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd, 
}: EdgeProps) {


const { setEdges, setNodes, getNodes } = useReactFlow();

const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
});

// State to toggle the node selection buttons
const [showSelections, setShowSelections] = useState(false);

const handleNodeCreation = (nodeType: string) => {
    const nodes = getNodes();
    // Get source and target nodes to determine correct positioning
    const sourceNode = nodes.find(n => n.id === source);
    const targetNode = nodes.find(n => n.id === target);

    if (!sourceNode || !targetNode) return;

    // Generate a new unique id for the new node
    const newNodeId: string = getId('action');

    console.log("getId() = ", newNodeId);

    const newNode = {
        id: newNodeId,
        type: nodeType,
        position: { x: 0, y: 0, },
        selected: false,
        data: { 
            title: nodeType === 'action' ? "Action Node" : "If Else",
            text: '',
            // Conditionally add ifElse-specific properties
            ...(nodeType === 'ifElse' && {
                elseNodeId: '',                      
            })
        },
    };

    // Additional logic for IfElse Node
    let additionalNodes: Node[] = [];
    let additionalEdges: Edge[] = [];
    if (nodeType === 'ifElse') {
       
        const branchNodeId = getId('branch');
        const elseNodeId = getId('else');
        const endNodeId = getId('end');  

        newNode.data = {
            ...newNode.data,
            elseNodeId: elseNodeId,

        };

        const branchNode = {
            id: branchNodeId,
            type: 'branch',
            position: { x: 0, y: 0, },
            selected: false,
            data: { 
                title: "Branch #1"
            },
        };

        const elseNode = {
            id: elseNodeId,
            type: 'else',
            position: { x: 0, y: 0, },
            selected: false,
            data: { 
                title: "Else",
            },
        };

        const endNode = {
            id: endNodeId,
            type: 'end',
            position: { x: 0, y: 0, },
            selected: false,
            data: { 
                title: "END",
            },
        };

        // Add Branch and Else Nodes to the list of additional nodes
        additionalNodes = [branchNode, elseNode, endNode];
        // Create edges connecting IfElse Node to Branch and Else Nodes
        additionalEdges = [
            {
                id: `${newNodeId}-${branchNodeId}`,
                source: newNodeId,
                target: branchNodeId,
                type: 'smoothstep',
            },
            {
                id: `${branchNodeId}-${target}`,
                source: branchNodeId,
                target: target,
                type: 'addButton',
            },
            {
                id: `${newNodeId}-${elseNodeId}`,
                source: newNodeId,
                target: elseNodeId,
                type: 'smoothstep',
            },
           
            {
                id: `${elseNodeId}-${endNodeId}`,
                source: elseNodeId,
                target: endNodeId,
                type: 'addButton',
            },

        ];
    } else if (nodeType === 'action') {
        // Edge to END
        additionalEdges = [{
            id: `${newNodeId}-${target}`,
            source: newNodeId,
            target: target,
            type: 'addButton',
        }];
    }

    // Create new edge
    const newEdge1 = {
        id: `${source}-${newNodeId}`,
        source: source,
        target: newNodeId,
        type: 'addButton',
    };

     // Insert nodes at correct position
     setNodes((nds) => {
        // Find the target node index to maintain proper sequence
        const targetNodeIndex = nds.findIndex(n => n.id === target);
        const insertIndex = targetNodeIndex !== -1 ? targetNodeIndex : nds.length;
        
        const newNodesArray = [
            ...nds.slice(0, insertIndex + 1),
            newNode,
            ...additionalNodes,
            ...nds.slice(insertIndex + 1)
        ];
        console.log('Updated Notes:', newNodesArray);
        
        return newNodesArray;
    });
    
    // Insert edges at correct position
    setEdges((eds) => {
        // Find the index of the edge that need to be deleted
        const edgeIndex = eds.findIndex(edge => edge.id === id);
        
        // Filter out the old edge
        const filteredEdges = eds.filter(edge => edge.id !== id);
        
        // Insert new edges at the original edge's position
        const updatedEdges = [
            ...filteredEdges.slice(0, edgeIndex),
            newEdge1,
            ...additionalEdges,
            ...filteredEdges.slice(edgeIndex)
        ];
        
        console.log('Updated Edges:', updatedEdges);
        return updatedEdges;
     
    });
    setShowSelections(false);
};



return (
    <>
    <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
    <EdgeLabelRenderer>
    <div
        className="absolute pointer-events-auto origin-center transform -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${labelX}px`, top: `${labelY}px` }}
    >
        {showSelections ? (
            <div className="flex space-x-2 text-xs bg-gray-100 p-2 rounded">
                <button
                    className="px-2 py-1 bg-sky-400 text-white rounded hover:bg-sky-600"
                    onClick={() => handleNodeCreation('action')}
                >
                    Action Node
                </button>
                <button
                    className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-600"
                    onClick={() => handleNodeCreation('ifElse')}
                >
                    IfElse Node
                </button>
                <button
                    className="px-2 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    onClick={() => setShowSelections(false)}
                >
                    Cancel
                </button>
            </div>
        ) : (

        <button
            className="text-gray-400 bg-white hover:text-gray-900"
            onClick={() => setShowSelections(true)}
        >
            +
        </button>
        )}

        </div>
    </EdgeLabelRenderer>
    </>
);
}


export default memo(AddBtnEdge);