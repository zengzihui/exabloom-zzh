import { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";


interface RoundedBaseNodeData {
    id: string;
    position: { x: number; y: number };
    data: {
        title?: string;
        [key: string]: unknown;
    };
}

interface RoundedBaseNodeProps extends NodeProps<RoundedBaseNodeData> {
    isSourceEnabled?: boolean; 
}

function RoundedBaseNode({
    data,
    selected,
    isSourceEnabled = true,
}: RoundedBaseNodeProps) {

  return (
    <div 
        className={`flex items-center justify-center gap-2 border bg-gray-200 text-gray-500 text-xs font-semibold rounded-full border-gray-200 w-56 h-14 p-3 ${
            selected ? 'border-gray-800' : 'border-gray-400' 
        } `}
    >
        {data.title && <p className="">{data.title}</p>}

        {isSourceEnabled && (
            <Handle
            type="source"
            position={Position.Bottom}
            isConnectable={true}
            />
        )}
        <Handle
            type='target'
            position={Position.Top}
            isConnectable={true}
        />
    </div>

  );
};

export default memo(RoundedBaseNode);

