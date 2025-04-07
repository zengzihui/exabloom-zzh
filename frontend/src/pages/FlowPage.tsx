import React, { useState, useCallback, useEffect } from 'react';
import { 
    Background, 
    Controls, 
    MiniMap, 
    ReactFlow, 
    addEdge,
    useEdgesState, 
    useNodesState, 
    getIncomers,
    getOutgoers,
    getConnectedEdges,
    Edge,
} from "@xyflow/react";
import '@xyflow/react/dist/style.css';
import '../styles/xy-theme.css';
import ActionNodeForm from '../components/forms/ActionNodeForm';
import {  createNewEdge, getId, getLayoutedElements } from '../utils/flowUtils';
import { nodeTypes, edgeTypes, initialNodes, initialEdges } from '../constants/flowConstants';
import IfElseNodeForm from '../components/forms/IfElseNodeForm';
import { useAffectedNode } from '../stores/store';


const FlowPage = () => { 
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        initialNodes,
        initialEdges
    );
    const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);
   

    const [selectedNode, setSelectedNode] = useState(null);
    const [branchNodes, setBranchNodes] = useState(null);
    const [elseNode, setElseNode] = useState(null);
    const [showActionForm, setShowActionForm] = useState(false);
    const [showIfElseForm, setShowIfElseForm] = useState(false);
    const { affectedNodeId, setAffectedNodeId } = useAffectedNode();
  

    const handleNodeClick = (event, node) => {
        // Only show the form if the clicked node is of type 'action'
        if (node.type === 'action') {
            setSelectedNode(node);
            setShowActionForm(true);
        } else if (node.type === 'ifElse') {
            const childNodes = getOutgoers(node, nodes, edges);
            const branchNodes = childNodes.filter((child) => child.type === 'branch');
            const elseNode = childNodes.find((child) => child.type === 'else');
            setSelectedNode(node);
            setBranchNodes(branchNodes);
            setElseNode(elseNode);
            setShowIfElseForm(true);
        }
    };

    const onActionNodeFormSubmit = (data) => {
        // Update the node data
        setNodes(nds => 
          nds.map(node => {
            if (node.id === selectedNode.id) {
              return {
                ...node,
                data: {
                  ...node.data,
                  text: data.text
                }
              };
            }
            return node;
          })
        );
        
        setShowActionForm(false);
    };   
    
    // Handle IfElseNodeForm submission
    const onIfElseNodeFormSubmit = (data) => {
        // Update the IfElseNode text
        setNodes((nds) => 
            nds.map((node) => {
                if (node.id === selectedNode.id) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            text: data.ifElseText,
                        },
                    };
                }
                return node;
            })
        );

        // Update branch nodes
        setNodes((nds) => 
            nds.map((node) => {
                const branch = data.branches.find((b) => b.id === node.id);
                if (branch) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            title: branch.title,
                        },
                    };
                }
                return node;
            })
        );
        // Update else node
        if (elseNode) {
            setNodes((nds) => 
                nds.map((node) => {
                    if (node.id === elseNode.id) {
                        return {
                            ...node,
                            data: {
                                ...node.data,
                                title: data.elseTitle,
                            },
                        };
                    }
                    return node;
                })
            );
        }

        setShowIfElseForm(false);
    };

    // Handle adding a new branch node
    const handleAddBranch = () => {
        const branchCount = branchNodes.length + 1;
        const newBranchId = getId();

      
        const newBranchNode = {
            id: newBranchId,
            type: 'branch',
            position: {
                x: 0, // Position it near the IfElseNode
                y: 0,
            },
            data: {
                title: `Branch #${branchCount}`,
            },
        };
        // Add the new branch node and connect it to the IfElseNode
        // setNodes((nds) => [...nds, newBranchNode]);
        setNodes((nds) => 
            nds.map(node => {
                if (node.id === selectedNode.id) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            branchOrder: [...node.data.branchOrder, newBranchId],
                        },
                    };
                }
                return node;
            })
        );
        setEdges((eds) => [
            ...eds,
            {
                id: `e${selectedNode.id}-${newBranchId}`,
                source: selectedNode.id,
                target: newBranchId,
                type: 'smoothstep',
            },
        ]);
        
        
        setAffectedNodeId(selectedNode.id);
        // Update the branchNodes state
        setBranchNodes((branches) => [...branches, newBranchNode]);
    };



    const handleActionNodeDelete = useCallback(() => {
        const confirmed = window.confirm("Are you sure you want to delete this node?");

        if (confirmed && selectedNode) {
           // Get all connected edges
            const connectedEdges = getConnectedEdges([selectedNode], edges);
            
            // Get parent nodes (nodes that have edges pointing to the selected node)
            const parentNodes = getIncomers(selectedNode, nodes, edges);
            
            // Get child nodes (nodes that the selected node has edges pointing to)
            const childNodes = getOutgoers(selectedNode, nodes, edges);
            
            // Create new edges connecting each parent to each child
            const newEdges: Edge[] = [];
            parentNodes.forEach(parent => {
                childNodes.forEach(child => {
                newEdges.push(createNewEdge(parent.id, child.id));
                });
            });
            
            // Filter out the edges connected to the selected node
            const edgeIdsToRemove = connectedEdges.map(edge => edge.id);
            const filteredEdges = edges.filter(edge => !edgeIdsToRemove.includes(edge.id));
            
            // Set the new edges combining the filtered edges and new connections
            setEdges([...filteredEdges, ...newEdges]);
            
            // Remove the node
            setNodes((nds) => {
                const updatedNodes = nds.filter(node => node.id !== selectedNode.id);
                return updatedNodes;
            });

            setAffectedNodeId(selectedNode.id);

            setShowActionForm(false);
        }
    }, [selectedNode, edges, setEdges, setNodes]);

    const handleIfElseNodeDelete = useCallback(() => {
        const confirmed = window.confirm("Are you sure you want to delete this IfElse Node and all its children?");
        if (confirmed && selectedNode) {
            // Find all child nodes recursively
            const findAllChildren = (nodeId) => {
                const childNodes = getOutgoers({ id: nodeId }, nodes, edges);
                return childNodes.reduce((acc, child) => {
                    return [...acc, child, ...findAllChildren(child.id)];
                }, []);
            };

            const allChildren = findAllChildren(selectedNode.id);

            // Get all node IDs to delete
            const nodeIdsToDelete = [selectedNode.id, ...allChildren.map((child) => child.id)];

            // Remove all edges connected to these nodes
            const filteredEdges = edges.filter(
                (edge) => !nodeIdsToDelete.includes(edge.source) && !nodeIdsToDelete.includes(edge.target)
            );

            // Remove all nodes
            const filteredNodes = nodes.filter((node) => !nodeIdsToDelete.includes(node.id));

            // Find the direct parent of the IfElse Node
            const parentNodes = getIncomers(selectedNode, nodes, edges);
            const newEndNodeId = `end-${Date.now()}`;
            const newEndNode = {
                id: newEndNodeId,
                type: 'end',
                position: {
                    x: 0,
                    y: 0, 
                },
                data: {
                    title: 'END',
                },
            };

            // Create edges connecting the parent nodes to the new End Node
            const newEdges = parentNodes.map(parent => ({
                id: `e${parent.id}-${newEndNodeId}`,
                source: parent.id,
                target: newEndNodeId,
                type: 'addButton',
            }));

            setEdges([...filteredEdges, ...newEdges]);
            setNodes([...filteredNodes, newEndNode]);
            setAffectedNodeId(selectedNode.id);

            setShowIfElseForm(false);
            // // After deletion, relayout the parent branch if needed
            // if (parentNodes.length > 0) {
            //     const parentId = parentNodes[0].id;
            //     setNodes(prev => getLayoutedBranch(prev, filteredEdges, parentId));
            // }
        }
    }, [selectedNode, nodes, edges, setEdges, setNodes]);
    

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    useEffect(() => {
        if (nodes.length === 0) return;
        
            const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges);
            setNodes([...layoutedNodes]);
            setEdges([...layoutedEdges]);
            setAffectedNodeId(null);
        
     
      }, [nodes.length, edges.length]);
  

 

    return (
        <div className="w-full h-full">
         
            <ReactFlow 
                nodes={nodes} 
                edges={edges} 
                nodeTypes={nodeTypes}  
                edgeTypes={edgeTypes}
                fitView
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={handleNodeClick}
                deleteKeyCode={[]} // Disable default deletion behaviour
                nodesDraggable={false}  // Disable dragging 
            >
                <Controls />
                <MiniMap />
                <Background variant="dots" gap={12} size={1} />
            </ReactFlow>
          
            {showActionForm && (
                <ActionNodeForm
                    selectedNode={selectedNode}
                    onClose={() => setShowActionForm(false)}
                    onSubmit={onActionNodeFormSubmit}
                    onDelete={handleActionNodeDelete}
                />
            )}

            {showIfElseForm && (
                <IfElseNodeForm
                    selectedNode={selectedNode}
                    branchNodes={branchNodes}
                    elseNode={elseNode}
                    onClose={() => setShowIfElseForm(false)}
                    onSubmit={onIfElseNodeFormSubmit}
                    onAddBranch={handleAddBranch}
                    onDelete={handleIfElseNodeDelete}
                />
            )}
    
        </div>
    )
}

export default FlowPage;

