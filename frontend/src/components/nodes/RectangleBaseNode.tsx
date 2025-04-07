import { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { IconType } from "react-icons";
import { themeColors, ColorTheme } from "../../constants/colorConstants";

interface RectangleBaseNodeData {
    id: string;
    position: { x: number; y: number };
    data: {
        title?: string;
        text?: string;
        [key: string]: unknown;
    };
}

interface RectangleBaseNodeProps extends NodeProps<RectangleBaseNodeData> {
    isTargetEnabled?: boolean; 
    icon?: IconType;
    theme?: ColorTheme;
}

function RectangleBaseNode({
    data,
    selected,
    isTargetEnabled = true,
    icon: Icon,
    theme = 'emerald'
}: RectangleBaseNodeProps) {
    const colors = themeColors[theme];

    return (
    <div 
        className={`flex items-center gap-2 border bg-white rounded w-56 h-14 p-3 ${
            selected ? colors.selectedBorder : 'border-gray-200' 
        } `}
    >
       <div className={`flex-1 flex items-center justify-center ${colors.bg} p-1 border rounded ${colors.border}`}>
            {Icon && <Icon className={`${colors.text} text-2xl`} />}
        </div>

        <div className="flex-7 flex flex-col justify-center text-left text-xs font-bold">
           
            {data.title && <p className={`${colors.text}`}>{data.title}</p>}
            {data.text && <p className="">{data.text}</p>}
        </div>

        <Handle
            type='source'
            position={Position.Bottom}
            isConnectable={true}
            
        />
        {isTargetEnabled && (
            <Handle
            type="target"
            position={Position.Top}
            isConnectable={true}
            />
        )}
       
    </div>

  );
};

export default memo(RectangleBaseNode);

