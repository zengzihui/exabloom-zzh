import { memo } from "react";
import { NodeProps } from "@xyflow/react";
import RectangleBaseNode from "./RectangleBaseNode";
import { MdCallSplit } from "react-icons/md";

function IfElseNode(props: NodeProps) {
  return (
    <RectangleBaseNode 
      {...props} 
      icon={MdCallSplit}
      theme="yellow"
      />
  );
}

export default memo(IfElseNode);