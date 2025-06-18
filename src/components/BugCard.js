import React from "react";
import { FaUser, FaClock, FaEllipsisV } from 'react-icons/fa';
import { Draggable } from '@hello-pangea/dnd';

const priorityColors = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-blue-100 text-blue-800',
};

const statusColors = {
  open: 'bg-blue-100 text-blue-800',
  'in-progress': 'bg-yellow-100 text-yellow-800',
  'in-review': 'bg-purple-100 text-purple-800',
  done: 'bg-green-100 text-green-800',
};

const BugCard = ({ bug, index }) => {
  const { id, title, description, priority, status, assignee, dueDate, createdAt } = bug;
  
  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white rounded-lg shadow-md p-4 mb-3 border-l-4 border-blue-500 hover:shadow-lg transition-shadow duration-200 cursor-move"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-gray-900 line-clamp-2">{title}</h3>
            <button className="text-gray-400 hover:text-gray-600">
              <FaEllipsisV size={14} />
            </button>
          </div>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[priority] || 'bg-gray-100'}`}>
                {priority?.charAt(0).toUpperCase() + priority?.slice(1) || 'N/A'}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100'}`}>
                {status?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || 'N/A'}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              {assignee && (
                <span className="flex items-center" title={assignee}>
                  <FaUser className="mr-1" size={10} />
                  {assignee.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              )}
              {dueDate && (
                <span className="flex items-center">
                  <FaClock className="mr-1" size={10} />
                  {new Date(dueDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default BugCard;