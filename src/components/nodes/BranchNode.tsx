import { memo } from "react";
import { NodeProps } from "@xyflow/react";
import RoundedBaseNode from "./RoundedBaseNode";

function BranchNode(props: NodeProps) {
  return <RoundedBaseNode {...props} isSourceEnabled={true} />;
}

export default memo(BranchNode);
