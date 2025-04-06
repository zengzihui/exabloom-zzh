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
import { useForm } from 'react-hook-form';
import ActionNodeForm from '../components/ActionNodeForm';
import { getLayoutedElements, createNewEdge } from '../utils/flowUtils';
import { nodeTypes, edgeTypes, initialNodes, initialEdges } from '../constants/flowConstants';


const Level3Page = () => { 
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        initialNodes,
        initialEdges,
    );
    const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);
    const [selectedNode, setSelectedNode] = useState(null);
    const [showForm, setShowForm] = useState(false);
    
    const { register, handleSubmit, reset } = useForm();

  
     
    const handleActionNodeClick = (event, node) => {
        // Only show the form if the clicked node is of type 'action'
        if (node.type === 'action') {
            setSelectedNode(node);
            // Set form default values from node data
            reset({
                text: node.data.text || ''
            });
            setShowForm(true);
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
        
        setShowForm(false);
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

            setShowForm(false);
        }
    }, [selectedNode, edges, setEdges, setNodes]);
    

    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    useEffect(() => {
        if (nodes.length === 0) return;
        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges, '1');
        setNodes([...layoutedNodes]);
        setEdges([...layoutedEdges]);
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
                onNodeClick={handleActionNodeClick}
                deleteKeyCode={[]} // Disable default deletion behaviour
            >
                <Controls />
                <MiniMap />
                <Background variant="dots" gap={12} size={1} />
            </ReactFlow>
          
            {showForm && (
                <ActionNodeForm
                    selectedNode={selectedNode}
                    onClose={() => setShowForm(false)}
                    onSubmit={onActionNodeFormSubmit}
                    onDelete={handleActionNodeDelete}
                />
            )}
    
        </div>
    )
}

export default Level3Page;

