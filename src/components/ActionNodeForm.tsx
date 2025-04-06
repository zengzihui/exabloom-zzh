// ActionNodeForm.jsx
import React, { useEffect} from 'react';
import { useForm } from 'react-hook-form';
import { RxCross2 } from "react-icons/rx";
import { FormValues, SelectedNode } from '../types/flowTypes';

interface ActionNodeFormProps {
  selectedNode: SelectedNode;
  onClose: () => void;
  onSubmit: (data: FormValues) => void;
  onDelete: () => void;
}
const ActionNodeForm: React.FC<ActionNodeFormProps> = ({ 
  selectedNode, 
  onClose, 
  onSubmit, 
  onDelete 
}) => {
  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      text: selectedNode?.data?.text || ''
    }
  });

  // Reset form when selected node changes
  useEffect(() => {
    reset({
      text: selectedNode?.data?.text || ''
    });
  }, [selectedNode, reset]);

  return (
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
            onClick={onClose}
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
            />
          </div>
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

export default ActionNodeForm;