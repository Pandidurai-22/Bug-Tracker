import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { FaBug, FaEllipsisV, FaUser, FaClock, FaPaperclip, FaComment, FaPlus, FaSync } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { getBugs, updateBugStatus } from '../services/api';

// Constants
const statuses = ['Open', 'In Progress', 'In Review', 'Done'];
const issueTypes = {
  'Bug': 'bg-red-100 text-red-800',
  'Task': 'bg-blue-100 text-blue-800',
  'Story': 'bg-green-100 text-green-800',
  'Epic': 'bg-purple-100 text-purple-800'
};

const priorityColors = {
  'low': 'bg-gray-100 text-gray-800',
  'medium': 'bg-yellow-100 text-yellow-800',
  'high': 'bg-red-100 text-red-800',
};

// Helper function to get initials from name
const getInitials = (name) => {
  if (!name) return '??';
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Helper function to format assignee data
const formatAssignee = (assignee) => {
  if (!assignee) return { name: 'Unassigned', avatar: '??' };
  if (typeof assignee === 'string') {
    return { name: assignee, avatar: getInitials(assignee) };
  }
  return assignee;
};

const getStatusClass = (status) => {
  // Convert status to lowercase and replace spaces with hyphens for comparison
  const statusKey = status.toLowerCase().replace(' ', '-');
  
  switch (statusKey) {
    case 'open': 
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'in-progress': 
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'in-review': 
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'done': 
      return 'bg-green-100 text-green-800 border-green-200';
    default: 
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const Dashboard = () => {
  const [bugs, setBugs] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch bugs from the backend
  const fetchBugs = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await getBugs();
      // Transform status to match our UI if needed
      const formattedBugs = data.map(bug => ({
        ...bug,
        status: bug.status.split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ')
      }));
      setBugs(formattedBugs);
    } catch (err) {
      console.error('Error fetching bugs:', err);
      setError('Failed to load bugs. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchBugs();
  }, []);

  // Handle drag end for status changes
  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    // Dropped outside the list or in the same position
    if (!destination || 
        (destination.droppableId === source.droppableId && 
         destination.index === source.index)) {
      return;
    }

    const bugId = draggableId;
    const newStatus = destination.droppableId;
    
    // Optimistic UI update
    const updatedBugs = bugs.map(bug => {
      if (bug.id === bugId) {
        return { ...bug, status: newStatus };
      }
      return bug;
    });
    
    setBugs(updatedBugs);

    try {
      // Update status in the backend
      await updateBugStatus(bugId, newStatus.toLowerCase().replace(' ', '-'));
      // Refresh bugs to ensure consistency
      await fetchBugs();
    } catch (err) {
      console.error('Error updating bug status:', err);
      // Revert on error
      fetchBugs();
    }
  };

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  // Group bugs by status
  const bugsByStatus = statuses.reduce((acc, status) => {
    acc[status] = bugs.filter(bug => bug.status === status);
    return acc;
  }, {});

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }


  return (
    <div className="p-6 bg-gray-50 ">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Bug Tracker</h1>
          <p className="text-gray-600">Track and manage all your bugs in one place</p>
        </div>
        <button
          onClick={() => navigate('/create-bug')}
          className="flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          <FaPlus className="mr-2" /> Create Bug
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <p>{error}</p>
        </div>
      )}

      <div className="flex space-x-4 overflow-x-auto pb-4">
        <DragDropContext onDragEnd={onDragEnd}>
          {statuses.map((status) => (
            <div key={status} className="flex-shrink-0 w-80">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className={`px-4 py-3 ${getStatusClass(status)} font-medium text-sm`}>
                  <div className="flex justify-between items-center">
                    <span>{status}</span>
                    <span className="bg-white bg-opacity-20 px-2 py-0.5 rounded-full text-xs">
                      {bugsByStatus[status]?.length || 0}
                    </span>
                  </div>
                </div>
                <Droppable droppableId={status}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="p-2 min-h-20"
                    >
                      {bugsByStatus[status]?.map((bug, index) => (
                        <Draggable key={bug.id} draggableId={bug.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-white rounded border border-gray-200 mb-2 shadow-sm hover:shadow-md transition-shadow"
                            >
                              <div 
                                className="p-3 cursor-pointer"
                                onClick={() => toggleRow(bug.id === expandedRow ? null : bug.id)}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <span className="text-sm font-medium text-gray-800">{bug.title}</span>
                                  <div className="flex space-x-1">
                                    <span className={`px-2 py-0.5 text-xs rounded-full ${priorityColors[bug.priority.toLowerCase()] || 'bg-gray-100'}`}>
                                      {bug.priority}
                                    </span>
                                    {bug.attachments > 0 && (
                                      <span className="text-gray-400 text-xs flex items-center">
                                        <FaPaperclip className="mr-0.5" /> {bug.attachments}
                                      </span>
                                    )}
                                    {bug.comments > 0 && (
                                      <span className="text-gray-400 text-xs flex items-center">
                                        <FaComment className="mr-0.5" /> {bug.comments}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="flex justify-between items-center text-xs text-gray-500">
                                  <div className="flex items-center">
                                    <div className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs mr-1">
                                      {bug.assignee ? getInitials(bug.assignee.name) : '??'}
                                    </div>
                                    <span>{bug.assignee?.name || 'Unassigned'}</span>
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    {bug.dueDate ? new Date(bug.dueDate).toLocaleDateString() : 'No due date'}
                                  </div>
                                </div>
                              </div>
                              
                              {expandedRow === bug.id && (
                                <div className="px-3 pb-3 pt-1 border-t border-gray-100 text-sm text-gray-600">
                                  <p className="mb-2">{bug.description || 'No description provided'}</p>
                                  <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div>
                                      <span className="font-medium text-gray-500">Reporter:</span>
                                      <span className="ml-1">{bug.reporter || 'N/A'}</span>
                                    </div>
                                    <div>
                                      <span className="font-medium text-gray-500">Created:</span>
                                      <span className="ml-1">
                                        {bug.created ? new Date(bug.created).toLocaleDateString() : 'N/A'}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="font-medium text-gray-500">Updated:</span>
                                      <span className="ml-1">
                                        {bug.updated ? new Date(bug.updated).toLocaleDateString() : 'N/A'}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="font-medium text-gray-500">Type:</span>
                                      <span className="ml-1">{bug.type || 'Bug'}</span>
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
                <div 
                  className="p-2 text-center text-sm text-gray-500 hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate('/create-bug')}
                >
                  + Add a card
                </div>
              </div>
            </div>
          ))}
        </DragDropContext>
      </div>
    </div>
  );
};

export default Dashboard;