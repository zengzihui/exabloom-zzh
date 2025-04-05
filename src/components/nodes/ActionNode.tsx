import { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { TbMessage2Share } from "react-icons/tb";


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
    data,
    selected
}: NodeProps<ActionNodeData>) {
  return (
    <div 
        className={`flex items-center gap-2 border bg-white rounded w-56 h-14 p-3 ${
            selected ? 'border-emerald-400' : 'border-gray-200' 
        } `}
    >
        <Handle
            type='target'
            position={Position.Top}
            isConnectable={true}
            
        />
        <div className="flex-1 flex items-center justify-center bg-emerald-100 p-1 border rounded border-emerald-200">
            <TbMessage2Share className="text-emerald-600 text-2xl" />
        </div>
        <div className="flex-7 flex flex-col justify-center text-left text-xs font-bold">
           
            {data.title && <p className="text-emerald-600">{data.title}</p>}
            {data.text && <p className="">{data.text}</p>}
        </div>
        <Handle
            type='source'
            position={Position.Bottom}
            isConnectable={true}
            
        />
    </div>
  );
};
 
export default memo(ActionNode);
