import React, { memo } from 'react';
import {
    addEdge,
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
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
//   getId,
    
}: AddBtnEdgeProps) {


  const { setEdges, setNodes, screenToFlowPosition } = useReactFlow();

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });


 
  const onEdgeClick = (event: React.MouseEvent) => {
    if (!data?.getId) {
        console.error('getId function is not provided in edge data');
        return;
    }
    // Generate a new unique id for the new node
    const newNodeId: string = data.getId();
    console.log("getId() = ", newNodeId);

    const { clientX, clientY } = event;
    const flowPosition = screenToFlowPosition({ x: clientX, y: clientY });
    // Create new node at the midpoint of the edge
      // const { clientX, clientY } =
    //     'changedTouches' in event ? event.changedTouches[0] : event;

    const newNode = {
        id: newNodeId,
        type: 'action',
        position: flowPosition,
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

    // setEdges((eds) => addEdge([newEdge1, newEdge2], eds));
   
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
            className="text-gray-400 hover:text-gray-900"
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