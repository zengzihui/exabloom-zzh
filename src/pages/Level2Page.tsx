import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
    Background, 
    Controls, 
    EdgeTypes, 
    type Edge,
    MiniMap, 
    type Node,
    NodeTypes, 
    ReactFlow, 
    addEdge,
    useEdgesState, 
    useNodesState, 
    useReactFlow, 
    getIncomers,
    getOutgoers,
    getConnectedEdges,
} from "@xyflow/react";
import '@xyflow/react/dist/style.css';
import '../styles/xy-theme.css';
import StartNode from "../components/nodes/StartNode";
import EndNode from "../components/nodes/EndNode";
import AddBtnEdge from "../components/edges/AddBtnEdge";
import ActionNode from '../components/nodes/ActionNode';
import dagre from '@dagrejs/dagre';
import { useForm } from 'react-hook-form';
import { RxCross2 } from "react-icons/rx";

const nodeTypes: NodeTypes = {
    start: StartNode,
    end: EndNode,
    action: ActionNode,
   
}

const edgeTypes: EdgeTypes = {
    addButton: AddBtnEdge,
}
const initialNodes: Node[] = [
    {
        id: '1',
        type: 'start',
        position: { x:0, y:0 },
        selected: false,        
        data: { 
            title: "Start Node",
            text: 'Start',
        },
    },
    {
        id: '2',
        type: 'end',
        position: { x:0, y:0 },
        selected: false,
        data: { 
            label: "END" 
        },
    },
    // {
    //     id: '4', type: 'action', position: { x:0, y:0 }, selected: false,        
    //     data: { 
    //         title: "Node 4",
    //         text: '',
    //     },
    // },
    // {
    //     id: '5', type: 'action', position: { x:0, y:0 }, selected: false,        
    //     data: { 
    //         title: "Node 5",
    //         text: '',
    //     },
    // },
    // {
    //     id: '6', type: 'action', position: { x:0, y:0 }, selected: false,        
    //     data: { 
    //         title: "Action Node",
    //         text: '',
    //     },
    // },
   
];

let id: number = 7;
const getId = () => `${id++}`;


   
const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
 
const nodeWidth = 224;
const nodeHeight = 56;

const getLayoutedElements = (nodes, edges, direction = 'TB') => {
    // Create a new graph layout
    dagreGraph.setGraph({ 
      rankdir: direction,
      nodesep: 50,    
      ranksep: 50    
    });
    
    // Group nodes by their parent's x position to maintain vertical columns
    const nodeColumns = {};
    const childToParentMap = {};
    
    // First, identify parent-child relationships
    edges.forEach((edge) => {
      childToParentMap[edge.target] = edge.source;
    });
    
    // Trace from each node up to find its "root parent"
    const findRootParent = (nodeId) => {
      let current = nodeId;
      let parent = childToParentMap[current];
      
      // Follow the chain up until we find the topmost parent
      while (parent) {
        current = parent;
        parent = childToParentMap[current];
      }
      
      return current;  
    };
    
    // Group nodes by their root parent to form columns
    nodes.forEach((node) => {
      const rootParent = findRootParent(node.id);
      if (!nodeColumns[rootParent]) {
        nodeColumns[rootParent] = [];
      }
      nodeColumns[rootParent].push(node.id);
    });
    
    // Add nodes to dagre
    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });
    
    // Add edges to dagre
    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });
    
    // Calculate layout with dagre
    dagre.layout(dagreGraph);
    
    // Get column x positions from root nodes
    const columnXPositions = {};
    Object.keys(nodeColumns).forEach((rootParent) => {
      const rootNodePosition = dagreGraph.node(rootParent);
      if (rootNodePosition) {
        columnXPositions[rootParent] = rootNodePosition.x;
      }
    });
    
    // Apply the layout with vertical column alignment
    const newNodes = nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      if (!nodeWithPosition) return node;
      
      // Find the column this node belongs to
      const rootParent = findRootParent(node.id);
      // Use the column's x position if available, otherwise use dagre's calculation
      const xPosition = columnXPositions[rootParent] || nodeWithPosition.x;
      
      const newNode = {
        ...node,
        targetPosition: 'top',
        sourcePosition: 'bottom',
        position: {
          x: xPosition - nodeWidth / 2 + (Math.random() * 0.001),
          y: nodeWithPosition.y - nodeHeight / 2,
        },
      };
      
      return newNode;
    });
    
    return { nodes: newNodes, edges };
  };


/* WILL CAUSE THE LAYOUT ISSUE*/
// const getLayoutedElements = (nodes, edges, direction = 'TB') => {
//     dagreGraph.setGraph({ 
//         rankdir: direction,
//         ranker: 'network-simplex',
        
//     });
    
//     nodes.forEach((node) => {
//         dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
//     });
    
//     edges.forEach((edge) => {
//         dagreGraph.setEdge(edge.source, edge.target);
//     });
    
//     dagre.layout(dagreGraph);
    
//     const newNodes = nodes.map((node) => {
//         const nodeWithPosition = dagreGraph.node(node.id);
//         const newNode = {
//         ...node,
//         targetPosition: 'top',
//         sourcePosition: 'bottom',
//         // We are shifting the dagre node position (anchor=center center) to the top left
//         // so it matches the React Flow node anchor point (top left).
//         position: {
//             x: nodeWithPosition.x - nodeWidth / 2,
//             y: nodeWithPosition.y - nodeHeight / 2,
//         },
//         };
 
//     return newNode;
//   });
 
//   return { nodes: newNodes, edges };
// };
 



const Level2Page = () => {
   

   
    const incrementLayoutVersion = useCallback(() => {
        setLayoutVer((v) => (v + 1) % 10000); // Counter cycles between 0 and 9999
    }, []);

    const initialEdges: Edge[] = [
        {
            id: 'e1-2', 
            source: '1', 
            target: '2', 
            type: 'addButton', 
            data: { 
                getId: getId,  
                incrementLayoutVersion: incrementLayoutVersion,
            },
        },
        // {
        //     id: 'e4-5', source: '4', target: '5', type: 'addButton', data: { getId },
        // },
        // {
        //     id: 'e4-6', source: '4', target: '6', type: 'addButton', data: { getId },
        // },
        // {
        //     id: 'e4-2', source: '4', target: '2', type: 'addButton', data: { getId },
        // },
    ];
    
    
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      initialNodes,
      initialEdges,
    );
    const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);
    const [selectedNode, setSelectedNode] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [layoutVer, setLayoutVer] = useState(0);
    
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
    const onSubmit = (data) => {
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

    
    const createNewEdge = (source, target) => {
        return {
            id: `e${source}-${target}`,
            source,
            target,
            type: 'addButton',
            data: { 
                getId: getId,
                incrementLayoutVersion: incrementLayoutVersion, 
            } 
        };
    };

    const handleDelete = useCallback(() => {
        const confirmed = window.confirm("Are you sure you want to delete this node?");

        if (confirmed && selectedNode) {
           // Get all connected edges
            const connectedEdges = getConnectedEdges([selectedNode], edges);
            
            // Get parent nodes (nodes that have edges pointing to the selected node)
            const parentNodes = getIncomers(selectedNode, nodes, edges);
            
            // Get child nodes (nodes that the selected node has edges pointing to)
            const childNodes = getOutgoers(selectedNode, nodes, edges);
            
            // Create new edges connecting each parent to each child
            const newEdges = [];
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
                console.log(`come inside with ver ${layoutVer}`);
                incrementLayoutVersion();
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
        console.log("Effect running with layoutVer:", layoutVer);
        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges);
        setNodes([...layoutedNodes]);
        setEdges([...layoutedEdges]);
      }, [layoutVer]);
    

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
            >
                <Controls />
                <MiniMap />
                <Background variant="dots" gap={12} size={1} />
            </ReactFlow>
          
        
            {showForm && (
                <div className="absolute inset-0 z-10" style={{ backgroundColor: 'rgba(0, 0, 0, 0.65)'}}>
                    <div className="absolute top-0 right-0 bottom-0 w-[600px] p-8 bg-white shadow-xl flex flex-col h-full">
                        <div className="flex gap-4 justify-between border-b border-gray-200 py-2 my-2">
                            <div className='flex flex-col items-start w-full min-w-0'>
                                <h3 
                                    className="text-lg font-medium text-gray-800 truncate w-full text-left"
                                    title={selectedNode?.data?.title}
                                >
                                    {selectedNode?.data?.title || 'Action Node'}
                                </h3>
                                <p 
                                    className='truncate w-full text-left text-md text-gray-800' 
                                    title={selectedNode?.data?.text}
                                >
                                    {selectedNode?.data?.text || 'Untitled Node' }
                                </p>
                            </div>
                        
                            <button 
                                onClick={() => setShowForm(false)}
                                className="text-gray-400 hover:text-gray-700 focus:outline-none"
                            >
                                <RxCross2 className='text-2xl'/>
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
                        <div className='flex flex-col items-start'>
                            <label htmlFor="text" className="text-md font-medium text-gray-800 mb-2">
                            Action Name
                            </label>
                            <input
                                type='text'
                                {...register('text')}
                                id='text'
                                className='w-full border border-gray-300 rounded-md px-2 py-1
                                focus:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 '
                                placeholder='Enter new name for this action node here...'    
                            >
                            </input>
                            
                        </div>
                        <div className='flex justify-between'>
                            <div className='pt-2'>
                                <button
                                    type="button"
                                    onClick={() => handleDelete()}
                                    className='px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 border border-red-300 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                                >   
                                    Delete 
                                </button>
                            </div>
                            <div className="flex justify-end space-x-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-4 py-2 bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-800 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                        
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}


export default Level2Page;
