import React, { useState } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import BugCard from '../components/BugCard';
import KanbanBoard from "../components/kanbanboard";

const initialBugs = {
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
    'Closed':[
    {
      id:'bug-7',
      title:'About page carousel',
      description:'Carousel issue resolved all changes done',
      priority:'low',
      status:'closed',
      dueDate:'',
      createdAt:'2025-09-12'
    }
  ],
  'Resolved':[
    {
      id: 'bug-6',
      title:'Website is working good',
      description:'Before website had 505 error now resolved',
      priority:'low',
      status:'resolved',
      dueDate:'',
      createdAt:'2025-07-09'
    }
  ],

};

const statusTitles = {
  'open': 'Open',
  'in-progress': 'In Progress',
  'in-review': 'In Review',
  'done': 'Done',
  'Resolved': 'Resolved',
  'Closed':'Closed'
};

const Home = () => {
  const [bugs, setBugs] = useState(initialBugs);

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    // If dropped outside the list or in the same position
    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
      return;
    }

    const sourceColumn = [...bugs[source.droppableId]];
    const [movedBug] = sourceColumn.splice(source.index, 1);
    
    // If moving to a different column
    if (source.droppableId !== destination.droppableId) {
      const destColumn = [...bugs[destination.droppableId]];
      movedBug.status = destination.droppableId;
      destColumn.splice(destination.index, 0, movedBug);
      
      setBugs({
        ...bugs,
        [source.droppableId]: sourceColumn,
        [destination.droppableId]: destColumn
      });
    } else {
      // Moving within the same column
      sourceColumn.splice(destination.index, 0, movedBug);
      setBugs({
        ...bugs,
        [source.droppableId]: sourceColumn
      });
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
                <h2 className="font-semibold text-gray-700">{statusTitles[status]}</h2>
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
