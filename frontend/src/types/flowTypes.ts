import { Node } from "@xyflow/react";

export interface FlowNode extends Node {
    data: {
        title?: string;
        text?: string;
        label?: string;
    }
}


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
    branches: { id: string; title: string }[];
    elseTitle: string;
}
