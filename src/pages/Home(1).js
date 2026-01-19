import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import BugCard from '../components/BugCard';
import KanbanBoard from "../components/kanbanboard";
import { getBugs, updateBugStatus } from '../services/api';

// Dummy data for when backend is not available
const dummyBugs = {
  'open': [
    {
      id: 'bug-1',
      title: 'Login button not working',
      description: 'The login button on the homepage does not respond when clicked.',
      priority: 'high',
      status: 'open',
      assignee: 'John Doe',
      dueDate: '2025-06-20',
      createdAt: '2025-06-15'
    },
    {
      id: 'bug-2',
      title: 'Mobile menu not collapsing',
      description: 'The mobile menu stays open after clicking outside on iOS devices.',
      priority: 'medium',
      status: 'open',
      assignee: 'Jane Smith',
      dueDate: '2025-06-25',
      createdAt: '2025-06-16'
    }
  ],
  'in-progress': [
    {
      id: 'bug-3',
      title: 'API 500 error on search',
      description: 'Search endpoint returns 500 when special characters are used in query.',
      priority: 'high',
      status: 'in-progress',
      assignee: 'Alex Johnson',
      dueDate: '2025-06-18',
      createdAt: '2025-06-14'
    }
  ],
  'in-review': [
    {
      id: 'bug-4',
      title: 'Profile image upload fails',
      description: 'Users cannot upload profile images larger than 2MB.',
      priority: 'medium',
      status: 'in-review',
      assignee: 'Sam Wilson',
      dueDate: '2025-06-17',
      createdAt: '2025-06-13'
    }
  ],
  'done': [
    {
      id: 'bug-5',
      title: 'Fix typo in welcome message',
      description: 'There is a typo in the welcome message on the dashboard.',
      priority: 'low',
      status: 'done',
      assignee: 'Taylor Swift',
      dueDate: '2025-06-10',
      createdAt: '2025-06-08'
    }
  ],
  'resolved': [],
  'closed': []
};

// Map of status values to their display names
const statusDisplayNames = {
  'open': 'Open',
  'in-progress': 'In Progress',
  'in-review': 'In Review',
  'done': 'Done',
  'resolved': 'Resolved',
  'closed': 'Closed'
};

// Helper function to format assignee data
const formatAssignee = (assignee) => {
  if (!assignee) return { name: 'Unassigned', avatar: '??' };
  if (typeof assignee === 'string') {
    return { name: assignee, avatar: getInitials(assignee) };
  }
  return assignee;
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

const Home = ({ refreshTrigger }) => {
  const [bugs, setBugs] = useState({
    'open': [],
    'in-progress': [],
    'in-review': [],
    'done': [],
    'resolved': [],
    'closed': []
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch bugs from the backend or use dummy data if backend is not available
  const fetchBugs = async () => {
    setIsLoading(true);
    try {
      // First try to fetch from the backend
      const data = await getBugs();
      
      // Group bugs by status
      const bugsByStatus = {
        'open': [],
        'in-progress': [],
        'in-review': [],
        'done': [],
        'resolved': [],
        'closed': []
      };
      
      data.forEach(bug => {
        const statusKey = bug.status.toLowerCase();
        if (bugsByStatus[statusKey] !== undefined) {
          bugsByStatus[statusKey].push({
            ...bug,
            assignee: formatAssignee(bug.assignee),
            status: statusDisplayNames[statusKey] || bug.status
          });
        }
      });
      
      setBugs(bugsByStatus);
    } catch (error) {
      console.warn('Backend not available, using dummy data');
      console.warn('Error details:', error.message);
      // If backend fails, use the dummy data
      setBugs(dummyBugs);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch bugs on component mount and when refreshTrigger changes
  useEffect(() => {
    fetchBugs();
  }, [refreshTrigger]);

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;

    // If dropped outside the list
    if (!destination) {
      return;
    }

    // If dropped in the same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Create a new copy of the bugs object to avoid direct state mutation
    const newBugs = { ...bugs };
    
    // Get the source column
    const sourceColumn = [...newBugs[source.droppableId]];
    // Remove the bug from the source column
    const [movedBug] = sourceColumn.splice(source.index, 1);

    // If moving to a different column
    if (source.droppableId !== destination.droppableId) {
      // Get the destination column
      const destColumn = [...newBugs[destination.droppableId]];
      
      // Update the bug's status
      const updatedBug = {
        ...movedBug,
        status: destination.droppableId
      };
      
      // Add the bug to the destination column
      destColumn.splice(destination.index, 0, updatedBug);
      
      // Update the state
      newBugs[source.droppableId] = sourceColumn;
      newBugs[destination.droppableId] = destColumn;
      
      // Optimistic UI update
      setBugs(newBugs);

      try {
        // Update status in the backend
        await updateBugStatus(movedBug.id, destination.droppableId);
      } catch (error) {
        console.error('Error updating bug status:', error);
        // Revert on error
        fetchBugs();
      }
    } else {
      // Moving within the same column
      sourceColumn.splice(destination.index, 0, movedBug);
      newBugs[source.droppableId] = sourceColumn;
      setBugs(newBugs);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Bug Tracker</h1>
        <p className="text-gray-600">Track and manage all your bugs in one place</p>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(bugs).map(([status, bugsList]) => (
            <div key={status} className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-gray-700">{statusDisplayNames[status] || status}</h2>
                <span className="bg-white text-gray-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {bugsList.length}
                </span>
              </div>
              <Droppable droppableId={status}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="min-h-[100px]"
                  >
                    {bugsList.map((bug, index) => (
                      <BugCard key={bug.id} bug={bug} index={index} />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Home;
