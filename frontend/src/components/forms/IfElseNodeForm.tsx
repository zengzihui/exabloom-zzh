import React, { useEffect} from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { RxCross2 } from "react-icons/rx";
import { FormValues, SelectedNode, IfElseFormValues } from '../../types/flowTypes';


interface IfElseNodeFormProps {
    selectedNode: SelectedNode;
    branchNodes: SelectedNode[];
    elseNode: SelectedNode;
    onClose: () => void;
    onSubmit: (data: FormValues) => void;
    onAddBranch: () => void;
    onDelete: () => void;
}

const IfElseNodeForm: React.FC<IfElseNodeFormProps> = ({ 
    selectedNode, 
    branchNodes,
    elseNode,
    onClose, 
    onSubmit, 
    onAddBranch,
    onDelete 
}) => {
    const { register, handleSubmit, reset, control } = useForm<IfElseFormValues>({
        defaultValues: {
            ifElseText: selectedNode?.data?.text,
            branches: branchNodes.map(branch => ({ id: branch.id, title: branch.data.title })),
            elseTitle: elseNode?.data.title || '',
        }
    });

    // UseFieldArray for dynamic branch nodes
    const { fields, append } = useFieldArray({
        control,
        name: 'branches', 
    });

    // Reset form when selected node changes
    useEffect(() => {
        reset({
            ifElseText: selectedNode?.data?.text,
            branches: branchNodes.map(branch => ({ id: branch.id, title: branch.data.title })),
            elseTitle: elseNode?.data.title || '',
        });
    }, [selectedNode, branchNodes, reset]);

    const handleAddBranchClick = () => {
        const newBranchId = `branch-${fields.length + 1}`;
        const newBranchTitle = '';

        // Append the new branch to the form state
        append({ id: newBranchId, title: newBranchTitle });

        // Call the parent function to add the new branch node to the graph
        onAddBranch();
    }

    return (
        <div className="absolute inset-0 z-10" style={{ backgroundColor: 'rgba(0, 0, 0, 0.65)'}}>
            <div className="absolute top-0 right-0 bottom-0 w-[600px] p-8 bg-white shadow-xl flex flex-col h-full">
                <div className="flex gap-4 justify-between border-b border-gray-200 py-2 my-2">
                    <div className='flex flex-col items-start w-full min-w-0'>
                        <h3 
                            className="text-lg font-medium text-gray-800 truncate w-full text-left"
                            title={selectedNode?.data?.title}
                        >
                            Update If-Else Node
                        </h3>
                        <p 
                            className='truncate w-full text-left text-md text-gray-800' 
                            title={selectedNode?.data?.text}
                        >
                            {selectedNode?.data?.text || 'Untitled Node' }
                        </p>
                    </div>
                
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-700 focus:outline-none"
                    >
                        <RxCross2 className='text-2xl'/>
                    </button>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="pt-4 h-full flex flex-col justify-between">
                    <div className='flex flex-col gap-8'>
                        {/* IfElseNode Text */}
                        <div className='flex flex-col items-start'>
                            <label htmlFor="ifElseText" className="text-md font-medium text-gray-800 mb-2">
                                Action Name
                            </label>
                            <input
                                type='text'
                                {...register('ifElseText')}
                                id='ifElseText'
                                className='w-full border border-gray-300 rounded-md px-2 py-1
                                focus:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 '
                                placeholder='Enter new name for this if-else node here...'    
                            />
                        </div>
                
                        {/* Branch Nodes */}
                        <div className='flex flex-col items-start'>
                            <label className="text-md font-medium text-gray-800 mb-2">
                                BRANCHES
                            </label>
                            <div className="max-h-48 overflow-y-auto w-full border border-gray-200 rounded-md p-2">
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex items-center space-x-2 mb-2 w-full">
                                    <input
                                        type="text"
                                        {...register(`branches.${index}.title` as const)}
                                        className="w-full border border-gray-300 rounded-md px-2 py-1
                                        focus:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder={`Enter new name for Branch #${index + 1}`}
                                    />
                                </div>
                            ))}
                            </div>
                            <div className='flex w-full justify-end'>
                                <button
                                    type="button"
                                    onClick={handleAddBranchClick}
                                    className="mt-2 px-4 py-1 text-md font-semibold text-blue-600 rounded hover:text-blue-900"
                                >
                                + Add Branch
                                </button>
                            </div>
                           
                        </div>

                        {/* Else Node */}
                        <div className='flex flex-col items-start'>
                            <label htmlFor="elseTitle" className="text-md font-medium text-gray-800 mb-2">
                                ELSE
                            </label>
                            <input
                                type='text'
                                {...register('elseTitle')}
                                id='elseTitle'
                                className='w-full border border-gray-300 rounded-md px-2 py-1
                                focus:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 '
                                placeholder='Enter new name for the Else Node...'    
                            />
                        </div>
                    </div> 
                    {/* Form Buttons */}
                    <div className='flex justify-between'>
                        <div className='pt-2'>
                            <button
                                type="button"
                                onClick={onDelete}
                                className='px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 border border-red-300 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
                            >   
                                Delete 
                            </button>
                        </div>
                        <div className="flex justify-end space-x-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
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
    );
};

export default IfElseNodeForm;