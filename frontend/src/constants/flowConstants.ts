import StartNode from "../components/nodes/StartNode";
import EndNode from "../components/nodes/EndNode";
import AddBtnEdge from "../components/edges/AddBtnEdge";
import ActionNode from '../components/nodes/ActionNode';
import { FlowNode } from "../types/flowTypes";
import { EdgeTypes, NodeTypes } from "@xyflow/react";
import { Edge } from "@xyflow/react";
import IfElseNode from "../components/nodes/IfElseNode";
import BranchNode from "../components/nodes/BranchNode";
import ElseNode from "../components/nodes/ElseNode";

export const nodeTypes: NodeTypes = {
  start: StartNode,
  end: EndNode,
  action: ActionNode,
  ifElse: IfElseNode,
  branch: BranchNode,
  else: ElseNode,
};

export const edgeTypes: EdgeTypes = {
  addButton: AddBtnEdge,
};

export const initialNodes: FlowNode[] = [
  {
    id: 'a1',
    type: 'start',
    position: { x:0, y:0 },
    selected: false,        
    data: { 
      title: "Start Node",
      text: 'Start',
    },
  },
  // {
  //   id: '7',
  //   type: 'ifElse',
  //   position: { x:0, y:0 },
  //   selected: false,
  //   data: { 
  //     title: "IfElse" ,
  //     text: '7'
  //   },
  // },
  // {
  //   id: '8',
  //   type: 'branch',
  //   position: { x:0, y:0 },
  //   selected: false,
  //   data: { 
  //     title: "Branch 8" ,
  //   },
  // },
  
  // {
  //   id: '5',
  //   type: 'action',
  //   position: { x:0, y:0 },
  //   selected: false,
  //   data: { 
  //     title: "Action" ,
  //     text: '5'
  //   },
  // },
  // {
  //   id: '9',
  //   type: 'else',
  //   position: { x:0, y:0 },
  //   selected: false,
  //   data: { 
  //     title: "Else 9" ,
  //   },
  // },
  // {
  //   id: '10',
  //   type: 'end',
  //   position: { x:0, y:0 },
  //   selected: false,
  //   data: { 
  //     title: "END 10" 
  //   },
  // },
  {
    id: 'a2',
    type: 'end',
    position: { x:0, y:0 },
    selected: false,
    data: { 
      title: "END" 
    },
  },
  

];

export const initialEdges: Edge[] = [
    { id: 'a1-a2', source: 'a1', target: 'a2', type: 'addButton', },
    
    // { id: 'e1-7', source: '1', target: '7', type: 'addButton', },
    // { id: 'e7-9', source: '7', target: '9', type: 'addButton', },
    // { id: 'e9-10', source: '9', target: '10', type: 'addButton', },
    // { id: 'e7-8', source: '7', target: '8', type: 'addButton', },
    // { id: 'e8-5', source: '8', target: '5', type: 'addButton', },
    // { id: 'e5-2', source: '5', target: '2', type: 'addButton', },
    
];
    
