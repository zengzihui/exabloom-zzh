import { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";


interface EndNodeData {
  id: string;
  position: { x: number; y: number };
  data: {
    label?: string;
    [key: string]: unknown;
  };
}

function EndNode({
    data,
    selected
}: NodeProps<EndNodeData>) {

// const EndNode = memo(({ data, selected }: NodeProps<EndNodeData>) => {
  return (
    <div 
        className={`flex items-center justify-center gap-2 border bg-gray-200 text-gray-500 text-xs font-semibold rounded-full border-gray-200 w-56 h-14 p-3 ${
            selected ? 'border-gray-800' : 'border-gray-400' 
        } `}
    >
       {data.label && <p className="">{data.label}</p>}
     
        <Handle
            type='target'
            position={Position.Top}
            isConnectable={true}
        />
    </div>
  );
};
 
export default memo(EndNode);
