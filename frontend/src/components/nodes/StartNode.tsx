import { memo } from "react";
import { NodeProps } from "@xyflow/react";
import RectangleBaseNode from "./RectangleBaseNode";
import { TbMessage2Share } from "react-icons/tb";

function StartNode(props: NodeProps) {
  return (
    <RectangleBaseNode 
      {...props} 
      isTargetEnabled={false} 
      icon={TbMessage2Share}
      theme="emerald"
      />
  );
}

export default memo(StartNode);
