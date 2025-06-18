import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { FaBug, FaEllipsisV, FaUser, FaClock, FaPaperclip, FaComment } from 'react-icons/fa';

// Sample data
const initialBugs = [
  {
    id: 'bug-1',
    key: 'BUG-1',
    title: 'Login button not working',
    type: 'Bug',
    priority: 'High',
    status: 'Open',
    assignee: { name: 'John Doe', avatar: 'JD' },
    reporter: 'Alice Smith',
    created: '2025-06-15',
    updated: '2025-06-16',
    dueDate: '2025-06-20',
    description: 'The login button on the homepage does not respond when clicked.',
    attachments: 2,
    comments: 3
  },
  {
    id: 'bug-2',
    key: 'BUG-2',
    title: 'Mobile menu not collapsing',
    type: 'Bug',
    priority: 'Medium',
    status: 'In Progress',
    assignee: { name: 'Jane Smith', avatar: 'JS' },
    reporter: 'Bob Johnson',
    created: '2025-06-16',
    updated: '2025-06-17',
    dueDate: '2025-06-25',
    description: 'The mobile menu stays open after clicking outside on iOS devices.',
    attachments: 1,
    comments: 1
  },
  {
    id: 'bug-3',
    key: 'BUG-3',
    title: 'API 500 error on search',
    type: 'Bug',
    priority: 'High',
    status: 'In Review',
    assignee: { name: 'Alex Johnson', avatar: 'AJ' },
    reporter: 'Charlie Brown',
    created: '2025-06-14',
    updated: '2025-06-15',
    dueDate: '2025-06-18',
    description: 'Search endpoint returns 500 when special characters are used in query.',
    attachments: 0,
    comments: 2
  },
  {
    id: 'bug-4',
    key: 'BUG-4',
    title: 'Profile image upload fails',
    type: 'Bug',
    priority: 'Medium',
    status: 'Done',
    assignee: { name: 'Sam Wilson', avatar: 'SW' },
    reporter: 'Diana Prince',
    created: '2025-06-13',
    updated: '2025-06-17',
    dueDate: '2025-06-17',
    description: 'Users cannot upload profile images larger than 2MB.',
    attachments: 1,
    comments: 0
  },
  {
    id: 'bug-5',
    key: 'BUG-5',
    title: 'Fix typo in welcome message',
    type: 'Task',
    priority: 'Low',
    status: 'Done',
    assignee: { name: 'Taylor Swift', avatar: 'TS' },
    reporter: 'Emma Watson',
    created: '2025-06-08',
    updated: '2025-06-10',
    dueDate: '2025-06-10',
    description: 'There is a typo in the welcome message on the dashboard.',
    attachments: 0,
    comments: 1
  }
];

const statuses = ['Open', 'In Progress', 'In Review', 'Done'];
const issueTypes = {
  'Bug': 'bg-red-100 text-red-800',
  'Task': 'bg-blue-100 text-blue-800',
  'Story': 'bg-green-100 text-green-800',
  'Epic': 'bg-purple-100 text-purple-800'
};

const priorityColors = {
  'Low': 'bg-gray-100 text-gray-800',
  'Medium': 'bg-yellow-100 text-yellow-800',
  'High': 'bg-red-100 text-red-800',
  'Highest': 'bg-red-600 text-white'
};

const getStatusClass = (status) => {
  switch (status) {
    case 'Open': return 'bg-blue-100 text-blue-800';
    case 'In Progress': return 'bg-yellow-100 text-yellow-800';
    case 'In Review': return 'bg-purple-100 text-purple-800';
    case 'Done': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const Dashboard = () => {
  const [bugs, setBugs] = useState(initialBugs);
  const [expandedRow, setExpandedRow] = useState(null);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(bugs);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setBugs(items);
  };

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="p-6 bg-gray-50 ">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Bug Tracker</h1>
        <p className="text-gray-600">Track and manage all your bugs in one place</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 border-b border-gray-200 font-medium text-gray-500 uppercase tracking-wider">
          <div className="col-span-5">Title</div>
          <div className="col-span-1 text-center">Type</div>
          <div className="col-span-1 text-center">Priority</div>
          <div className="col-span-1 text-center">Status</div>
          <div className="col-span-1 text-center">Assignee</div>
          <div className="col-span-1 text-center">Due Date</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="bugs">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {bugs.map((bug, index) => (
                  <Draggable key={bug.id} draggableId={bug.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <div 
                          className="grid grid-cols-12 gap-4 px-4 py-3 items-center cursor-pointer"
                          onClick={() => toggleRow(bug.id)}
                        >
                          <div className="col-span-5 flex items-center">
                            <div 
                              className="mr-2 text-gray-400"
                              {...provided.dragHandleProps}
                            >
                              <FaBug />
                            </div>
                            <span className="font-medium text-blue-600">{bug.key}</span>
                            <span className="ml-2">{bug.title}</span>
                          </div>
                          <div className="col-span-1 text-center">
                            <span className={`px-2 py-1 text-xs rounded-full ${issueTypes[bug.type] || 'bg-gray-100'}`}>
                              {bug.type}
                            </span>
                          </div>
                          <div className="col-span-1 text-center">
                            <span className={`px-2 py-1 text-xs rounded-full ${priorityColors[bug.priority]}`}>
                              {bug.priority}
                            </span>
                          </div>
                          <div className="col-span-1 text-center">
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusClass(bug.status)}`}>
                              {bug.status}
                            </span>
                          </div>
                          <div className="col-span-1 text-center">
                            {bug.assignee ? (
                              <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs mx-auto">
                                {bug.assignee.avatar}
                              </div>
                            ) : '-'}
                          </div>
                          <div className="col-span-1 text-center text-sm text-gray-600">
                            {new Date(bug.dueDate).toLocaleDateString()}
                          </div>
                          <div className="col-span-2 flex justify-end items-center space-x-2">
                            {bug.attachments > 0 && (
                              <span className="text-gray-500 text-sm flex items-center">
                                <FaPaperclip className="mr-1" /> {bug.attachments}
                              </span>
                            )}
                            {bug.comments > 0 && (
                              <span className="text-gray-500 text-sm flex items-center">
                                <FaComment className="mr-1" /> {bug.comments}
                              </span>
                            )}
                            <button className="text-gray-400 hover:text-gray-600">
                              <FaEllipsisV />
                            </button>
                          </div>
                        </div>
                        
                        {/* Expanded Row */}
                        {expandedRow === bug.id && (
                          <div className="bg-gray-50 p-4 border-t border-gray-200">
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <h4 className="text-sm font-medium text-gray-500">Description</h4>
                                <p className="mt-1 text-sm text-gray-700">{bug.description}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-500">Assignee</h4>
                                <div className="mt-1 flex items-center">
                                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs mr-2">
                                    {bug.assignee.avatar}
                                  </div>
                                  <span className="text-sm text-gray-700">{bug.assignee.name}</span>
                                </div>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-500">Details</h4>
                                <div className="mt-1 space-y-1">
                                  <p className="text-sm text-gray-700">
                                    <span className="font-medium">Reporter:</span> {bug.reporter}
                                  </p>
                                  <p className="text-sm text-gray-700">
                                    <span className="font-medium">Created:</span> {new Date(bug.created).toLocaleDateString()}
                                  </p>
                                  <p className="text-sm text-gray-700">
                                    <span className="font-medium">Updated:</span> {new Date(bug.updated).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

export default Dashboard;
