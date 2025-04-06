// export type CustomNodeType = 'start' | 'end' | 'action' | 'if-else';
// export type CustomEdgeType = 'addButton' | 'default';

import { Node } from "@xyflow/react";

export interface FlowNode extends Node {
    data: {
        title?: string;
        text?: string;
        label?: string;
    }
}

// export interface FlowEdge extends Edge {
//     data: {
//         getId: () => string;
//     }
// }

export interface FlowFormData {
    text: string;
}
  
export interface FormValues {
    text: string;
}

export interface SelectedNode {
    id: string;
    data: {
        text?: string;
        title?: string;
    };
}


export interface IfElseFormValues {
    ifElseText: string;
    branchesTitle: { id: string; title: string }[];
    elseTitle: string;
}
