import React, { memo } from 'react';
import {
    addEdge,
    BaseEdge,
    EdgeLabelRenderer,
    getSmoothStepPath,
    useReactFlow,
    type EdgeProps,
} from '@xyflow/react';
import type { CustomNodeType, CustomEdgeType } from '../../types/flowTypes';


interface AddBtnEdgeProps extends EdgeProps {
    getId: () => string;
}

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
    data,    
}: AddBtnEdgeProps) {


const { setEdges, setNodes, getNodes, getEdges, screenToFlowPosition } = useReactFlow();

const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
});


const onEdgeClick = async () => {
    if (!data?.getId) {
        console.error('getId function is not provided in edge data');
        return;
    }

    // Get source and target nodes to determine correct positioning
    const sourceNode = getNodes().find(n => n.id === source);
    const targetNode = getNodes().find(n => n.id === target);

    if (!sourceNode || !targetNode) return;

    // Generate a new unique id for the new node
    const newNodeId: string = data.getId();
    console.log("getId() = ", newNodeId);


    const newNode = {
        id: newNodeId,
        type: 'action',
        position: { 
            x: 0,
            y: 0,
        },
        selected: false,
        data: { 
            title: "Action Node",
            text: '',
        },
    };

    // Create 2 new edges
    const newEdge1 = {
        id: `e${source}-${newNodeId}`,
        source: source,
        target: newNodeId,
        type: 'addButton',
        data: { getId: data.getId },
    };
    const newEdge2 = {
        id: `e${newNodeId}-${target}`,
        source: newNodeId,
        target: target,
        type: 'addButton',
        data: { getId: data.getId },
    };

    // Add the new action node
    setNodes((nds) => {
        const updatedNodes = nds.concat(newNode);
        console.log('Updated Nodes: ', updatedNodes);
        return updatedNodes;
    });
    
    // Remove the current edge and add the new edges
    // setEdges((eds) =>
    //   eds.filter((edge) => edge.id !== id).concat(newEdge1, newEdge2),
    // );
    setEdges((eds) => {
        const updatedEdges = eds.filter((edge) => edge.id !== id).concat(newEdge1, newEdge2);
        console.log('Updated Edges:', updatedEdges);
        return updatedEdges;
    });

};


return (
    <>
    <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
    <EdgeLabelRenderer>
    <div
        className="absolute pointer-events-auto origin-center transform -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${labelX}px`, top: `${labelY}px` }}
    >
        <button
            className="text-gray-400 bg-white hover:text-gray-900"
            onClick={onEdgeClick}
        >
            +
        </button>
        </div>
    </EdgeLabelRenderer>
    </>
);
}


export default memo(AddBtnEdge);