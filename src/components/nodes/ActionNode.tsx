import { memo } from "react";
import { Handle, Position, NodeProps, NodeToolbar, useReactFlow } from "@xyflow/react";
import { TbUserEdit } from "react-icons/tb";


interface ActionNodeData {
    id: string;
    position: { x: number; y: number };
    data: {
        title?: string;
        text?: string;
        [key: string]: unknown;
    };

}

function ActionNode({
    id,
    data,
    selected,
}: NodeProps<ActionNodeData>) {


    return (
        <>
        {/* <NodeToolbar isVisible={data.toolbarVisible} position={data.toolbarPosition} offset={6} align="center">
            <div className="flex gap-2">
                <button className="border text-gray-600 rounded-xs px-1">Delete</button>
                <button 
                    className="border text-gray-600 rounded-xs px-1"
                   
                >   
                    Edit
                </button>
            </div>
        
        </NodeToolbar> */}
        <div 
            className={`flex items-center gap-2 border bg-white rounded w-56 h-14 p-3 ${
                selected ? 'border-blue-400' : 'border-gray-200' 
            } `}
        >
            
            <div className="flex-1 flex items-center justify-center bg-sky-100 p-1 border rounded border-sky-200">
                <TbUserEdit className="text-sky-600 text-2xl" />
            </div>
            <div className="flex-7 flex flex-col justify-center text-left text-xs font-bold w-full min-w-0">
            
                {data.title && <p className="text-sky-600">{data.title}</p>}
                {data.text && <p className="truncate"  title={data.text}>{data.text}</p>}
            </div>

            <Handle type='target' position={Position.Top} isConnectable={true} />
            <Handle type='source' position={Position.Bottom} isConnectable={true} />
        </div>
        </>
    );
};

export default memo(ActionNode);
