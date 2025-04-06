import StartNode from "../components/nodes/StartNode";
import EndNode from "../components/nodes/EndNode";
import AddBtnEdge from "../components/edges/AddBtnEdge";
import ActionNode from '../components/nodes/ActionNode';
import { FlowNode } from "../types/flowTypes";
import { EdgeTypes, NodeTypes } from "@xyflow/react";
import { Edge } from "@xyflow/react";

export const nodeTypes: NodeTypes = {
  start: StartNode,
  end: EndNode,
  action: ActionNode,
};

export const edgeTypes: EdgeTypes = {
  addButton: AddBtnEdge,
};

export const initialNodes: FlowNode[] = [
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
  
    // {
    //     id: '4', type: 'action', position: { x:0, y:0 }, selected: false,        
    //     data: { 
    //         title: "Node 4",
    //         text: '',
    //     },
    // },
    // {
    //     id: '5', type: 'action', position: { x:0, y:0 }, selected: false,        
    //     data: { 
    //         title: "Node 5",
    //         text: '',
    //     },
    // },
    // {
    //     id: '6', type: 'action', position: { x:0, y:0 }, selected: false,        
    //     data: { 
    //         title: "Action Node",
    //         text: '',
    //     },
    // },
];

export const initialEdges: Edge[] = [
    {
        id: 'e1-2', 
        source: '1', 
        target: '2', 
        type: 'addButton', 
        // data: { 
        //     getId: getId
        // },
    },
];
    
