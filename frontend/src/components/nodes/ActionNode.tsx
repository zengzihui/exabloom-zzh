import { memo } from "react";
import { NodeProps } from "@xyflow/react";
// import { NodeToolBar } from "@xyflow/react";
import RectangleBaseNode from "./RectangleBaseNode";
import { TbUserEdit } from "react-icons/tb";

function ActionNode(props: NodeProps) {
  return (
    <RectangleBaseNode 
      {...props} 
      icon={TbUserEdit}
      theme="sky"
      />
  );
}

export default memo(ActionNode);

{/* <NodeToolbar isVisible={data.toolbarVisible} position={data.toolbarPosition} offset={6} align="center">
//             <div className="flex gap-2">
//                 <button className="border text-gray-600 rounded-xs px-1">Delete</button>
//                 <button 
//                     className="border text-gray-600 rounded-xs px-1"
                   
//                 >   
//                     Edit
//                 </button>
//             </div>
        
//         </NodeToolbar> */}