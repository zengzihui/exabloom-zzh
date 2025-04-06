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
import { useAffectedNode } from '../../stores/store';

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
const { affectedNodeId, setAffectedNodeId } = useAffectedNode();

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
    // Get source and target nodes to determine correct positioning
    const sourceNode = getNodes().find(n => n.id === source);
    const targetNode = getNodes().find(n => n.id === target);

    if (!sourceNode || !targetNode) return;

    // Generate a new unique id for the new node
    const newNodeId: string = getId();

    console.log("getId() = ", newNodeId);

    // Create new node
    const newNode = {
        id: newNodeId,
        type: nodeType,
        position: { 
            x: 0,
            y: 0,
        },
        selected: false,
        data: { 
            title: nodeType === 'action' ? "Action Node" : "If Else",
            text: '',
        },
    };

    // Additional logic for IfElse Node
    let additionalNodes: Node[] = [];
    let additionalEdges: Edge[] = [];
    if (nodeType === 'ifElse') {
        // Create Branch Node
        const branchNodeId = getId();
        const branchNode = {
            id: branchNodeId,
            type: 'branch',
            position: { 
                x: 0, 
                y: 0,
            },
            selected: false,
            data: { 
                title: "Branch #1",
            },
        };

        // Create Else Node
        const elseNodeId = getId();
        const elseNode = {
            id: elseNodeId,
            type: 'else',
            position: { 
                x: 0,
                y: 0,
            },
            selected: false,
            data: { 
                title: "Else",
            },
        };

        // Create Else Node
        const endNodeId = getId();
        const endNode = {
            id: endNodeId,
            type: 'end',
            position: { 
                x: 0, 
                y: 0,
            },
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
                id: `e${newNodeId}-${branchNodeId}`,
                source: newNodeId,
                target: branchNodeId,
                type: 'smoothstep',
            },
            {
                id: `e${newNodeId}-${elseNodeId}`,
                source: newNodeId,
                target: elseNodeId,
                type: 'smoothstep',
            },
            {
                id: `e${branchNodeId}-2}`,
                source: branchNodeId,
                target: target,
                type: 'addButton',
            },
            {
                id: `e${elseNodeId}-2`,
                source: elseNodeId,
                target: endNodeId,
                type: 'addButton',
            },

        ];
    } else if (nodeType === 'action') {
        // Edge to END
        additionalEdges = [{
            id: `e${newNodeId}-${target}`,
            source: newNodeId,
            target: target,
            type: 'addButton',
        }];
    }

    // Create new edge
    const newEdge1 = {
        id: `e${source}-${newNodeId}`,
        source: source,
        target: newNodeId,
        type: 'addButton',
    };
   

    // Add the new action node
    setNodes((nds) => {
        const updatedNodes = nds.concat(newNode, ...additionalNodes);
        console.log('Updated Nodes: ', updatedNodes);
        return updatedNodes;
    });
    
    // Remove the current edge and add the new edges
    // setEdges((eds) =>
    //   eds.filter((edge) => edge.id !== id).concat(newEdge1, newEdge2),
    // );
    setEdges((eds) => {
        const updatedEdges = eds.filter((edge) => edge.id !== id).concat(newEdge1, ...additionalEdges);
        console.log('Updated Edges:', updatedEdges);
        return updatedEdges;
    });

    console.log(`newNode id = ${newNodeId} `);
    setAffectedNodeId(newNodeId);
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